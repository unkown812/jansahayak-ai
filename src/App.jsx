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
import QualityDashboard from './components/QualityDashboard';
import { Shield, Sparkles, Sliders, MessageSquare, AlertTriangle } from 'lucide-react';

function MainAppContent() {
  const { activeTab, isLoggedIn } = useApp();
  const [mpSubTab, setMpSubTab] = useState('grievances'); // 'grievances', 'optimizer', 'advisor', 'social', 'quality'
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
            <div className="admin-sub-navbar">
              <div className="admin-sub-navbar-label">
                <Shield size={18} style={{ color: 'var(--primary)' }} />
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
                    borderRadius: 'var(--rounded-sm)',
                    backgroundColor: mpSubTab === 'grievances' ? 'var(--primary)' : 'transparent',
                    color: mpSubTab === 'grievances' ? 'var(--on-primary)' : 'var(--body)',
                    border: mpSubTab === 'grievances' ? '1px solid var(--primary)' : '1px solid transparent',
                    fontWeight: '500',
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
                    borderRadius: 'var(--rounded-sm)',
                    backgroundColor: mpSubTab === 'optimizer' ? 'var(--primary)' : 'transparent',
                    color: mpSubTab === 'optimizer' ? 'var(--on-primary)' : 'var(--body)',
                    border: mpSubTab === 'optimizer' ? '1px solid var(--primary)' : '1px solid transparent',
                    fontWeight: '500',
                    boxShadow: 'none'
                  }}
                >
                  <Sliders size={14} />
                  Resource Optimizer
                </button>
                <button
                  onClick={() => setMpSubTab('advisor')}
                  className="btn"
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    borderRadius: 'var(--rounded-sm)',
                    backgroundColor: mpSubTab === 'advisor' ? 'var(--primary)' : 'transparent',
                    color: mpSubTab === 'advisor' ? 'var(--on-primary)' : 'var(--body)',
                    border: mpSubTab === 'advisor' ? '1px solid var(--primary)' : '1px solid transparent',
                    fontWeight: '500',
                    boxShadow: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Sparkles size={14} />
                  AI Strategic Advisor
                </button>
                <button
                  onClick={() => setMpSubTab('social')}
                  className="btn"
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    borderRadius: 'var(--rounded-sm)',
                    backgroundColor: mpSubTab === 'social' ? 'var(--primary)' : 'transparent',
                    color: mpSubTab === 'social' ? 'var(--on-primary)' : 'var(--body)',
                    border: mpSubTab === 'social' ? '1px solid var(--primary)' : '1px solid transparent',
                    fontWeight: '500',
                    boxShadow: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <MessageSquare size={14} />
                  Social Gripe Ingestor
                </button>
                <button
                  onClick={() => setMpSubTab('quality')}
                  className="btn"
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    borderRadius: 'var(--rounded-sm)',
                    backgroundColor: mpSubTab === 'quality' ? 'var(--primary)' : 'transparent',
                    color: mpSubTab === 'quality' ? 'var(--on-primary)' : 'var(--body)',
                    border: mpSubTab === 'quality' ? '1px solid var(--primary)' : '1px solid transparent',
                    fontWeight: '500',
                    boxShadow: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <AlertTriangle size={14} />
                  Quality Control
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
            ) : mpSubTab === 'quality' ? (
              <main style={{ flexGrow: 1 }}>
                <QualityDashboard onSelectGrievance={setSelectedGrievance} />
                {selectedGrievance && (
                  <div
                    style={{
                      position: 'fixed',
                      top: 0,
                      right: 0,
                      bottom: 0,
                      width: '420px',
                      maxWidth: '100vw',
                      zIndex: 1000,
                      boxShadow: 'var(--shadow-lg)',
                    }}
                  >
                    <DetailPanel
                      grievance={selectedGrievance}
                      onClose={() => setSelectedGrievance(null)}
                    />
                  </div>
                )}
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
