import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
  const { setActiveTab } = useApp();

  return (
    <footer className="glass-panel" style={{
      margin: '40px 20px 20px 20px',
      padding: '30px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      borderRadius: 'var(--radius-md)',
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border-color)'
    }}>
      
      {/* Top Section */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '24px'
      }}>
        {/* Left Column: Brand & Description */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="pulse-glow" style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent)'
            }}></div>
            <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
              JanSahayak AI
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0, maxWidth: '340px' }}>
            AI-driven spatial analytics and inclusive civic command tools empowering local communities, citizens, and Members of Parliament.
          </p>
        </div>

        {/* Center Column: Quick Navigation */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Explore
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem' }}>
              <button 
                onClick={() => setActiveTab('landing')} 
                style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', color: 'var(--text-tertiary)', cursor: 'pointer' }}
                className="text-hover-primary"
              >
                Home
              </button>
              <button 
                onClick={() => setActiveTab('about')} 
                style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', color: 'var(--text-tertiary)', cursor: 'pointer' }}
                className="text-hover-primary"
              >
                About
              </button>
              <button 
                onClick={() => setActiveTab('citizen')} 
                style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', color: 'var(--text-tertiary)', cursor: 'pointer' }}
                className="text-hover-primary"
              >
                Citizen Portal
              </button>
              <button 
                onClick={() => setActiveTab('mp')} 
                style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', color: 'var(--text-tertiary)', cursor: 'pointer' }}
                className="text-hover-primary"
              >
                Command Center
              </button>
            </div>
          </div>

          {/* Right Column: Event Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '240px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Hackathon Context
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem', color: 'var(--text-tertiary)', lineHeight: '1.4' }}>
              <span>Build with AI: Code for Communities</span>
              <a 
                href="https://hack2skill.com/event/codeforcommunities/"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                Event Details <ExternalLink size={10} />
              </a>
              <span>Host: Hack2Skill</span>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', backgroundColor: 'var(--border-color)' }}></div>

      {/* Bottom Section */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px',
        fontSize: '0.7rem',
        color: 'var(--text-tertiary)'
      }}>
        <div>
          © {new Date().getFullYear()} JanSahayak AI. All rights reserved.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          Built with <Heart size={10} fill="var(--danger)" style={{ color: 'var(--danger)' }} /> for Code for Communities Track 1
        </div>
      </div>
    </footer>
  );
}
