import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, User, ArrowRight, Map, Languages, BarChart3, Sliders, Heart } from 'lucide-react';

export default function LandingPage() {
  const { setActiveTab } = useApp();

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 48px' }}>

      {/* HERO — White canvas, no gradient, no orbs */}
      <section style={{
        padding: '96px 0',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: 'var(--rounded-pill)',
          border: '1px solid var(--hairline)',
          fontSize: '0.75rem',
          color: 'var(--muted)',
          marginBottom: '24px',
        }}>
          <Heart size={12} />
          Built for Code for Communities Hackathon
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 4vw, 2.5rem)',
          fontWeight: 400,
          lineHeight: 1.2,
          color: 'var(--ink)',
          maxWidth: '900px',
          margin: '0 auto 16px',
        }}>
          Smart Constituency Planning{' '}
          <span style={{ color: 'var(--body)' }}>&amp; Command Center</span>
        </h1>

        <p style={{
          fontSize: '0.875rem',
          color: 'var(--body)',
          lineHeight: 1.25,
          maxWidth: '700px',
          margin: '0 auto 32px',
        }}>
          JanSahayak AI bridges the gap between citizens and local administrators.
          Multilingual voice grievances, predictive spatial dashboards, and budget
          resource optimizers — all in one platform.
        </p>

        {/* Primary + Secondary button pair — Airtable signature */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <button
            onClick={() => setActiveTab('citizen')}
            className="btn btn-primary"
          >
            Get Started <ArrowRight size={16} />
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className="btn btn-secondary"
          >
            Learn More
          </button>
        </div>
      </section>

      {/* Core Platform Features — clean cards */}
      <section style={{
        padding: '96px 0',
        borderTop: '1px solid var(--hairline)',
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 400,
          textAlign: 'center',
          marginBottom: '8px',
        }}>
          Core Platform Features
        </h2>
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--body)',
          textAlign: 'center',
          marginBottom: '48px',
        }}>
          Discover the analytical mechanisms powering constituency planning.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
        }}>
          {[
            { icon: Map, title: 'Interactive SVG Map', desc: 'Color-coded ward regions displaying real-time grievance density and satisfaction indices with geolocated pin-drops.' },
            { icon: Languages, title: 'Multi-Lingual Voice Translation', desc: 'HTML5 speech recognition supporting Indic dialects, translating voice notes into clean structured tickets.' },
            { icon: BarChart3, title: 'Visual Analytics Dashboard', desc: 'Embedded Apache ECharts widgets displaying weekly incident spikes and categorical department metrics.' },
            { icon: Sliders, title: 'Budget Resource Optimizer', desc: 'Drag-and-drop priority scheduling matching resource estimates to budget caps with Gantt charts.' },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} style={{
                padding: '32px',
                borderRadius: 'var(--rounded-md)',
                border: '1px solid var(--hairline)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
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

      {/* SIGNATURE CORAL CARD — Full-bleed brand voltage */}
      <section style={{
        padding: '96px 0',
      }}>
        <div style={{
          background: 'var(--signature-coral)',
          borderRadius: 'var(--rounded-lg)',
          padding: '48px',
          color: 'var(--on-primary)',
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 400,
            color: 'var(--on-primary)',
            marginBottom: '16px',
          }}>
            Citizen Portal
          </h2>
          <p style={{
            fontSize: '0.875rem',
            lineHeight: 1.5,
            color: 'rgba(255,255,255,0.85)',
            maxWidth: '600px',
            marginBottom: '24px',
          }}>
            File civic reports using regional voice notes. AI automatically transcribes,
            translates, and routes tickets directly to municipal units for action.
          </p>
          <button
            onClick={() => setActiveTab('citizen')}
            className="btn"
            style={{
              background: 'var(--canvas)',
              color: 'var(--ink)',
              border: 'none',
            }}
          >
            Report a Grievance <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* DARK CTA CARD — Mid-page voltage */}
      <section style={{
        paddingBottom: '96px',
      }}>
        <div style={{
          background: 'var(--surface-dark)',
          borderRadius: 'var(--rounded-lg)',
          padding: '48px',
          color: 'var(--on-dark)',
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 400,
            color: 'var(--on-dark)',
            marginBottom: '16px',
          }}>
            Command Dashboard
          </h2>
          <p style={{
            fontSize: '0.875rem',
            lineHeight: 1.5,
            color: 'rgba(255,255,255,0.7)',
            maxWidth: '600px',
            marginBottom: '24px',
          }}>
            Monitor spatial heatmaps, review live grievance feeds, and optimize
            constituency developmental budgets from a single command center.
          </p>
          <button
            onClick={() => setActiveTab('mp')}
            className="btn"
            style={{
              background: 'var(--canvas)',
              color: 'var(--ink)',
              border: 'none',
            }}
          >
            Access Command Center <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* CTA BAND — Light gray banner before footer */}
      <section style={{
        paddingBottom: '96px',
      }}>
        <div style={{
          background: 'var(--surface-strong)',
          borderRadius: 'var(--rounded-lg)',
          padding: '48px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
        }}>
          <div style={{ flexGrow: 1, minWidth: '250px' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 400,
              color: 'var(--ink)',
              marginBottom: '4px',
            }}>
              Ready to explore the dashboard?
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--body)', margin: 0 }}>
              Read the project details or jump directly into Command Mode.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('about')}
              className="btn btn-secondary"
            >
              About the Project
            </button>
            <button
              onClick={() => setActiveTab('mp')}
              className="btn btn-primary"
            >
              Access MP Command Dashboard <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
