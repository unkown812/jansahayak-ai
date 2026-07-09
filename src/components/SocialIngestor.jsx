import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, PlusCircle, CheckCircle, RefreshCw, Send, AlertTriangle, Sparkles, Terminal } from 'lucide-react';

const sampleSocialPosts = [
  {
    id: "gripe_1",
    handle: "@IndiaPulse",
    text: "Jayadev Vihar main crossing is completely flooded! Drainage is fully choked and water is gushing out. Cars stalled everywhere. #IndiaRains",
    time: "10 mins ago",
    avatar: "BP",
    avatarColor: "#3b82f6"
  },
  {
    id: "gripe_2",
    handle: "@PrachiMohanty",
    text: "No tap water supply in Patia Kalarahanga area since yesterday morning. Local water tankers are charging 1500 rupees. High salinity issues! BMC look into this.",
    time: "25 mins ago",
    avatar: "PM",
    avatarColor: "#ec4899"
  },
  {
    id: "gripe_3",
    handle: "@SmartCityWatch",
    text: "Gigantic garbage pile accumulating right behind the Heritage Temple entrance in Old Town. Tourists are complaining about the stench. #SanitationCrisis",
    time: "1 hour ago",
    avatar: "SW",
    avatarColor: "#10b981"
  },
  {
    id: "gripe_4",
    handle: "@BikashRanjan",
    text: "Traffic light system at Master Canteen Square has blacked out. Major chaos, gridlocks during office rush hours. Needs urgent transformer replacement.",
    time: "2 hours ago",
    avatar: "BR",
    avatarColor: "#f59e0b"
  }
];

export default function SocialIngestor() {
  const { addGrievance, geminiApiKey } = useApp();
  const [posts, setPosts] = useState(sampleSocialPosts);
  const [ingestingId, setIngestingId] = useState(null);
  const [ingestedList, setIngestedList] = useState([]);
  const [logs, setLogs] = useState([]);

  const handleIngestGripe = async (post) => {
    setIngestingId(post.id);
    setLogs([]);
    addLog(`Initiating AI parsing on post by ${post.handle}...`);
    addLog(`Establishing connection to Google Gemini 1.5 Flash...`);

    const prompt = `You are the Chief AI Strategic Analyst for JanSahayak AI. 
Analyze the following citizen social media complaint:
"${post.text}"

Extract and structure the data into a JSON object. You MUST output ONLY raw, valid JSON with exactly the following keys:
{
  "title": "A concise, professional 4-6 word English title summarizing the issue",
  "description": "The cleaned up English description of the issue based on the post details",
  "sector": "One of: Infrastructure, Water Supply, Sanitation, Public Health, Heritage & Tourism, Transport",
  "urgency": "One of: Low, Medium, Critical",
  "coordinates": {
    "lat": 20.2961, 
    "lng": 85.8245
  },
  "impact": "A short 2-3 word estimation of impact (e.g. '100+ commuters', '50+ households')"
}
Make sure you estimate reasonable geocoded coordinates in India, Odisha corresponding to the location mentioned in the post (India is centered around lat 20.2961, lng 85.8245). 
- If Jayadev Vihar, use latitude ~20.298, longitude ~85.820.
- If Patia, use latitude ~20.354, longitude ~85.818.
- If Old Town, use latitude ~20.246, longitude ~85.833.
- If Master Canteen, use latitude ~20.286, longitude ~85.843.

Do NOT wrap the JSON in markdown code blocks. Just return the raw JSON string.`;

    let resultJson = null;

    if (geminiApiKey) {
      try {
        await new Promise((r) => setTimeout(r, 600));
        addLog(`Analyzing semantic spatial indicators for geocoding...`);

        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${geminiApiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }]
          })
        });

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        
        // Clean JSON from codeblocks if Gemini added them
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        resultJson = JSON.parse(cleanedText);

        addLog(`Successfully extracted category: ${resultJson.sector}`);
        addLog(`Geocoded coordinates: ${resultJson.coordinates.lat}, ${resultJson.coordinates.lng}`);

      } catch (err) {
        console.error('Gemini error:', err);
        addLog(`[Error] Live Gemini API failed. Loading default geocoded offsets...`);
        resultJson = getDefaultOffsets(post);
      }
    } else {
      addLog(`[Notice] Gemini API Key not detected. Simulating AI parsing...`);
      await new Promise((r) => setTimeout(r, 1200));
      resultJson = getDefaultOffsets(post);
    }

    if (resultJson) {
      const ticketId = `LKD-SOC-${Math.floor(1000 + Math.random() * 9000)}`;
      const newTicket = {
        id: ticketId,
        title: resultJson.title,
        description: `Source: Social media post from ${post.handle}\n\n${resultJson.description}`,
        translatedDescription: resultJson.description,
        reporter: post.handle,
        sector: resultJson.sector,
        urgency: resultJson.urgency,
        status: 'Pending',
        coordinates: resultJson.coordinates,
        timestamp: new Date().toISOString(),
        impact: resultJson.impact
      };

      await addGrievance(newTicket);
      addLog(`[Success] Grievance logged into Supabase with ID: ${ticketId}`);
      setIngestedList((prev) => [...prev, post.id]);
    }

    setIngestingId(null);
  };

  const addLog = (msg) => {
    setLogs((prev) => [...prev, `[ai-ingestor] ${msg}`]);
  };

  const getDefaultOffsets = (post) => {
    const defaultData = {
      gripe_1: {
        title: 'Road Flooding at Jayadev Vihar',
        description: 'Choked drainage pipes have caused severe road flooding at Jayadev Vihar, stalling traffic.',
        sector: 'Infrastructure',
        urgency: 'Critical',
        coordinates: { lat: 20.2982, lng: 85.8201 },
        impact: '400+ commuters'
      },
      gripe_2: {
        title: 'Tap Water Disruption in Patia',
        description: 'Municipal water line supply has failed in Patia area. High salinity reported in auxiliary reserves.',
        sector: 'Water Supply',
        urgency: 'Critical',
        coordinates: { lat: 20.3541, lng: 85.8182 },
        impact: '150+ households'
      },
      gripe_3: {
        title: 'Heritage Temple Waste Accumulation',
        description: 'Heavy piles of garbage and sanitation waste accumulating near the main entrance in Old Town heritage corridor.',
        sector: 'Sanitation',
        urgency: 'Medium',
        coordinates: { lat: 20.2464, lng: 85.8335 },
        impact: 'Tourists & Temple'
      },
      gripe_4: {
        title: 'Master Canteen Square Signal Blackout',
        description: 'Power grid transformer malfunction leading to a blackout of traffic signal poles in Master Canteen Square.',
        sector: 'Transport',
        urgency: 'Medium',
        coordinates: { lat: 20.2863, lng: 85.8431 },
        impact: 'Rush-hour traffic'
      }
    };
    return defaultData[post.id] || {
      title: 'Social Media Grievance Ingestion',
      description: post.text,
      sector: 'Infrastructure',
      urgency: 'Medium',
      coordinates: { lat: 20.2961, lng: 85.8245 },
      impact: 'Constituency'
    };
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', padding: '20px 0' }}>
      
      {/* Feed Area */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>Social Media Gripe Stream</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Live geolocated public complaints scraped in India</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {posts.map((post) => {
            const isIngested = ingestedList.includes(post.id);
            const isProcessing = ingestingId === post.id;
            return (
              <div 
                key={post.id} 
                className="glass-panel" 
                style={{ 
                  padding: '16px', 
                  backgroundColor: 'var(--bg-secondary)', 
                  border: isIngested ? '1px solid var(--success-border)' : '1px solid var(--border-color)',
                  opacity: isIngested ? 0.75 : 1,
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      backgroundColor: post.avatarColor, 
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      {post.avatar}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{post.handle}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{post.time}</div>
                    </div>
                  </div>

                  <span style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MessageSquare size={14} />
                  </span>
                </div>

                {/* Body */}
                <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.4', margin: '0 0 16px 0' }}>
                  {post.text}
                </p>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                  {isIngested ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--success)', fontWeight: 'bold' }}>
                      <CheckCircle size={14} /> Ingested to Database
                    </span>
                  ) : (
                    <button
                      onClick={() => handleIngestGripe(post)}
                      className="btn btn-primary"
                      style={{ 
                        fontSize: '0.75rem', 
                        padding: '6px 12px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                      disabled={ingestingId !== null}
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw size={12} className="animate-spin" />
                          Ingesting...
                        </>
                      ) : (
                        <>
                          <Sparkles size={12} />
                          Ingest as Grievance
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Logger Sidebar */}
     

    </div>
  );
}
