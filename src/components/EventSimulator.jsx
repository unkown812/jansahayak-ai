import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sliders, Zap, X, CloudRain, Droplets, Landmark, AlertCircle } from 'lucide-react';

export default function EventSimulator() {
  const { triggerSimulatorEvent } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [activeNotification, setActiveNotification] = useState('');

  const handleTrigger = (eventType, label) => {
    triggerSimulatorEvent(eventType);
    setActiveNotification(`Event Triggered: ${label}! Grievances injected successfully.`);
    setTimeout(() => setActiveNotification(''), 4000);
  };

  return (
    <>
      <div className="event-simulator-container">
        {activeNotification && (
          <div style={{
            padding: '12px 18px',
            background: 'var(--primary)',
            color: 'var(--on-primary)',
            borderRadius: 'var(--rounded-lg)',
            fontSize: '0.85rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: 'var(--shadow-lg)',
            animation: 'slideInRight 0.3s ease-out',
          }}>
            <Zap size={16} />
            <span>{activeNotification}</span>
          </div>
        )}

        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="btn btn-primary event-simulator-btn"
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--rounded-pill)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.85rem',
              fontWeight: 500,
            }}
          >
            <Sliders size={16} />
            <span>Demo Event Simulator</span>
          </button>
        ) : (
          <div style={{
            width: '280px',
            padding: '18px',
            background: 'var(--canvas)',
            border: '1px solid var(--hairline)',
            borderRadius: 'var(--rounded-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--hairline)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--ink)' }}>
                <Zap size={14} />
                Constituency Event Simulator
              </span>
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--muted)' }}
              >
                <X size={14} />
              </button>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--body)', margin: 0 }}>
              Trigger mock constituency scenarios to witness live map updates, EChart spike shifts, and budget updates.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
              <button
                onClick={() => handleTrigger('monsoon', 'Monsoon Downpour')}
                className="btn"
                style={{
                  fontSize: '0.75rem',
                  padding: '8px 12px',
                  justifyContent: 'flex-start',
                }}
              >
                <CloudRain size={14} style={{ color: 'var(--info)', marginRight: '6px' }} />
                Heavy Monsoon Storm
              </button>

              <button
                onClick={() => handleTrigger('water_failure', 'Water Main Rupture')}
                className="btn"
                style={{
                  fontSize: '0.75rem',
                  padding: '8px 12px',
                  justifyContent: 'flex-start',
                }}
              >
                <Droplets size={14} style={{ color: 'var(--link)', marginRight: '6px' }} />
                Water Pipeline Failure
              </button>

              <button
                onClick={() => handleTrigger('elections', 'Elections Campaign')}
                className="btn"
                style={{
                  fontSize: '0.75rem',
                  padding: '8px 12px',
                  justifyContent: 'flex-start',
                }}
              >
                <Landmark size={14} style={{ color: 'var(--success)', marginRight: '6px' }} />
                Elections Announced
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.65rem', color: 'var(--muted)' }}>
              <AlertCircle size={12} />
              <span>Injected tickets route directly to Ward feeds.</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
