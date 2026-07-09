import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { Info, Cloud, Droplets, Wind, RefreshCw, Layers } from 'lucide-react';
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

const WMO_CODES = {
  0: { label: 'Clear Sky', icon: '☀️' },
  1: { label: 'Mainly Clear', icon: '🌤️' },
  2: { label: 'Partly Cloudy', icon: '⛅' },
  3: { label: 'Overcast', icon: '☁️' },
  45: { label: 'Foggy', icon: '🌫️' },
  48: { label: 'Depositing Rime Fog', icon: '🌫️' },
  51: { label: 'Light Drizzle', icon: '🌦️' },
  53: { label: 'Moderate Drizzle', icon: '🌦️' },
  55: { label: 'Dense Drizzle', icon: '🌧️' },
  56: { label: 'Light Freezing Drizzle', icon: '🌧️' },
  57: { label: 'Dense Freezing Drizzle', icon: '🌧️' },
  61: { label: 'Slight Rain', icon: '🌦️' },
  63: { label: 'Moderate Rain', icon: '🌧️' },
  65: { label: 'Heavy Rain', icon: '🌧️' },
  66: { label: 'Light Freezing Rain', icon: '🌧️' },
  67: { label: 'Heavy Freezing Rain', icon: '❄️' },
  71: { label: 'Slight Snow', icon: '🌨️' },
  73: { label: 'Moderate Snow', icon: '❄️' },
  75: { label: 'Heavy Snow', icon: '❄️' },
  77: { label: 'Snow Grains', icon: '❄️' },
  80: { label: 'Slight Rain Showers', icon: '🌦️' },
  81: { label: 'Moderate Rain Showers', icon: '🌧️' },
  82: { label: 'Violent Rain Showers', icon: '🌧️' },
  85: { label: 'Slight Snow Showers', icon: '🌨️' },
  86: { label: 'Heavy Snow Showers', icon: '❄️' },
  95: { label: 'Thunderstorm', icon: '⛈️' },
  96: { label: 'Thunderstorm with Slight Hail', icon: '⛈️' },
  99: { label: 'Thunderstorm with Heavy Hail', icon: '⛈️' },
};

const weatherDescription = (code) => WMO_CODES[code] || { label: 'Unknown', icon: '❓' };

function ThemeUpdater({ theme }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [theme, map]);
  return null;
}

const RAINVIEWER_API = 'https://api.rainviewer.com/public/weather-maps.json';

function useWeather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [radarTiles, setRadarTiles] = useState(null);

  const fetchWeather = useCallback(async () => {
    try {
      const [weatherRes, radarRes] = await Promise.all([
        fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=20.2961&longitude=85.8245&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,wind_speed_10m_max&timezone=auto&forecast_days=3`
        ),
        fetch(RAINVIEWER_API),
      ]);
      const weatherData = await weatherRes.json();
      setWeather(weatherData);

      const radarData = await radarRes.json();
      if (radarData?.radar?.past?.length > 0) {
        const frames = radarData.radar.past;
        const latest = frames[frames.length - 1];
        setRadarTiles({
          tileUrl: `${radarData.host}${latest.path}/256/{z}/{x}/{y}/2/1_1.png`,
          time: new Date(latest.time * 1000).toLocaleTimeString(),
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchWeather]);

  return { weather, loading, error, radarTiles };
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

function WeatherPopup({ weather, loading, error, radarTiles, showRadar, onToggleRadar }) {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
        <RefreshCw size={12} className="pulse-glow" />
        Loading weather...
      </div>
    );
  }

  if (error || !weather?.current) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
        <Cloud size={12} />
        Weather unavailable
      </div>
    );
  }

  const c = weather.current;
  const desc = weatherDescription(c.weather_code);
  const daily = weather.daily;
  const today = daily ? {
    max: daily.temperature_2m_max[0],
    min: daily.temperature_2m_min[0],
    precip: daily.precipitation_sum[0],
    code: daily.weather_code[0],
  } : null;

  const forecastItems = daily
    ? [0, 1, 2].map((i) => ({
        day: i === 0 ? 'Today' : new Date(Date.now() + i * 86400000).toLocaleDateString('en-IN', { weekday: 'short' }),
        max: daily.temperature_2m_max[i],
        min: daily.temperature_2m_min[i],
        icon: weatherDescription(daily.weather_code[i]).icon,
      }))
    : [];

  return (
    <div
      style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        zIndex: 1000,
        background: isDark ? 'rgba(24,29,38,0.92)' : 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(8px)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        padding: '10px 12px',
        minWidth: '180px',
        fontSize: '0.72rem',
        color: 'var(--text-primary)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontWeight: 600, fontSize: '0.75rem', color: 'var(--text-primary)' }}>
          {desc.icon} India
        </span>
        <button
          onClick={onToggleRadar}
          style={{
            background: showRadar ? 'var(--link)' : 'transparent',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xs)',
            padding: '2px 6px',
            cursor: 'pointer',
            fontSize: '0.65rem',
            color: showRadar ? '#fff' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
          }}
          title="Toggle precipitation radar overlay"
        >
          <Layers size={10} />
          Radar
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
        <span style={{ fontSize: '1.2rem', fontWeight: 700, lineHeight: 1 }}>
          {Math.round(c.temperature_2m)}°
        </span>
        <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>
          H: {Math.round(today?.max ?? 0)}° L: {Math.round(today?.min ?? 0)}°
        </span>
      </div>

      <div style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>
        {desc.label} · Feels like {Math.round(c.apparent_temperature)}°
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: showRadar ? '4px' : 0 }}>
        {c.relative_humidity_2m != null && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--text-tertiary)' }}>
            <Droplets size={10} /> {c.relative_humidity_2m}%
          </span>
        )}
        {c.wind_speed_10m != null && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--text-tertiary)' }}>
            <Wind size={10} /> {c.wind_speed_10m} km/h
          </span>
        )}
        {c.precipitation != null && Number(c.precipitation) > 0 && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#3b82f6' }}>
            <Droplets size={10} /> {c.precipitation} mm
          </span>
        )}
      </div>

      {showRadar && radarTiles && (
        <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', marginTop: '4px', borderTop: '1px solid var(--border-color)', paddingTop: '4px' }}>
          Precipitation radar · {radarTiles.time}
        </div>
      )}

      {forecastItems.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '6px', borderTop: '1px solid var(--border-color)', paddingTop: '6px' }}>
          {forecastItems.map((item) => (
            <div key={item.day} style={{ textAlign: 'center', flex: 1, fontSize: '0.65rem' }}>
              <div style={{ color: 'var(--text-tertiary)', marginBottom: '2px' }}>{item.day}</div>
              <div style={{ fontSize: '0.85rem' }}>{item.icon}</div>
              <div style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{Math.round(item.max)}°</div>
              <div style={{ color: 'var(--text-tertiary)' }}>{Math.round(item.min)}°</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RadarLayer({ radarTiles, showRadar }) {
  const map = useMap();
  useEffect(() => {
    if (!showRadar || !radarTiles) return;
    const radarLayer = L.tileLayer(radarTiles.tileUrl, {
      opacity: 0.5,
      zIndex: 500,
      attribution: 'Radar &copy; <a href="https://www.rainviewer.com/">RainViewer</a>',
    });
    radarLayer.addTo(map);
    return () => { map.removeLayer(radarLayer); };
  }, [map, radarTiles, showRadar]);
  return null;
}

export default function ConstituencyMap({ onSelectGrievance }) {
  const { grievances, selectedSector, selectedUrgency, theme } = useApp();
  const isDark = theme === 'dark';
  const [showRadar, setShowRadar] = useState(false);
  const { weather, loading, error, radarTiles } = useWeather();

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
            OpenStreetMap spatial overlay of India Constituency, Odisha
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

          <RadarLayer radarTiles={radarTiles} showRadar={showRadar} />

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

        <WeatherPopup
          weather={weather}
          loading={loading}
          error={error}
          radarTiles={radarTiles}
          showRadar={showRadar}
          onToggleRadar={() => setShowRadar((v) => !v)}
        />
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
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          {showRadar && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#3b82f6' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(59,130,246,0.8))' }} />
              Precipitation Radar
            </span>
          )}
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
