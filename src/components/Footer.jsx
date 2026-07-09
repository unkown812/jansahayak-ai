import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
  const { setActiveTab } = useApp();

  const linkStyle = {
    background: 'none', border: 'none', padding: 0, textAlign: 'left',
    color: 'var(--muted)', cursor: 'pointer', fontSize: '0.875rem',
    fontWeight: 400, fontFamily: 'var(--font-sans)',
  };

  const colStyle = { display: 'flex', flexDirection: 'column', gap: '12px' };

  return (
    <footer style={{
      borderTop: '1px solid var(--hairline)', padding: '48px 24px 24px',
      background: 'var(--canvas)', marginTop: '48px',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '24px' }}>

          <div style={colStyle}>
            <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--ink)' }}>
              JanSahayak AI
            </span>
            <p style={{ fontSize: '0.8rem', color: 'var(--body)', lineHeight: 1.5, margin: 0 }}>
              AI-powered constituency development planner and MP command center. Bridging citizens and administrators through multilingual AI grievance filing, GIS analytics, and budget optimization.
            </p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <a href="https://github.com/unkown812/janhayak-ai" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--muted)' }} title="GitHub">
                <ExternalLink size={16} />
              </a>
            </div>
          </div>

          <div style={colStyle}>
            <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--ink)' }}>Platform</span>
            <button onClick={() => setActiveTab('landing')} style={linkStyle}>Home</button>
            <button onClick={() => setActiveTab('citizen')} style={linkStyle}>Citizen Portal</button>
            <button onClick={() => setActiveTab('mp')} style={linkStyle}>Command Center</button>
            <button onClick={() => setActiveTab('about')} style={linkStyle}>About</button>
          </div>

          <div style={colStyle}>
            <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--ink)' }}>Features</span>
            <button onClick={() => setActiveTab('citizen')} style={linkStyle}>Voice Grievances</button>
            <button onClick={() => setActiveTab('mp')} style={linkStyle}>GIS Constituency Map</button>
            <button onClick={() => setActiveTab('mp')} style={linkStyle}>Budget Optimizer</button>
            <button onClick={() => setActiveTab('mp')} style={linkStyle}>AI Advisor</button>
          </div>

          <div style={colStyle}>
            <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--ink)' }}>Links</span>
            <a href="https://github.com/unkown812/janhayak-ai" target="_blank" rel="noopener noreferrer" style={{ ...linkStyle, textDecoration: 'underline' }}>
              GitHub Repository
            </a>
            <a href="https://jansahayak-ai.netlify.app" target="_blank" rel="noopener noreferrer" style={{ ...linkStyle, textDecoration: 'underline' }}>
              Live App
            </a>
            <a href="https://hack2skill.com" target="_blank" rel="noopener noreferrer" style={{ ...linkStyle, textDecoration: 'underline' }}>
              Hack2Skill
            </a>
          </div>

        </div>

        <div style={{ height: '1px', backgroundColor: 'var(--hairline)' }} />

        <div style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between',
          alignItems: 'center', gap: '12px', fontSize: '0.75rem', color: 'var(--muted)',
        }}>
          <span>&copy; {new Date().getFullYear()} JanSahayak AI. All rights reserved.</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Built with <Heart size={10} fill="var(--ink)" style={{ color: 'var(--ink)' }} /> for JanSahay
          </span>
        </div>
      </div>
    </footer>
  );
}