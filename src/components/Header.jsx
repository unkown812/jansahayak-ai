import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Menu, LogOut, BookOpen, Home, User } from 'lucide-react';

export default function Header() {
  const {
    activeTab,
    setActiveTab,
    geminiApiKey,
    isLoggedIn,
    user,
    handleLogout
  } = useApp();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setMenuOpen(false);
  };

  return (
    <header style={{
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      borderBottom: '1px solid var(--hairline)',
      background: 'var(--canvas)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Left: Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src="/favicon.png" alt="JanSahayak AI" style={{ height: '40px', width: '50px' }} />
        <span style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--ink)' }}>
          JanSahayak <span style={{ color: 'var(--body)' }}>AI</span>
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--muted)', marginLeft: '8px', display: 'none' }} className="hide-mobile">
          Constituency Development Planner
        </span>
      </div>

      {/* Center: Navigation */}
      <nav className="header-nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        {[
          { key: 'landing', label: 'Home' },
          { key: 'about', label: 'About' },
          { key: 'citizen', label: 'Citizen Portal' },
          { key: 'mp', label: 'Command Center' },
        ].map(item => (
          <button
            key={item.key}
            onClick={() => handleTabClick(item.key)}
            style={{
              padding: '6px 14px',
              fontSize: '0.875rem',
              fontWeight: activeTab === item.key ? '500' : '400',
              color: activeTab === item.key ? 'var(--ink)' : 'var(--body)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              borderRadius: 'var(--rounded-sm)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* API Status */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.75rem',
          color: 'var(--muted)',
        }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: geminiApiKey ? 'var(--success)' : 'var(--warning)',
          }} />
          <span className="hide-mobile" style={{ display: 'none' }}>
            {geminiApiKey ? 'Gemini Live' : 'AI Simulation'}
          </span>
        </div>

        {/* Logged in user */}
        {isLoggedIn && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {user?.user_metadata?.avatar_url && (
              <img
                src={user.user_metadata.avatar_url}
                alt=""
                style={{ width: '24px', height: '24px', borderRadius: '50%' }}
              />
            )}
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--muted)',
                padding: '4px',
              }}
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}

        {/* Mobile menu toggle */}
        <button
          className="header-nav-mobile-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            color: 'var(--ink)',
          }}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="header-nav-mobile-dropdown animate-slide-in" style={{
          position: 'absolute',
          top: '64px',
          left: 0,
          right: 0,
          zIndex: 99,
          background: 'var(--canvas)',
          borderBottom: '1px solid var(--hairline)',
          borderRadius: 0,
        }}>
          {[
            { key: 'landing', label: 'Home', icon: Home },
            { key: 'about', label: 'About', icon: BookOpen },
            { key: 'citizen', label: 'Citizen Portal', icon: User },
            { key: 'mp', label: 'Command Center', icon: Shield },
          ].map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => handleTabClick(item.key)}
                style={{
                  width: '100%',
                  justifyContent: 'flex-start',
                  padding: '12px 24px',
                  fontSize: '0.875rem',
                  fontWeight: activeTab === item.key ? '500' : '400',
                  color: activeTab === item.key ? 'var(--ink)' : 'var(--body)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
