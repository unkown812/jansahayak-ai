import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, ArrowRight, Map, Languages, BarChart3, Sliders, Heart, Brain } from 'lucide-react';

export default function LandingPage() {
  const { setActiveTab } = useApp();

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 48px' }}>

      <section style={{ padding: '96px 0', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '4px 12px', borderRadius: 'var(--rounded-pill)',
          border: '1px solid var(--hairline)', fontSize: '0.75rem',
          color: 'var(--muted)', marginBottom: '24px',
        }}>
          <Heart size={12} />
          Built for Code for Communities Hackathon
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 400,
          lineHeight: 1.2, color: 'var(--ink)',
          maxWidth: '900px', margin: '0 auto 16px',
        }}>
          Smart Constituency Development Planner{' '}
          <span style={{ color: 'var(--body)' }}>&amp; AI Command Center</span>
        </h1>

        <p style={{
          fontSize: '0.875rem', color: 'var(--body)', lineHeight: 1.25,
          maxWidth: '700px', margin: '0 auto 32px',
        }}>
          JanSahayak AI is an AI-powered constituency planning platform that helps Members of Parliament manage development grievances, optimize MPLAD budgets, and make data-driven decisions. File multilingual voice grievances, visualize GIS complaint maps, and prioritize projects with AI strategic insights — all from a single command dashboard.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <button
            onClick={() => setActiveTab('citizen')}
            className="btn btn-primary"
          >
            Report a Grievance <ArrowRight size={16} />
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className="btn btn-secondary"
          >
            Learn More
          </button>
        </div>
      </section>

      <section style={{ padding: '96px 0', borderTop: '1px solid var(--hairline)' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 400, textAlign: 'center', marginBottom: '8px' }}>
          AI-Powered Constituency Planning Features
        </h2>
        <p style={{
          fontSize: '0.875rem', color: 'var(--body)', textAlign: 'center',
          marginBottom: '48px',
        }}>
          Everything you need to manage constituency development, from citizen intake to budget execution.
        </p>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px',
        }}>
          {[
            { icon: Map, title: 'GIS Constituency Map', desc: 'Interactive ward map with color-coded grievance density, satisfaction indices, and geolocated pin-drops using OpenStreetMap. Identify complaint hotspots instantly.' },
            { icon: Languages, title: 'Multilingual Voice Grievances', desc: 'Hindi and English speech-to-text via HTML5 Web Speech API. Google Gemini translates voice notes into structured tickets with department and urgency classification.' },
            { icon: BarChart3, title: 'KPI Analytics Dashboard', desc: 'Apache ECharts widgets displaying real-time grievance trends, department backlogs, satisfaction rates, and budget utilization metrics for informed decision-making.' },
            { icon: Sliders, title: 'MPLAD Budget Optimizer', desc: 'Drag-and-drop project prioritization with ₹1 Cr budget cap enforcement. Auto-generated Gantt timelines for sequential project execution planning.' },
            { icon: Brain, title: 'AI Strategic Advisor', desc: 'Gemini-powered constituency health scoring, bottleneck analysis, and budget trade-off recommendations. Generates actionable administrative directives in markdown.' },
            { icon: Shield, title: 'Quality Control Dashboard', desc: 'Track re-open rates, resolution times, and maintenance reports. Create work orders for flagged quality issues and monitor contractor performance.' },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} style={{
                padding: '32px', borderRadius: 'var(--rounded-md)',
                border: '1px solid var(--hairline)', display: 'flex',
                flexDirection: 'column', gap: '12px',
              }}>
                <Icon size={24} style={{ color: 'var(--ink)' }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--ink)' }}>
                  {feature.title}
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--body)', lineHeight: 1.5, margin: 0 }}>
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section style={{ padding: '96px 0' }}>
        <div style={{
          background: 'var(--signature-coral)', borderRadius: 'var(--rounded-lg)',
          padding: '48px', color: 'var(--on-primary)',
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 400, color: 'var(--on-primary)', marginBottom: '16px' }}>
            Citizen Grievance Portal
          </h2>
          <p style={{
            fontSize: '0.875rem', lineHeight: 1.5, color: 'rgba(255,255,255,0.85)',
            maxWidth: '600px', marginBottom: '24px',
          }}>
            File civic development reports using voice in Hindi or English. AI automatically transcribes, translates, categorizes by department (Infrastructure, Water Supply, Sanitation, Public Health), and routes tickets to municipal units for action. Track your grievance status in real-time.
          </p>
          <button
            onClick={() => setActiveTab('citizen')}
            className="btn"
            style={{ background: 'var(--canvas)', color: 'var(--ink)', border: 'none' }}
          >
            File a Grievance <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <section style={{ paddingBottom: '96px' }}>
        <div style={{
          background: 'var(--surface-dark)', borderRadius: 'var(--rounded-lg)',
          padding: '48px', color: 'var(--on-dark)',
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 400, color: 'var(--on-dark)', marginBottom: '16px' }}>
            MP Command Dashboard
          </h2>
          <p style={{
            fontSize: '0.875rem', lineHeight: 1.5, color: 'rgba(255,255,255,0.7)',
            maxWidth: '600px', marginBottom: '24px',
          }}>
            Monitor spatial heatmaps of grievance hotspots, review live complaint feeds, manage constituency development projects, and optimize MPLAD fund allocation — all from a single command center built for Indian Members of Parliament.
          </p>
          <button
            onClick={() => setActiveTab('mp')}
            className="btn"
            style={{ background: 'var(--canvas)', color: 'var(--ink)', border: 'none' }}
          >
            Access Command Center <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <section style={{ paddingBottom: '96px' }}>
        <div style={{
          background: 'var(--surface-strong)', borderRadius: 'var(--rounded-lg)',
          padding: '48px', display: 'flex',
          flexWrap: 'wrap', alignItems: 'center',
          justifyContent: 'space-between', gap: '24px',
        }}>
          <div style={{ flexGrow: 1, minWidth: '250px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 400, color: 'var(--ink)', marginBottom: '4px' }}>
              Ready to explore the dashboard?
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--body)', margin: 0 }}>
              Read the project details or jump directly into the AI-powered Command Center.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={() => setActiveTab('about')} className="btn btn-secondary">
              About the Project
            </button>
            <button onClick={() => setActiveTab('mp')} className="btn btn-primary">
              Access MP Command Dashboard <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}