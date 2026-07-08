import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import TrendingIssues from './TrendingIssues';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Mic, MicOff, Sparkles, Send, CheckCircle2, RotateCcw, AlertTriangle, Languages, Navigation, Users, LifeBuoy, ThumbsUp, MessageSquare, TrendingUp } from 'lucide-react';

function DraggableMarker({ position, onMove }) {
  const map = useMap();
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    const m = L.marker([position.lat, position.lng], { draggable: true }).addTo(map);
    m.on('dragend', () => {
      const latlng = m.getLatLng();
      onMove({ lat: latlng.lat, lng: latlng.lng });
    });
    setMarker(m);
    return () => map.removeLayer(m);
  }, []);

  useEffect(() => {
    if (marker) {
      marker.setLatLng([position.lat, position.lng]);
    }
  }, [position, marker]);

  return null;
}

function MapCenterUpdater({ position }) {
  const map = useMap();
  useEffect(() => {
    map.setView([position.lat, position.lng], map.getZoom());
  }, [position, map]);
  return null;
}

export default function CitizenPortal() {
  const { addGrievance, geminiApiKey, grievances, supportGrievance, reportQualityIssue, citizenSubTab, setCitizenSubTab, theme } = useApp();

  // Form states
  const [reporterName, setReporterName] = useState('');

  const [sector, setSector] = useState('Infrastructure');
  const [urgency, setUrgency] = useState('Medium');
  const [description, setDescription] = useState('');

  // Voice state
  const [isListening, setIsListening] = useState(false);
  const [speechLanguage, setSpeechLanguage] = useState('hi-IN'); // Default to Hindi
  const [speechError, setSpeechError] = useState('');

  // AI Refinement state
  const [isRefining, setIsRefining] = useState(false);
  const [refinementLogs, setRefinementLogs] = useState([]);
  const [refinedOutput, setRefinedOutput] = useState('');
  const [showRefinedResult, setShowRefinedResult] = useState(false);

  // Map location selector states
  const [pinLocation, setPinLocation] = useState({ lat: 20.2961, lng: 85.8245 });
  const [searchQuery, setSearchQuery] = useState('');
  const [locating, setLocating] = useState(false);

  // Submission success state
  const [submittedTicket, setSubmittedTicket] = useState(null);

  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;

      rec.onstart = () => {
        setIsListening(true);
        setSpeechError('');
      };

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setDescription((prev) => (prev ? prev + ' ' + transcript : transcript));
        setIsListening(false);
      };

      rec.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setSpeechError(`Voice Error: ${event.error === 'not-allowed' ? 'Microphone permission blocked.' : event.error}`);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  // Set Language whenever selected language changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = speechLanguage;
    }
  }, [speechLanguage]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setSpeechError('Web Speech API is not supported in this browser. Try Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Start error:', err);
        recognitionRef.current.stop();
      }
    }
  };

  // Search location using Nominatim (OpenStreetMap free geocoder)
  const handleSearchLocation = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setLocating(true);
    const fullQuery = searchQuery.toLowerCase().includes('bhubaneswar')
      ? searchQuery
      : `${searchQuery}, Bhubaneswar, Odisha`;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullQuery)}&limit=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      setLocating(false);
      if (data && data.length > 0) {
        const loc = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        setPinLocation(loc);
      } else {
        alert('Could not find that location. Please try adding more details (e.g. landmark, street name).');
      }
    } catch (err) {
      setLocating(false);
      console.error('Geocoding error:', err);
      alert('Search failed. Please try again.');
    }
  };

  const handleShareLiveLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setPinLocation(loc);
      },
      (error) => {
        setLocating(false);
        console.error('Geolocation error:', error);
        alert('Could not retrieve your location. Please check browser location permissions.');
      },
      { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 }
    );
  };



  // Mock stream or Live Gemini AI refiner
  const refineWithAI = async () => {
    if (!description.trim()) {
      alert('Please enter a description first.');
      return;
    }

    setIsRefining(true);
    setRefinementLogs([]);
    setRefinedOutput('');
    setShowRefinedResult(true);

    const logs = [
      geminiApiKey ? 'Establishing connection to Google Gemini 1.5 Flash API...' : 'Establishing connection to Gemini-1.5-Flash...',
      'Analyzing text characteristics and semantic patterns...',
      'Translating and parsing dialect tokens...',
      'Extracting entities (Location, Impact size, Subject)...',
      'Determining optimal department route...',
      geminiApiKey ? 'Generating real-time structured briefing summary...' : 'Synthesizing professional English citation...'
    ];

    // Simulate logs printing out one-by-one
    for (let i = 0; i < logs.length; i++) {
      await new Promise((r) => setTimeout(r, 450));
      setRefinementLogs((prev) => [...prev, `[system] ${logs[i]}`]);
    }

    let refinedText = '';
    let sectorSuggestion = 'Infrastructure';
    let urgencySuggestion = 'Medium';
    let keyToUse = geminiApiKey;

    if (keyToUse) {
      try {
        const promptParts = [
          {
            text: `Translate the following Indian language constituency grievance description into structured, professional English and format it as a report. If a photo is attached, analyze the photo to extract details, identify the issue, and verify the complaint. If no description is provided, analyze the photo and generate the description and details based on what you see.
            
Grievance description from citizen: "${description || 'None provided. Describe the problem based on the attached photo.'}"

Output EXACTLY in the following format (and nothing else):
REPORT: [Short descriptive English title, 4-6 words]
STATUS: [Short status description, e.g., Hazardous municipal blockage]
SECTOR: [Choose exactly one of: Infrastructure, Water Supply, Sanitation, Public Health, Heritage & Tourism, Transport]
EST. IMPACT: [Estimated impact based on content, e.g., 80+ households]

SUMMARY: [A concise, professional 2-3 sentence English summary explaining the problem, the danger it poses, and the urgent action requested from the municipal department.]`
          }
        ];



        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${keyToUse}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: promptParts
            }]
          })
        });
        const data = await response.json();
        refinedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        if (!refinedText) {
          throw new Error(data.error?.message || 'Empty response from Gemini');
        }

        // Try to parse the sector and status suggestions from Gemini's live response
        const sectorMatch = refinedText.match(/SECTOR:\s*(.*)/i);
        if (sectorMatch) {
          const suggested = sectorMatch[1].trim();
          const validSectors = ['Infrastructure', 'Water Supply', 'Sanitation', 'Public Health', 'Heritage/Tourism', 'Transport'];
          const matched = validSectors.find(s => s.toLowerCase() === suggested.toLowerCase());
          if (matched) sectorSuggestion = matched;
        }

        const lowerRefined = refinedText.toLowerCase();
        if (lowerRefined.includes('critical') || lowerRefined.includes('severe') || lowerRefined.includes('urgent') || lowerRefined.includes('hazard')) {
          urgencySuggestion = 'Critical';
        } else if (lowerRefined.includes('high') || lowerRefined.includes('danger')) {
          urgencySuggestion = 'High';
        }

      } catch (err) {
        console.error('Error generating with Gemini API:', err);
        setRefinementLogs((prev) => [...prev, `[error] Live Gemini API failed. Falling back to local simulation...`]);
        keyToUse = ''; // Force fallback
      }
    }

    // Fallback Mock simulation if no API Key or if API request failed
    if (!keyToUse) {
      const lowerInput = description.toLowerCase();
      let impactSuggestion = '50 households';

      if (lowerInput.includes('पानी') || lowerInput.includes('water') || lowerInput.includes('nal')) {
        sectorSuggestion = 'Water Supply';
        urgencySuggestion = lowerInput.includes('गंदा') || lowerInput.includes('muddy') || lowerInput.includes('leak') ? 'Critical' : 'Medium';
        impactSuggestion = '80 households';
        refinedText = `REPORT: Potable Water Supply Impurity\nSTATUS: Unfit for consumption\nSECTOR: Water Supply\nEST. IMPACT: ${impactSuggestion}\n\nSUMMARY: Residents are experiencing contaminated water supply with visible turbidity and heavy odour. Poses immediate enteric public health risk. Urgent sanitization and filter flushing required at local supply mains.`;
      } else if (lowerInput.includes('कचरा') || lowerInput.includes('garbage') || lowerInput.includes('gandagi')) {
        sectorSuggestion = 'Sanitation';
        urgencySuggestion = 'Medium';
        impactSuggestion = '120 households';
        refinedText = `REPORT: Unauthorized Open Garbage Dumping\nSTATUS: Hazardous municipal blockage\nSECTOR: Sanitation\nEST. IMPACT: ${impactSuggestion}\n\nSUMMARY: Heavy accumulation of household and commercial waste on public roadways, attracting stray pests and releasing toxic biogases. Demands immediate sanitation crew dispatch for waste relocation and installation of standard public bins.`;
      } else if (lowerInput.includes('मच्छर') || lowerInput.includes('mosquito') || lowerInput.includes('phc') || lowerInput.includes('health') || lowerInput.includes('doctor')) {
        sectorSuggestion = 'Public Health';
        urgencySuggestion = 'Critical';
        impactSuggestion = '250 residents';
        refinedText = `REPORT: Vector-Borne Breeding Hazard\nSTATUS: Epidemic threat risk\nSECTOR: Public Health\nEST. IMPACT: ${impactSuggestion}\n\nSUMMARY: Severe stagnation of rainy surface runoff causing accelerated breeding of mosquitoes. High local reports of febrile illnesses. Demands rapid action involving chemical anti-larval fogging and immediate water pumping.`;
      } else {
        refinedText = `REPORT: Public Infrastructure Maintenance Request\nSTATUS: General wear\nSECTOR: Infrastructure\nEST. IMPACT: 50+ households\n\nSUMMARY: User reported the following: "${description}". The infrastructure is broken or damaged, leading to local commuting difficulties. Recommend physical audit by municipality engineers.`;
      }
    }

    setSector(sectorSuggestion);
    setUrgency(urgencySuggestion);

    // Typewriter effect for refined output
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < refinedText.length) {
        setRefinedOutput((prev) => prev + refinedText[currentIdx]);
        currentIdx++;
      } else {
        clearInterval(interval);
        setIsRefining(false);
      }
    }, 8);
  };

  const handleApplyRefinement = () => {
    if (refinedOutput) {
      setDescription(refinedOutput);
      setShowRefinedResult(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reporterName.trim() || !description.trim()) {
      alert('Please fill in both Name and Description.');
      return;
    }

    const ticketId = `LKD-${Math.floor(1031 + Math.random() * 1000)}`;
    const newTicket = {
      id: ticketId,
      title: description.split('\n')[0].replace('REPORT: ', '') || 'Citizen Grievance Report',
      description: description,
      translatedDescription: description,
      reporter: reporterName,

      sector: sector,
      urgency: urgency,
      status: 'Pending',
      coordinates: { lat: pinLocation.lat, lng: pinLocation.lng },
      timestamp: new Date().toISOString(),
      impact: 'Est. 50 households'
    };

    localStorage.setItem('js_reporter_name', reporterName.trim());
    handleAddGrievance(newTicket);
    setSubmittedTicket(newTicket);
  };

  const handleResetForm = () => {
    setReporterName('');
    setSector('Infrastructure');
    setUrgency('Medium');
    setDescription('');
    setSubmittedTicket(null);
    setRefinementLogs([]);
    setRefinedOutput('');
    setShowRefinedResult(false);
    setPinLocation({ lat: 20.2961, lng: 85.8245 });
    setSearchQuery('');
  };

  // Quality report modal state
  const [qualityModalGrievanceId, setQualityModalGrievanceId] = useState(null);
  const [qualityReportDesc, setQualityReportDesc] = useState('');

  // Track user's submitted grievance IDs in localStorage
  const [myGrievanceIds, setMyGrievanceIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('js_my_grievances') || '[]');
    } catch {
      return [];
    }
  });

  const userId = useMemo(() => localStorage.getItem('js_user_id') || '', []);

  // Override addGrievance to also track in localStorage
  const handleAddGrievance = (ticket) => {
    addGrievance(ticket);
    const updatedIds = [ticket.id, ...myGrievanceIds];
    setMyGrievanceIds(updatedIds);
    localStorage.setItem('js_my_grievances', JSON.stringify(updatedIds));
  };

  const myGrievances = useMemo(
    () => grievances.filter((g) => myGrievanceIds.includes(g.id)),
    [grievances, myGrievanceIds]
  );

  const handleQualityReportSubmit = (grievanceId, description) => {
    const reporterName = localStorage.getItem('js_reporter_name') || 'Anonymous Citizen';
    reportQualityIssue(grievanceId, description, reporterName);
  };

  const QualityReportModal = () => {
    if (!qualityModalGrievanceId) return null;
    return (
      <div
        className="modal-overlay"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}
        onClick={() => setQualityModalGrievanceId(null)}
      >
        <div
          className="glass-panel"
          style={{
            padding: '24px',
            maxWidth: '440px',
            width: '90%',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} style={{ color: 'var(--warning)' }} />
            Report Quality Issue
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            Describe what went wrong with the resolution of grievance {qualityModalGrievanceId}
          </p>
          <textarea
            className="form-textarea"
            rows="4"
            placeholder="Describe the problem (e.g., road already cracking, pump not working, incomplete work)"
            value={qualityReportDesc}
            onChange={(e) => setQualityReportDesc(e.target.value)}
            style={{ marginBottom: '16px' }}
          />
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button
              className="btn"
              onClick={() => {
                setQualityModalGrievanceId(null);
                setQualityReportDesc('');
              }}
              style={{ fontSize: '0.85rem' }}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                handleQualityReportSubmit(qualityModalGrievanceId, qualityReportDesc);
                setQualityModalGrievanceId(null);
                setQualityReportDesc('');
              }}
              disabled={!qualityReportDesc.trim()}
              style={{ fontSize: '0.85rem' }}
            >
              Submit Report
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (submittedTicket) {
    return (
      <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '40px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
          <CheckCircle2 size={64} style={{ color: 'var(--success)', margin: '0 auto 20px auto' }} />
          <h2 style={{ marginBottom: '10px', fontSize: '1.8rem' }}>Ticket Registered Successfully</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
            Thank you for raising your concern. The JanSahayak AI system has categorized and routed your ticket to the ward administrator.
          </p>

          <div className="glass-panel" style={{ padding: '20px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', textAlign: 'left', marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold' }}>Ticket Reference:</span>
              <span className="badge badge-info">{submittedTicket.id}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Sector:</span>
              <span>{submittedTicket.sector}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Coordinates:</span>
              <span>{submittedTicket.coordinates.lat.toFixed(4)}, {submittedTicket.coordinates.lng.toFixed(4)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Urgency:</span>
              <span className={`badge ${submittedTicket.urgency === 'Critical' ? 'badge-danger' : submittedTicket.urgency === 'Medium' ? 'badge-warning' : 'badge-success'}`}>
                {submittedTicket.urgency}
              </span>
            </div>

            <div style={{ marginTop: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
              <span style={{ fontWeight: '500', display: 'block', marginBottom: '4px' }}>Ticket Description:</span>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>{submittedTicket.description}</p>
            </div>
          </div>

          <button onClick={handleResetForm} className="btn btn-primary" style={{ width: '100%' }}>
            <RotateCcw size={16} /> Submit Another Grievance
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Tab Navigation */}
      <div
        className="glass-panel"
        style={{
          padding: '6px',
          backgroundColor: 'var(--bg-tertiary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          gap: '4px',
          marginBottom: '20px',
        }}
      >
        <button
          onClick={() => setCitizenSubTab('submit')}
          className="btn"
          style={{
            flex: 1,
            padding: '8px 12px',
            fontSize: '0.8rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: citizenSubTab === 'submit' ? 'var(--primary)' : 'transparent',
            color: citizenSubTab === 'submit' ? 'var(--on-primary)' : 'var(--body)',
            border: 'none',
            boxShadow: 'none',
            fontWeight: citizenSubTab === 'submit' ? '600' : '400',
          }}
        >
          <Send size={14} /> Submit New
        </button>
        <button
          onClick={() => setCitizenSubTab('my-issues')}
          className="btn"
          style={{
            flex: 1,
            padding: '8px 12px',
            fontSize: '0.8rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: citizenSubTab === 'my-issues' ? 'var(--primary)' : 'transparent',
            color: citizenSubTab === 'my-issues' ? 'var(--on-primary)' : 'var(--body)',
            border: 'none',
            boxShadow: 'none',
            fontWeight: citizenSubTab === 'my-issues' ? '600' : '400',
          }}
        >
          <LifeBuoy size={14} /> My Issues & Support
        </button>
        <button
          onClick={() => setCitizenSubTab('trending')}
          className="btn"
          style={{
            flex: 1,
            padding: '8px 12px',
            fontSize: '0.8rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: citizenSubTab === 'trending' ? 'var(--primary)' : 'transparent',
            color: citizenSubTab === 'trending' ? 'var(--on-primary)' : 'var(--body)',
            border: 'none',
            boxShadow: 'none',
            fontWeight: citizenSubTab === 'trending' ? '600' : '400',
          }}
        >
          <TrendingUp size={14} /> Trending
        </button>
      </div>

      {/* Quality Report Modal */}
      <QualityReportModal />

      {/* Tab: Submit New */}
      {citizenSubTab === 'submit' && (
        <div className="glass-panel" style={{ padding: '32px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>

          {/* Banner Info */}
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 400, marginBottom: '8px' }}>
              Submit Citizen Grievance
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Report constituency issues directly. Voice complaints are transcribed and translated instantly using client-side AI modules.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            <div className="form-group">
              <label className="form-label" htmlFor="reporter-name">Your Full Name</label>
              <input
                id="reporter-name"
                className="form-input"
                type="text"
                placeholder="Enter your name"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                required
              />
            </div>

            <div className="form-grid-2col">
              {/* Sector Category */}
              <div className="form-group">
                <label className="form-label" htmlFor="sector-select">Complaint Sector</label>
                <select
                  id="sector-select"
                  className="form-select"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                >
                  <option>Infrastructure</option>
                  <option>Water Supply</option>
                  <option>Sanitation</option>
                  <option>Public Health</option>
                  <option>Heritage & Tourism</option>
                  <option>Transport</option>
                </select>
              </div>

              {/* Urgency */}
              <div className="form-group">
                <label className="form-label" htmlFor="urgency-select">Severity Level</label>
                <select
                  id="urgency-select"
                  className="form-select"
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>Critical</option>
                </select>
              </div>
            </div>

            {/* Description Text Area with voice controls */}
            <div className="form-group" style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="form-label" htmlFor="grievance-desc">Describe your Grievance</label>

                {/* Speech recognition buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* Language Select */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <Languages size={14} />
                    <select
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}
                      value={speechLanguage}
                      onChange={(e) => setSpeechLanguage(e.target.value)}
                    >
                      <option value="hi-IN">Hindi (हिंदी)</option>
                      <option value="en-IN">English (India)</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={toggleListening}
                    className="btn"
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: isListening ? 'var(--danger-bg)' : 'var(--bg-tertiary)',
                      borderColor: isListening ? 'var(--danger)' : 'var(--border-color)',
                      color: isListening ? 'var(--danger)' : 'var(--text-primary)'
                    }}
                  >
                    {isListening ? (
                      <>
                        <MicOff size={12} style={{ marginRight: '4px', verticalAlign: 'middle', display: 'inline' }} />
                        Stop Mic
                      </>
                    ) : (
                      <>
                        <Mic size={12} style={{ marginRight: '4px', verticalAlign: 'middle', display: 'inline' }} />
                        Record Voice
                      </>
                    )}
                  </button>
                </div>
              </div>

              <textarea
                id="grievance-desc"
                className="form-textarea"
                rows="6"
                placeholder="Explain the problem. You can type in Hindi/English, or click 'Record Voice' to speak."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>

              {speechError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--danger)', marginTop: '6px' }}>
                  <AlertTriangle size={12} />
                  <span>{speechError}</span>
                </div>
              )}
            </div>



            {/* Map Location Selector */}
            <div className="form-group" style={{ marginTop: '16px', marginBottom: '16px' }}>
              <label className="form-label">Pin Problem Location on Map</label>

              {/* Search and GPS controls */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flexGrow: 1, minWidth: '220px' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Search landmark, colony, or address in Bhubaneswar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSearchLocation(); } }}
                    style={{ paddingRight: '75px' }}
                  />
                  <button
                    type="button"
                    onClick={handleSearchLocation}
                    className="btn"
                    style={{
                      position: 'absolute',
                      right: '4px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      backgroundColor: 'var(--primary)',
                      color: 'var(--on-primary)',
                      border: 'none',
                      borderRadius: 'var(--rounded-sm)',
                      cursor: 'pointer'
                    }}
                    disabled={locating}
                  >
                    Search
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleShareLiveLocation}
                  className="btn"
                  style={{
                    padding: '8px 14px',
                    fontSize: '0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-tertiary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                  disabled={locating}
                >
                  <Navigation size={14} className={locating ? "animate-pulse" : ""} />
                  {locating ? "Locating..." : "Share Live Location"}
                </button>
              </div>

              <p className="text-xs text-zinc-400 mb-2">You can click or drag the red marker pin anywhere on the map to fine-tune the coordinates.</p>
              <div style={{ width: '100%', height: '260px', borderRadius: '8px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                <MapContainer center={[pinLocation.lat, pinLocation.lng]} zoom={13} style={{ width: '100%', height: '100%' }}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <DraggableMarker position={pinLocation} onMove={setPinLocation} />
                  <MapCenterUpdater position={pinLocation} />
                </MapContainer>
              </div>
              <div className="text-xs text-zinc-500 mt-2" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Latitude: {pinLocation.lat.toFixed(6)}</span>
                <span>Longitude: {pinLocation.lng.toFixed(6)}</span>
              </div>
            </div>

            {/* AI Assist Refinement Panel */}
            <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px' }}>
              <button
                type="button"
                onClick={refineWithAI}
                disabled={isRefining || !description.trim()}
                className="btn btn-primary"
                style={{
                  opacity: description.trim() ? 1 : 0.6,
                }}
              >
                <Sparkles size={16} /> {isRefining ? 'Refining...' : 'Refine with AI Assist'}
              </button>
            </div>

            {/* AI Terminal Output Drawer */}
            {showRefinedResult && (
              <div className="glass-panel" style={{ padding: '20px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--ink)' }}>
                    <Sparkles size={14} /> JanSahayak AI Processing
                  </span>
                  {!isRefining && (
                    <button
                      type="button"
                      className="btn"
                      style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                      onClick={() => setShowRefinedResult(false)}
                    >
                      Close
                    </button>
                  )}
                </div>

                {/* Console Logs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontFamily: 'Consolas, monospace', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '16px', maxHeight: '100px', overflowY: 'auto' }}>
                  {refinementLogs.map((log, idx) => (
                    <div key={idx} style={{ borderLeft: '2px solid var(--primary)', paddingLeft: '8px' }}>{log}</div>
                  ))}
                  {isRefining && <div style={{ color: 'var(--muted)', fontWeight: 500 }}>&gt; Core Processing...</div>}
                </div>

                {/* Typewritten Refined Text Box */}
                {(refinedOutput || isRefining) && (
                  <div className="glass-panel" style={{
                    padding: '12px',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    maxHeight: '220px',
                    overflowY: 'auto'
                  }}>
                    <p style={{
                      fontFamily: 'Consolas, monospace',
                      fontSize: '0.85rem',
                      whiteSpace: 'pre-wrap',
                      color: 'var(--text-primary)',
                      margin: 0
                    }}>
                      {refinedOutput}
                    </p>
                  </div>
                )}

                {/* Apply/Keep Button */}
                {!isRefining && refinedOutput && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                    <button
                      type="button"
                      className="btn"
                      style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      onClick={() => setShowRefinedResult(false)}
                    >
                      Discard
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      onClick={handleApplyRefinement}
                    >
                      Apply AI Refined Text
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Form Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '10px' }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <Send size={18} /> Submit Ticket to Command Center
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab: My Issues & Support */}
      {citizenSubTab === 'my-issues' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            className="glass-panel"
            style={{
              padding: '24px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '12px',
                marginBottom: '16px',
              }}
            >
              <h2
                style={{
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <LifeBuoy size={18} style={{ color: 'var(--ink)' }} />
                My Issues & Community Support
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                {myGrievances.length} grievance(s)
              </span>
            </div>

            {myGrievances.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: 'var(--text-tertiary)',
                }}
              >
                <Send size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                <p>You haven't submitted any grievances yet.</p>
                <p style={{ fontSize: '0.8rem' }}>
                  Use the "Submit New" tab to file a grievance.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {myGrievances.map((g) => {
                  const alreadySupported = (g.supporters || []).includes(userId);
                  const isResolved = g.status === 'Resolved';
                  const openReports = (g.qualityReports || []).filter(
                    (r) => r.status !== 'closed'
                  );

                  return (
                    <div
                      key={g.id}
                      className="glass-panel"
                      style={{
                        padding: '16px',
                        backgroundColor: 'var(--bg-tertiary)',
                        border: `1px solid ${openReports.length > 0
                            ? 'var(--warning-border)'
                            : 'var(--border-color)'
                          }`,
                        borderRadius: 'var(--radius-md)',
                      }}
                    >
                      {/* Header row */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '8px',
                        }}
                      >
                        <div>
                          <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>
                            {g.id}
                          </span>
                          <span
                            className={`badge ${g.urgency === 'Critical'
                                ? 'badge-danger'
                                : g.urgency === 'Medium'
                                  ? 'badge-warning'
                                  : 'badge-success'
                              }`}
                            style={{ fontSize: '0.65rem', marginLeft: '6px' }}
                          >
                            {g.urgency}
                          </span>
                          <span
                            className={`badge ${isResolved ? 'badge-success' : 'badge-info'
                              }`}
                            style={{ fontSize: '0.65rem', marginLeft: '6px' }}
                          >
                            {g.status}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                          {new Date(g.timestamp).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Title */}
                      <h4
                        style={{
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          marginBottom: '4px',
                        }}
                      >
                        {g.title}
                      </h4>
                      <p
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--text-secondary)',
                          marginBottom: '12px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {g.description}
                      </p>

                      {/* Action row */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderTop: '1px solid var(--border-color)',
                          paddingTop: '10px',
                          flexWrap: 'wrap',
                          gap: '8px',
                        }}
                      >
                        {/* Support Button */}
                        <button
                          onClick={() => {
                            if (!alreadySupported) {
                              supportGrievance(g.id, userId);
                            }
                          }}
                          disabled={alreadySupported}
                          className="btn"
                          style={{
                            fontSize: '0.75rem',
                            padding: '6px 12px',
                            border: `1px solid ${alreadySupported
                                ? 'var(--success-border)'
                                : 'var(--border-color)'
                              }`,
                            backgroundColor: alreadySupported
                              ? 'var(--success-bg)'
                              : 'var(--bg-secondary)',
                            color: alreadySupported
                              ? 'var(--success)'
                              : 'var(--text-primary)',
                            cursor: alreadySupported ? 'default' : 'pointer',
                          }}
                        >
                          <ThumbsUp size={12} />
                          {alreadySupported
                            ? `Supported ✓ (${g.supportCount || 0})`
                            : `I'm affected (${g.supportCount || 0})`}
                        </button>

                        {/* Quality Report Button (only for resolved) */}
                        {isResolved && (
                          <button
                            onClick={() => {
                              setQualityModalGrievanceId(g.id);
                              setQualityReportDesc('');
                            }}
                            className="btn"
                            style={{
                              fontSize: '0.75rem',
                              padding: '6px 12px',
                              border: '1px solid var(--warning-border)',
                              color: 'var(--warning)',
                              background: 'var(--warning-bg)',
                            }}
                          >
                            <MessageSquare size={12} />
                            Report Issue
                            {openReports.length > 0 && (
                              <span
                                className="badge badge-danger"
                                style={{
                                  fontSize: '0.6rem',
                                  padding: '1px 5px',
                                  marginLeft: '4px',
                                }}
                              >
                                {openReports.length}
                              </span>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Also show support for ALL grievances (browse all active) */}
          <div
            className="glass-panel"
            style={{
              padding: '24px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <h3
              style={{
                fontSize: '1rem',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '10px',
              }}
            >
              <Users size={16} style={{ color: 'var(--ink)' }} />
              Support Other Issues in Your Constituency
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {grievances
                .filter((g) => g.status !== 'Resolved' && !myGrievanceIds.includes(g.id))
                .slice(0, 10)
                .map((g) => {
                  const alreadySupported = (g.supporters || []).includes(userId);
                  return (
                    <div
                      key={g.id}
                      className="glass-panel"
                      style={{
                        padding: '10px 14px',
                        backgroundColor: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <div style={{ flexGrow: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: '0.8rem',
                            fontWeight: '500',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {g.title}
                        </div>
                        <div
                          style={{
                            fontSize: '0.65rem',
                            color: 'var(--text-tertiary)',
                            display: 'flex',
                            gap: '6px',
                          }}
                        >
                          <span>{g.id}</span>
                          <span>•</span>
                          <span>{g.sector}</span>
                          <span>•</span>
                          <span>{g.urgency}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (!alreadySupported) {
                            supportGrievance(g.id, userId);
                          }
                        }}
                        disabled={alreadySupported}
                        className="btn"
                        style={{
                          fontSize: '0.7rem',
                          padding: '4px 10px',
                          flexShrink: 0,
                          border: `1px solid ${alreadySupported
                              ? 'var(--success-border)'
                              : 'var(--border-color)'
                            }`,
                          backgroundColor: alreadySupported
                            ? 'var(--success-bg)'
                            : 'transparent',
                          color: alreadySupported
                            ? 'var(--success)'
                            : 'var(--text-primary)',
                          cursor: alreadySupported ? 'default' : 'pointer',
                        }}
                      >
                        <ThumbsUp size={10} />
                        {alreadySupported
                          ? `✓ ${g.supportCount || 0}`
                          : `${g.supportCount || 0}`}
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Trending */}
      {citizenSubTab === 'trending' && (
        <TrendingIssues />
      )}
    </div>
  );
}
