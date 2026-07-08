import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sun, Moon, Shield, User, Bell, Menu, LogOut, Home, BookOpen } from 'lucide-react';

export default function Header() {
  const {
    theme,
    setTheme,
    activeTab,
    setActiveTab,
    geminiApiKey,
    grievances,
    isLoggedIn,
    user,
    handleLogout
  } = useApp();

  const [menuOpen, setMenuOpen] = useState(false);

  // Filter recent critical or pending grievances for the ticker
  const recentAlerts = grievances
    .filter(g => g.urgency === 'Critical' || g.status === 'Pending')
    .slice(0, 5);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setMenuOpen(false); // Close mobile menu on click
  };

  return (
    <header className="glass-panel" style={{
      margin: '20px 20px 0 20px',
      padding: '12px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-color)',
      background: 'var(--bg-secondary)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Brand row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="logo-sparkle" style={{
            display: 'inline-flex',
            padding: '8px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-glow)',
            color: 'var(--accent)'
          }}>
            <Shield size={20} fill="rgba(var(--accent-rgb), 0.1)" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.15rem', fontWeight: 'bold', margin: 0, tracking: '-0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              JanSahayak <span style={{ color: 'var(--accent)', fontWeight: '800' }}>AI</span>
            </h1>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>Constituency Development & Priority Planner</span>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="header-nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => handleTabClick('landing')}
            className={`btn ${activeTab === 'landing' ? 'btn-primary' : ''}`}
            style={{ padding: '6px 14px', fontSize: '0.8rem', background: activeTab === 'landing' ? '' : 'transparent', border: 'none', boxShadow: 'none' }}
          >
            Home
          </button>
          <button
            onClick={() => handleTabClick('about')}
            className={`btn ${activeTab === 'about' ? 'btn-primary' : ''}`}
            style={{ padding: '6px 14px', fontSize: '0.8rem', background: activeTab === 'about' ? '' : 'transparent', border: 'none', boxShadow: 'none' }}
          >
            About
          </button>
          <button
            onClick={() => handleTabClick('citizen')}
            className={`btn ${activeTab === 'citizen' ? 'btn-primary' : ''}`}
            style={{ padding: '6px 14px', fontSize: '0.8rem', background: activeTab === 'citizen' ? '' : 'transparent', border: 'none', boxShadow: 'none' }}
          >
            Citizen Portal
          </button>
          <button
            onClick={() => handleTabClick('mp')}
            className={`btn ${activeTab === 'mp' ? 'btn-primary' : ''}`}
            style={{ padding: '6px 14px', fontSize: '0.8rem', background: activeTab === 'mp' ? '' : 'transparent', border: 'none', boxShadow: 'none' }}
          >
            Command Center
          </button>
        </nav>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* API Key Status Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              background: geminiApiKey ? 'var(--success-bg)' : 'var(--warning-bg)',
              border: `1px solid ${geminiApiKey ? 'var(--success-border)' : 'var(--warning-border)'}`,
              fontSize: '0.75rem',
              color: geminiApiKey ? 'var(--success)' : 'var(--warning)',
              fontWeight: '500'
            }}
          >
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: geminiApiKey ? 'var(--success)' : 'var(--warning)'
            }}></div>
            {geminiApiKey ? 'Gemini Live' : 'AI Simulation'}
          </div>

          {/* Theme Toggle */}
          <button
            className="btn btn-icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Toggle dark/light mode"
            style={{ border: '1px solid var(--border-color)', background: 'transparent' }}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Sign Out Button & User Details */}
          {isLoggedIn && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {user?.user_metadata?.avatar_url && (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Avatar"
                  style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px solid var(--border-color)' }}
                />
              )}
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={user?.email}>
                {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
              </span>
              <button
                className="btn btn-icon"
                onClick={handleLogout}
                title="Sign Out of Command Center"
                style={{ border: '1px solid var(--danger-border)', background: 'var(--danger-bg)', color: 'var(--danger)' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            className="btn btn-icon header-nav-mobile-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            title="Toggle Menu"
            style={{ border: '1px solid var(--border-color)', background: 'transparent' }}
          >
            <Menu size={16} />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu (rendered below brand row on mobile) */}
      {menuOpen && (
        <div className="header-nav-mobile-dropdown animate-slide-in">
          <button
            onClick={() => handleTabClick('landing')}
            className="btn"
            style={{
              width: '100%',
              justifyContent: 'flex-start',
              background: activeTab === 'landing' ? 'var(--bg-secondary)' : 'transparent',
              color: activeTab === 'landing' ? 'var(--text-primary)' : 'var(--text-tertiary)',
              border: 'none',
              boxShadow: 'none'
            }}
          >
            <Home size={14} style={{ marginRight: '8px' }} />
            Home
          </button>

          <button
            onClick={() => handleTabClick('about')}
            className="btn"
            style={{
              width: '100%',
              justifyContent: 'flex-start',
              background: activeTab === 'about' ? 'var(--bg-secondary)' : 'transparent',
              color: activeTab === 'about' ? 'var(--text-primary)' : 'var(--text-tertiary)',
              border: 'none',
              boxShadow: 'none'
            }}
          >
            <BookOpen size={14} style={{ marginRight: '8px' }} />
            About
          </button>
          
          <button
            onClick={() => handleTabClick('citizen')}
            className="btn"
            style={{
              width: '100%',
              justifyContent: 'flex-start',
              background: activeTab === 'citizen' ? 'var(--bg-secondary)' : 'transparent',
              color: activeTab === 'citizen' ? 'var(--text-primary)' : 'var(--text-tertiary)',
              border: 'none',
              boxShadow: 'none'
            }}
          >
            <User size={14} style={{ marginRight: '8px' }} />
            Citizen Portal
          </button>
          
          <button
            onClick={() => handleTabClick('mp')}
            className="btn"
            style={{
              width: '100%',
              justifyContent: 'flex-start',
              background: activeTab === 'mp' ? 'var(--bg-secondary)' : 'transparent',
              color: activeTab === 'mp' ? 'var(--text-primary)' : 'var(--text-tertiary)',
              border: 'none',
              boxShadow: 'none'
            }}
          >
            <Shield size={14} style={{ marginRight: '8px' }} />
            Command Center
          </button>
        </div>
      )}

      {/* Lower row: Live Incident Ticker */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'var(--bg-tertiary)',
        borderRadius: 'var(--radius-sm)',
        padding: '6px 12px',
        fontSize: '0.8rem',
        overflow: 'hidden',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontWeight: 'bold',
          color: 'var(--danger)',
          marginRight: '16px',
          borderRight: '1px solid var(--border-color)',
          paddingRight: '16px',
          flexShrink: 0
        }}>
          <Bell size={14} className="pulse-glow" style={{ color: 'var(--danger)' }} />
          LIVE constituency FEED
        </div>
        <div style={{ flexGrow: 1, overflow: 'hidden', position: 'relative' }}>
          <div className="marquee-content" style={{ display: 'flex', gap: '40px' }}>
            {recentAlerts.length > 0 ? (
              [...recentAlerts, ...recentAlerts].map((alert, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`badge ${alert.urgency === 'Critical' ? 'badge-danger' : 'badge-warning'}`} style={{ padding: '1px 6px', fontSize: '0.65rem' }}>
                    {alert.id}
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>{alert.title}</span>
                  <span style={{ color: 'var(--text-tertiary)' }}>({alert.sector})</span>
                  <span style={{ color: 'var(--text-tertiary)' }}>•</span>
                </div>
              ))
            ) : (
              <span style={{ color: 'var(--text-tertiary)' }}>No active critical grievances in the constituency. All quiet.</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
