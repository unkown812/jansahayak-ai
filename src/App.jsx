import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import ConstituencyMap from './components/ConstituencyMap';
import CitizenPortal from './components/CitizenPortal';
import KpiGrid from './components/KpiGrid';
import GrievanceTable from './components/GrievanceTable';
import DetailPanel from './components/DetailPanel';
import Optimizer from './components/Optimizer';
import AiAdvisor from './components/AiAdvisor';
import SocialIngestor from './components/SocialIngestor';
import EventSimulator from './components/EventSimulator';
import LandingPage from './components/LandingPage';
import AboutPage from './components/AboutPage';
import Footer from './components/Footer';
import LoginPortal from './components/LoginPortal';
import { Shield, Sparkles, Sliders, MessageSquare } from 'lucide-react';

function MainAppContent() {
  const { activeTab, isLoggedIn } = useApp();
  const [mpSubTab, setMpSubTab] = useState('grievances'); // 'grievances', 'optimizer', or 'advisor'
  const [selectedGrievance, setSelectedGrievance] = useState(null);

  return (
    <div className="layout-container">
      {/* Brand Header */}
      <Header />

      {/* Landing View */}
      {activeTab === 'landing' && (
        <main style={{ flexGrow: 1 }}>
          <LandingPage />
        </main>
      )}

      {/* About View */}
      {activeTab === 'about' && (
        <main style={{ flexGrow: 1 }}>
          <AboutPage />
        </main>
      )}

      {/* Citizen View */}
      {activeTab === 'citizen' && (
        <main style={{ flexGrow: 1 }}>
          <CitizenPortal />
        </main>
      )}

      {/* MP / Zonal Command View */}
      {activeTab === 'mp' && (
        !isLoggedIn ? (
          <main style={{ flexGrow: 1 }}>
            <LoginPortal />
          </main>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            
            {/* Sub Navigation Bar for MP Workspace */}
            <div className="admin-sub-navbar glass-panel">
              <div className="admin-sub-navbar-label">
                <Shield size={18} style={{ color: 'var(--accent)' }} />
                <span>Constituency Admin Workspace</span>
              </div>

              {/* Sub-tab selectors */}
              <div className="admin-sub-navbar-tabs">
                <button
                  onClick={() => setMpSubTab('grievances')}
                  className="btn"
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: mpSubTab === 'grievances' ? 'var(--accent)' : 'transparent',
                    color: mpSubTab === 'grievances' ? 'var(--accent-text)' : 'var(--text-secondary)',
                    borderColor: mpSubTab === 'grievances' ? 'var(--accent)' : 'transparent',
                    fontWeight: '600',
                    boxShadow: 'none'
                  }}
                >
                  Grievance Command Panel
                </button>
                <button
                  onClick={() => setMpSubTab('optimizer')}
                  className="btn"
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: mpSubTab === 'optimizer' ? 'var(--accent)' : 'transparent',
                    color: mpSubTab === 'optimizer' ? 'var(--accent-text)' : 'var(--text-secondary)',
                    borderColor: mpSubTab === 'optimizer' ? 'var(--accent)' : 'transparent',
                    fontWeight: '600',
                    boxShadow: 'none'
                  }}
                >
                  <Sliders size={14} style={{ marginRight: '6px', verticalAlign: 'middle', display: 'inline' }} />
                  Resource Optimizer
                </button>
                <button
                  onClick={() => setMpSubTab('advisor')}
                  className="btn"
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: mpSubTab === 'advisor' ? 'var(--accent)' : 'transparent',
                    color: mpSubTab === 'advisor' ? 'var(--accent-text)' : 'var(--text-secondary)',
                    borderColor: mpSubTab === 'advisor' ? 'var(--accent)' : 'transparent',
                    fontWeight: '600',
                    boxShadow: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Sparkles size={14} style={{ display: 'inline' }} />
                  AI Strategic Advisor
                </button>
                <button
                  onClick={() => setMpSubTab('social')}
                  className="btn"
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: mpSubTab === 'social' ? 'var(--accent)' : 'transparent',
                    color: mpSubTab === 'social' ? 'var(--accent-text)' : 'var(--text-secondary)',
                    borderColor: mpSubTab === 'social' ? 'var(--accent)' : 'transparent',
                    fontWeight: '600',
                    boxShadow: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <MessageSquare size={14} style={{ display: 'inline' }} />
                  Social Gripe Ingestor
                </button>
              </div>
            </div>

            {/* Sub Workspace Routing */}
            {mpSubTab === 'grievances' ? (
              <main className="dashboard-main-layout">
                {/* Top Row: KPI Statistics */}
                <KpiGrid />

                {/* Bottom Row: Map & Table Workspace */}
                <div className="dashboard-workspace-container">
                  <div className={`dashboard-left-col ${selectedGrievance ? 'shrink' : ''}`}>
                    <div className="dashboard-main-grid">
                      {/* Map Widget */}
                      <ConstituencyMap onSelectGrievance={setSelectedGrievance} />
                      
                      {/* Table List */}
                      <GrievanceTable
                        onSelectGrievance={setSelectedGrievance}
                        selectedGrievanceId={selectedGrievance?.id}
                      />
                    </div>
                  </div>

                  {/* Inspector slide-out right side */}
                  {selectedGrievance && (
                    <div className="detail-panel-wrapper animate-slide-in">
                      <DetailPanel
                        grievance={selectedGrievance}
                        onClose={() => setSelectedGrievance(null)}
                      />
                    </div>
                  )}
                </div>
              </main>
            ) : mpSubTab === 'optimizer' ? (
              <main style={{ flexGrow: 1 }}>
                <Optimizer />
              </main>
            ) : mpSubTab === 'advisor' ? (
              <main style={{ flexGrow: 1, padding: '0 24px' }}>
                <AiAdvisor />
              </main>
            ) : (
              <main style={{ flexGrow: 1, padding: '0 24px' }}>
                <SocialIngestor />
              </main>
            )}
          </div>
        )
      )}

      {/* Floating Demo Event Simulator */}
      <EventSimulator />

      {/* Website Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
