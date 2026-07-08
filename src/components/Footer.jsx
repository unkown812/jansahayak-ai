import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, ExternalLink, Shield } from 'lucide-react';

export default function Footer() {
  const { setActiveTab } = useApp();

  const linkStyle = {
    background: 'none',
    border: 'none',
    padding: 0,
    textAlign: 'left',
    color: 'var(--muted)',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 400,
    fontFamily: 'var(--font-sans)',
  };

  return (
    <footer style={{
      borderTop: '1px solid var(--hairline)',
      padding: '48px 24px 24px',
      background: 'var(--canvas)',
      marginTop: '48px',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
      }}>
        {/* Top: Multi-column */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
          gap: '24px',
        }}>
          {/* Brand */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={18} style={{ color: 'var(--ink)' }} />
              <span style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--ink)' }}>
                JanSahayak AI
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.5, margin: 0, maxWidth: '280px' }}>
              AI-driven spatial analytics and inclusive civic command tools empowering
              local communities, citizens, and Members of Parliament.
            </p>
          </div>

          {/* Platform */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Platform
            </span>
            <button onClick={() => setActiveTab('landing')} style={linkStyle}>Home</button>
            <button onClick={() => setActiveTab('citizen')} style={linkStyle}>Citizen Portal</button>
            <button onClick={() => setActiveTab('mp')} style={linkStyle}>Command Center</button>
          </div>

          {/* Resources */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Resources
            </span>
            <button onClick={() => setActiveTab('about')} style={linkStyle}>About</button>
            <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Documentation</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>API</span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: 'var(--hairline)' }} />

        {/* Bottom */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.75rem',
          color: 'var(--muted)',
        }}>
          <span>&copy; {new Date().getFullYear()} JanSahayak AI. All rights reserved.</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Built with <Heart size={10} fill="var(--ink)" style={{ color: 'var(--ink)' }} /> for Code for Communities
          </span>
        </div>
      </div>
    </footer>
  );
}
