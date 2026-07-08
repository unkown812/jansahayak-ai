import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, User, Info, ArrowRight, Map, Languages, BarChart3, Sliders, Heart } from 'lucide-react';

export default function LandingPage() {
  const { setActiveTab } = useApp();

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '60px' }}>
      
      {/* HERO SECTION */}
      <section className="glass-panel-glow" style={{
        padding: '60px 30px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glowing Background Orbs */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none'
        }}></div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Hackathon Tag */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--accent-glow)',
            border: '1px solid var(--border-color)',
            fontSize: '0.8rem',
            color: 'var(--accent)',
            fontWeight: '600',
            marginBottom: '24px'
          }}>
            <Heart size={12} fill="var(--accent)" />
            Built for Code for Communities Hackathon
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            lineHeight: '1.2',
            fontWeight: '800',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, var(--text-primary) 30%, var(--accent) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.03em'
          }}>
            Smart Constituency Planning & Command Center
          </h1>
          
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: '800px',
            margin: '0 auto 40px auto',
            lineHeight: '1.6'
          }}>
            JanSahayak AI bridges the gap between citizens and local administrators. Empowering citizens with multi-lingual voice grievances and equipping MPs with predictive spatial dashboards and budget resource optimizers.
          </p>

          {/* Action Cards Grid */}
          <div className="form-grid-2col" style={{ maxWidth: '800px', margin: '0 auto', gap: '20px' }}>
            {/* Citizen Action */}
            <div 
              onClick={() => setActiveTab('citizen')}
              className="glass-panel table-row-hover" 
              style={{
                padding: '28px',
                textAlign: 'left',
                cursor: 'pointer',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <div style={{ display: 'inline-flex', padding: '10px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--success-bg)', color: 'var(--success)', alignSelf: 'flex-start' }}>
                <User size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Citizen Portal</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                File civic reports using regional voice notes. AI automatically transcribes, translates, and filters tickets directly to municipal units.
              </p>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: 'auto' }}>
                Report Grievance <ArrowRight size={14} />
              </span>
            </div>

            {/* MP Action */}
            <div 
              onClick={() => setActiveTab('mp')}
              className="glass-panel table-row-hover" 
              style={{
                padding: '28px',
                textAlign: 'left',
                cursor: 'pointer',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <div style={{ display: 'inline-flex', padding: '10px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--accent-glow)', color: 'var(--accent)', alignSelf: 'flex-start' }}>
                <Shield size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Command Dashboard</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                Access the MP Command Center. Monitor spatial heatmaps, review live grievance feeds, and optimize constituency developmental budgets.
              </p>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: 'auto' }}>
                Access Command Center <ArrowRight size={14} />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FUNCTIONAL PILLARS */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '8px' }}>Core Platform Features</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Discover the analytical mechanisms powering constituency planning.</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px'
        }}>
          {/* Feature 1 */}
          <div className="glass-panel" style={{ padding: '24px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ color: 'var(--accent)', marginBottom: '4px' }}>
              <Map size={24} />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold' }}>Interactive SVG Map</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
              Color-coded ward regions displaying real-time grievance density and satisfaction indices, complete with geolocated pin-drops.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-panel" style={{ padding: '24px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ color: 'var(--accent)', marginBottom: '4px' }}>
              <Languages size={24} />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold' }}>Multi-Lingual Voice Translation</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
              HTML5 speech recognition supporting Indic dialects (Hindi/English), translating messy voice notes into clean structured tickets.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-panel" style={{ padding: '24px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ color: 'var(--accent)', marginBottom: '4px' }}>
              <BarChart3 size={24} />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold' }}>Visual Analytics Dashboard</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
              Embedded, responsive Apache ECharts widgets displaying weekly incident spikes and categorical department metrics.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="glass-panel" style={{ padding: '24px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ color: 'var(--accent)', marginBottom: '4px' }}>
              <Sliders size={24} />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold' }}>Budget Resource Optimizer</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
              Dnd-kit prioritized scheduling matching resource estimates to a ₹1.0Cr budget cap, complete with responsive Gantt charts.
            </p>
          </div>
        </div>
      </section>

      {/* QUICK STATS & CALL TO ACTION */}
      <section className="glass-panel" style={{
        padding: '30px',
        backgroundColor: 'var(--bg-tertiary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px'
      }}>
        <div style={{ flexGrow: 1, minWidth: '250px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '4px' }}>Ready to explore the dashboard?</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
            Read the problem statement and methodology on the project details page, or jump directly into Command Mode.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setActiveTab('about')}
            className="btn"
            style={{ fontSize: '0.8rem', padding: '10px 16px' }}
          >
            <Info size={14} /> Learn About Project
          </button>
          
          <button 
            onClick={() => setActiveTab('mp')}
            className="btn btn-primary"
            style={{ fontSize: '0.8rem', padding: '10px 16px' }}
          >
            Access MP Command Dashboard <ArrowRight size={14} />
          </button>
        </div>
      </section>
    </div>
  );
}
