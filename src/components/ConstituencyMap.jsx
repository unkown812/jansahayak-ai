import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Info } from 'lucide-react';

// Dark Google Maps theme styling
const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#18181b' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#18181b' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#71717a' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#27272a' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#a1a1aa' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#09090b' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#27272a' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#09090b' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3f3f46' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#09090b' }] }
];

// Light Google Maps theme styling
const lightMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#f4f4f5' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#71717a' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#e4e4e7' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#e0f2fe' }] }
];

export default function ConstituencyMap({ onSelectGrievance }) {
  const {
    grievances,
    selectedSector,
    selectedUrgency,
    googleMapsApiKey,
    theme
  } = useApp();

  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const infoWindowRef = useRef(null);
  const markersRef = useRef([]);

  // Geocode location center of Bhubaneswar, Odisha
  const getGrievanceLatLng = (item) => {
    if (item.coordinates && typeof item.coordinates.lat === 'number') {
      return {
        lat: item.coordinates.lat,
        lng: item.coordinates.lng
      };
    }
    if (item.coordinates && typeof item.coordinates.x === 'number') {
      const centerLat = 20.2961;
      const centerLng = 85.8245;
      
      const latOffset = (item.coordinates.y - 50) * 0.0015;
      const lngOffset = (item.coordinates.x - 50) * 0.0018;
      
      return {
        lat: centerLat + latOffset,
        lng: centerLng + lngOffset
      };
    }
    return { lat: 20.2961, lng: 85.8245 };
  };

  // 1. Inject Google Maps Javascript Script tag
  useEffect(() => {
    if (window.google && window.google.maps) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey || ''}`;
    script.async = true;
    script.defer = true;

    const handleScriptLoad = () => setScriptLoaded(true);
    const handleScriptError = () => setLoadError(true);

    script.addEventListener('load', handleScriptLoad);
    script.addEventListener('error', handleScriptError);

    document.head.appendChild(script);

    return () => {
      script.removeEventListener('load', handleScriptLoad);
      script.removeEventListener('error', handleScriptError);
    };
  }, [googleMapsApiKey]);

  // 2. Initialize Google Maps
  useEffect(() => {
    if (!scriptLoaded || !mapContainerRef.current) return;

    // Setup map instance
    const map = new window.google.maps.Map(mapContainerRef.current, {
      center: { lat: 20.2961, lng: 85.8245 },
      zoom: 13,
      styles: theme === 'dark' ? darkMapStyle : lightMapStyle,
      disableDefaultUI: false,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true
    });

    mapInstanceRef.current = map;
    infoWindowRef.current = new window.google.maps.InfoWindow();

    return () => {
      mapInstanceRef.current = null;
    };
  }, [scriptLoaded, theme]);

  // 3. Update Map Theme Styling
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setOptions({
      styles: theme === 'dark' ? darkMapStyle : lightMapStyle
    });
  }, [theme]);

  // 4. Render Grievance Markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    // Filter grievances based on dashboard selections
    const filteredGrievances = grievances.filter((g) => {
      if (selectedSector !== 'All' && g.sector !== selectedSector) return false;
      if (selectedUrgency !== 'All' && g.urgency !== selectedUrgency) return false;
      return g.status !== 'Resolved';
    });

    // Plot markers
    filteredGrievances.forEach((item) => {
      const latLng = getGrievanceLatLng(item);
      const color = item.urgency === 'Critical' ? '#ef4444' : item.urgency === 'Medium' ? '#f59e0b' : '#10b981';

      const pinIcon = {
        path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
        fillColor: color,
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 1.5,
        scale: 1.2,
        anchor: new window.google.maps.Point(12, 22)
      };

      const marker = new window.google.maps.Marker({
        position: latLng,
        map: mapInstanceRef.current,
        icon: pinIcon,
        title: item.title
      });

      marker.addListener('click', () => {
        const contentString = `
          <div style="padding: 10px; color: #18181b; font-family: sans-serif; max-width: 250px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-weight: bold; font-size: 0.75rem; color: #71717a;">${item.id}</span>
              <span style="padding: 2px 6px; font-size: 0.65rem; border-radius: 4px; font-weight: bold; background: ${color}20; color: ${color};">${item.urgency}</span>
            </div>
            <h4 style="margin: 0 0 6px 0; font-size: 0.85rem; font-weight: 600; color: #18181b;">${item.title}</h4>
            <p style="margin: 0 0 10px 0; font-size: 0.75rem; color: #52525b; line-height: 1.3;">${item.description.substring(0, 80)}...</p>
            <button 
              id="inspect-btn-${item.id}"
              style="width: 100%; border: none; padding: 6px; font-size: 0.75rem; background: #2563eb; color: white; border-radius: 4px; cursor: pointer; font-weight: bold;"
            >
              Inspect Details
            </button>
          </div>
        `;

        infoWindowRef.current.setContent(contentString);
        infoWindowRef.current.open(mapInstanceRef.current, marker);

        window.google.maps.event.addListenerOnce(infoWindowRef.current, 'domready', () => {
          const btn = document.getElementById(`inspect-btn-${item.id}`);
          if (btn) {
            btn.onclick = () => {
              onSelectGrievance(item);
              infoWindowRef.current.close();
            };
          }
        });
      });

      markersRef.current.push(marker);
    });
  }, [grievances, selectedSector, selectedUrgency, scriptLoaded, onSelectGrievance]);

  return (
    <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', flexGrow: 1 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>Constituency Map Diagnostics</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Live Google Maps spatial overlay of Bhubaneswar Constituency, Odisha</span>
        </div>
      </div>

      {/* Map Container */}
      <div style={{ position: 'relative', width: '100%', height: '450px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', overflow: 'hidden', backgroundColor: 'var(--bg-tertiary)' }}>
        {loadError ? (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContext: 'center', padding: '20px', color: 'var(--danger)', fontSize: '0.85rem' }}>
            <p>Failed to load Google Maps script. Check your internet connection or API Key configuration.</p>
          </div>
        ) : !scriptLoaded ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            <span className="pulse-glow" style={{ padding: '8px 16px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--bg-secondary)' }}>Loading Google Maps...</span>
          </div>
        ) : (
          <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
        )}
      </div>

      {/* Helper Legend */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: 'var(--text-tertiary)', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Info size={12} />
          Active Grievances Geolocated Pins
        </span>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--danger)' }}></div> Critical</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--warning)' }}></div> Medium</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)' }}></div> Low</span>
        </div>
      </div>
    </div>
  );
}
