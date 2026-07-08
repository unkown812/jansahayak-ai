import React from 'react';
import { Shield, BookOpen, Terminal, Check, Award, AlertTriangle, Target, HelpCircle, MapPin, Brain, Sliders, Users } from 'lucide-react';

export default function AboutPage() {
  const stack = [
    {
      name: 'React 19 & Vite',
      desc: 'Modern reactive virtual DOM scaffolded for fast page loads and HMR updates.'
    },
    {
      name: 'Google Gemini 1.5 Flash API',
      desc: 'Drives our translation, letter writers, and strategic roadmaps. Integrates context demographics to evaluate prioritization trade-offs.'
    },
    {
      name: 'Supabase PostgreSQL Database',
      desc: 'Hosted cloud database syncing grievances, work projects queue, and timelines in real-time.'
    },
    {
      name: 'Supabase Auth & Google OAuth',
      desc: 'Premium SSO authentication guarding administrative access with OAuth redirection.'
    },
    {
      name: 'Google Maps JavaScript API',
      desc: 'Interactive geolocated map of Bhubaneswar, Odisha with spatial pin plots.'
    },
    {
      name: 'Apache ECharts',
      desc: 'Theme-aware horizontal bars, sparklines, and donuts visualizing grievance sectors and budget limits.'
    },
    {
      name: 'HTML5 Web Speech API',
      desc: 'Client-side speech-to-text supporting Hindi and English voices.'
    },
    {
      name: 'dnd-kit Drag-and-Drop',
      desc: 'Pointer and keyboard sensors enabling drag-and-drop priority ordering of constituency projects.'
    }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px', display: 'flex', flexDirection: 'column', gap: '48px' }}>

      {/* Header */}
      <section style={{ borderBottom: '1px solid var(--hairline)', paddingBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 400, color: 'var(--ink)', marginBottom: '8px' }}>
          About JanSahayak AI
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--body)', margin: 0 }}>
          Code for Communities Hackathon — People's Priorities
        </p>
      </section>

      {/* Credentials */}
      <section style={{
        padding: '32px',
        borderRadius: 'var(--rounded-md)',
        border: '1px solid var(--hairline)',
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start',
      }}>
        <Award size={24} style={{ color: 'var(--ink)', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '8px' }}>
            People's Priorities — AI for Constituency Development Planning
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--body)', lineHeight: 1.5, margin: 0 }}>
            JanSahayak AI is a custom-built solution for the <strong>Build with AI: Code for Communities</strong> Hackathon.
            Our platform directly aligns with the People's Priorities track, providing a bridge between the voice of the electorate and local governance.
          </p>
        </div>
      </section>

      {/* Problem Statement */}
      <section style={{
        padding: '32px',
        borderRadius: 'var(--rounded-md)',
        border: '1px solid var(--hairline)',
        background: 'var(--surface-soft)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}>
        <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ink)', margin: 0, fontWeight: 500 }}>
          <AlertTriangle size={18} />
          The Problem
        </h3>
        <blockquote style={{
          fontSize: '0.875rem',
          color: 'var(--body)',
          lineHeight: 1.6,
          borderLeft: '3px solid var(--ink)',
          paddingLeft: '16px',
          margin: 0,
        }}>
          "MPs receive development requests through public meetings, letters, social media, grievance portals, and direct representations.
          There's no objective way to consolidate citizen feedback, spot recurring needs, and weigh competing proposals against real demand."
        </blockquote>
      </section>

      {/* Challenge */}
      <section style={{
        padding: '32px',
        borderRadius: 'var(--rounded-md)',
        border: '1px solid var(--hairline)',
        background: 'var(--surface-soft)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}>
        <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ink)', margin: 0, fontWeight: 500 }}>
          <HelpCircle size={18} />
          The Challenge
        </h3>
        <blockquote style={{
          fontSize: '0.875rem',
          color: 'var(--body)',
          lineHeight: 1.6,
          borderLeft: '3px solid var(--ink)',
          paddingLeft: '16px',
          margin: 0,
        }}>
          "Build a multilingual AI platform where citizens can submit development suggestions via voice, text, or messaging apps.
          The system should analyze submissions to surface recurring themes, map demand hotspots, and recommend high-priority development works."
        </blockquote>
      </section>

      {/* Solution */}
      <section style={{
        padding: '32px',
        borderRadius: 'var(--rounded-md)',
        border: '1px solid var(--hairline)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}>
        <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
          <Target size={18} />
          How JanSahayak AI Solves the Challenge
        </h3>

        <p style={{ fontSize: '0.875rem', color: 'var(--body)', lineHeight: 1.5, margin: 0 }}>
          JanSahayak AI resolves the track bottlenecks through a unified, data-driven architecture:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
          {[
            { icon: Users, color: 'var(--ink)', title: '1. Multilingual Citizen Intake with Geocoded Pinning',
              desc: 'Citizens submit issues via text or voice. Integrated HTML5 Speech APIs translate local dialects into English summaries. Citizens select the location by searching local landmarks or using GPS, dropping a pin on Google Maps.' },
            { icon: Brain, color: 'var(--ink)', title: '2. AI Strategic Advisor & Demographic Analytics',
              desc: 'Our AI Strategic Advisor consolidates active grievances and pending projects, correlating them with whole-constituency demographics. Google Gemini performs objective trade-off analyses.' },
            { icon: MapPin, color: 'var(--ink)', title: '3. Live MP Command Center & GIS Diagnostic Map',
              desc: 'Visualizes hotspots and department backlogs on an interactive Google Map centered on Bhubaneswar, Odisha. MPs can review details, filter by sector/severity, and generate AI-powered directive letters.' },
            { icon: Sliders, color: 'var(--ink)', title: '4. MPLAD Fund Resource Optimizer & Gantt Planner',
              desc: 'Enforces strict budget constraints against the ₹1.0Cr fund cap. Administrators can drag-and-drop sort proposed work orders, with the system calculating start/end timelines on a Gantt chart.' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} style={{ display: 'flex', gap: '16px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: '1px solid var(--hairline)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={18} style={{ color: 'var(--ink)' }} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 500, fontSize: '0.95rem', marginBottom: '4px', color: 'var(--ink)' }}>{item.title}</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--body)', lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tech Stack */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
          <Terminal size={18} />
          Technology Stack
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
        }}>
          {stack.map((item, idx) => (
            <div key={idx} style={{
              padding: '20px',
              borderRadius: 'var(--rounded-md)',
              border: '1px solid var(--hairline)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}>
              <span style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--ink)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <Check size={14} style={{ color: 'var(--muted)' }} />
                {item.name}
              </span>
              <p style={{ fontSize: '0.75rem', color: 'var(--body)', lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
