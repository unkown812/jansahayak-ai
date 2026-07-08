import React, { useEffect, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Info } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const CENTER = [20.2961, 85.8245];

const urgencyColor = (urgency) => {
  if (urgency === 'Critical') return '#ef4444';
  if (urgency === 'Medium') return '#f59e0b';
  return '#10b981';
};

const createMarkerIcon = (color, scale = 1) => {
  const size = Math.round(28 * scale);
  const fontSize = Math.round(11 * scale);
  return L.divIcon({
    className: '',
    html: `<svg width="${size}" height="${size}" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2C9.58 2 6 5.58 6 10c0 3.5 8 14 8 14s8-10.5 8-14c0-4.42-3.58-8-8-8z" fill="${color}" stroke="white" stroke-width="1.5"/>
      <circle cx="14" cy="10" r="4" fill="white"/>
    </svg>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

const qualityMarkerIcon = L.divIcon({
  className: '',
  html: `<svg width="32" height="32" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2C9.58 2 6 5.58 6 10c0 3.5 8 14 8 14s8-10.5 8-14c0-4.42-3.58-8-8-8z" fill="#f59e0b" stroke="white" stroke-width="2"/>
    <circle cx="14" cy="10" r="4" fill="white"/>
  </svg>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function ThemeUpdater({ theme }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [theme, map]);
  return null;
}

const getLatLng = (item) => {
  if (item.coordinates && typeof item.coordinates.lat === 'number') {
    return [item.coordinates.lat, item.coordinates.lng];
  }
  if (item.coordinates && typeof item.coordinates.x === 'number') {
    return [
      20.2961 + (item.coordinates.y - 50) * 0.0015,
      85.8245 + (item.coordinates.x - 50) * 0.0018,
    ];
  }
  return CENTER;
};

export default function ConstituencyMap({ onSelectGrievance }) {
  const { grievances, selectedSector, selectedUrgency, theme } = useApp();
  const isDark = theme === 'dark';
  const popupRef = useRef(null);

  const activeMarkers = useMemo(() => {
    return grievances.filter((g) => {
      if (selectedSector !== 'All' && g.sector !== selectedSector) return false;
      if (selectedUrgency !== 'All' && g.urgency !== selectedUrgency) return false;
      return g.status !== 'Resolved';
    });
  }, [grievances, selectedSector, selectedUrgency]);

  const qualityMarkers = useMemo(() => {
    return grievances.filter((g) => {
      if (selectedSector !== 'All' && g.sector !== selectedSector) return false;
      return (
        g.status === 'Resolved' &&
        (g.qualityReports || []).some((r) => r.status !== 'closed')
      );
    });
  }, [grievances, selectedSector, selectedUrgency]);

  const tileUrl = isDark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const attribution = isDark
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

  const handlePopupOpen = (item) => {
    const id = `inspect-${item.id}`;
    setTimeout(() => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.onclick = () => {
          onSelectGrievance(item);
          if (popupRef.current) {
            mapRef.current?._closePopup?.();
          }
        };
      }
    }, 100);
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        flexGrow: 1,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
            Constituency Map Diagnostics
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
            OpenStreetMap spatial overlay of Bhubaneswar Constituency, Odisha
          </span>
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '450px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-tertiary)',
        }}
      >
        <MapContainer
          center={CENTER}
          zoom={13}
          style={{ width: '100%', height: '100%' }}
          zoomControl={true}
          attributionControl={true}
        >
          <ThemeUpdater theme={theme} />
          <TileLayer url={tileUrl} attribution={attribution} />

          {activeMarkers.map((item) => {
            const pos = getLatLng(item);
            const color = urgencyColor(item.urgency);
            const scale = Math.min(1.4, 1 + ((item.supportCount || 0) / 20) * 0.3);
            const supportInfo =
              (item.supportCount || 0) > 0
                ? `<p style="margin:0 0 4px;font-size:11px;color:#d97706"><strong>${item.supportCount}</strong> community supporter(s)</p>`
                : '';

            return (
              <Marker
                key={item.id}
                position={pos}
                icon={createMarkerIcon(color, scale)}
              >
                <Popup>
                  <div style={{ fontFamily: 'sans-serif', maxWidth: '220px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '4px',
                      }}
                    >
                      <span style={{ fontWeight: 'bold', fontSize: '11px', color: '#71717a' }}>
                        {item.id}
                      </span>
                      <span
                        style={{
                          padding: '1px 5px',
                          fontSize: '10px',
                          borderRadius: '4px',
                          fontWeight: 'bold',
                          background: `${color}20`,
                          color,
                        }}
                      >
                        {item.urgency}
                      </span>
                    </div>
                    <h4 style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#18181b' }}>
                      {item.title}
                    </h4>
                    <p style={{ margin: '0 0 6px', fontSize: '11px', color: '#52525b', lineHeight: 1.3 }}>
                      {(item.description || '').substring(0, 80)}...
                    </p>
                    <div dangerouslySetInnerHTML={{ __html: supportInfo }} />
                    <button
                      id={`inspect-${item.id}`}
                      style={{
                        width: '100%',
                        border: 'none',
                        padding: '5px',
                        fontSize: '11px',
                        background: '#2563eb',
                        color: 'white',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                      }}
                    >
                      Inspect Details
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {qualityMarkers.map((item) => {
            const pos = getLatLng(item);
            const openCount = (item.qualityReports || []).filter(
              (r) => r.status !== 'closed'
            ).length;

            return (
              <Marker key={`qlty-${item.id}`} position={pos} icon={qualityMarkerIcon}>
                <Popup>
                  <div style={{ fontFamily: 'sans-serif', maxWidth: '220px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '4px',
                      }}
                    >
                      <span style={{ fontWeight: 'bold', fontSize: '11px', color: '#71717a' }}>
                        {item.id}
                      </span>
                      <span
                        style={{
                          padding: '1px 5px',
                          fontSize: '10px',
                          borderRadius: '4px',
                          fontWeight: 'bold',
                          background: '#f59e0b20',
                          color: '#d97706',
                        }}
                      >
                        MAINTENANCE
                      </span>
                    </div>
                    <h4 style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#18181b' }}>
                      {item.title}
                    </h4>
                    <p style={{ margin: '0 0 4px', fontSize: '11px', color: '#52525b' }}>
                      Resolved but flagged for quality issues
                    </p>
                    <p style={{ margin: '0 0 6px', fontSize: '10px', color: '#d97706' }}>
                      <strong>{openCount}</strong> open maintenance report(s)
                    </p>
                    <button
                      id={`inspect-${item.id}`}
                      style={{
                        width: '100%',
                        border: 'none',
                        padding: '5px',
                        fontSize: '11px',
                        background: '#d97706',
                        color: 'white',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.7rem',
          color: 'var(--text-tertiary)',
          borderTop: '1px solid var(--border-color)',
          paddingTop: '10px',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Info size={12} />
          Active Grievances Geolocated Pins
        </span>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--danger)',
              }}
            ></div>{' '}
            Critical
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--warning)',
              }}
            ></div>{' '}
            Medium
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--success)',
              }}
            ></div>{' '}
            Low
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#f59e0b',
                border: '2px solid white',
              }}
            ></div>{' '}
            Quality Flag
          </span>
        </div>
      </div>
    </div>
  );
}
