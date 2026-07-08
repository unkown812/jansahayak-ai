import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Users, Flame } from 'lucide-react';

export default function TrendingIssues({ onSelectGrievance }) {
  const { grievances } = useApp();

  const trending = useMemo(() => {
    return grievances
      .filter((g) => g.status !== 'Resolved')
      .sort((a, b) => (b.supportCount || 0) - (a.supportCount || 0))
      .slice(0, 5);
  }, [grievances]);

  if (trending.length === 0) {
    return (
      <div
        className="glass-panel"
        style={{
          padding: '20px',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          textAlign: 'center',
          color: 'var(--text-tertiary)',
          fontSize: '0.85rem',
        }}
      >
        <Users size={24} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
        No trending issues yet. Support some grievances to see them here.
      </div>
    );
  }

  return (
    <div
      className="glass-panel"
      style={{
        padding: '20px',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '10px',
        }}
      >
        <Flame size={18} style={{ color: 'var(--warning)' }} />
        <h3 style={{ fontSize: '1rem', margin: 0 }}>
          Trending Issues
        </h3>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
          Most community-supported active issues
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {trending.map((g, idx) => (
          <div
            key={g.id}
            className="glass-panel"
            style={{
              padding: '12px 14px',
              backgroundColor: 'var(--bg-tertiary)',
              border: `1px solid ${idx === 0 ? 'var(--warning-border)' : 'var(--border-color)'}`,
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: onSelectGrievance ? 'pointer' : 'default',
            }}
            onClick={() => onSelectGrievance && onSelectGrievance(g)}
          >
            {/* Rank */}
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor:
                  idx === 0
                    ? 'var(--warning)'
                    : idx === 1
                    ? 'var(--text-tertiary)'
                    : idx === 2
                    ? 'var(--danger-bg)'
                    : 'var(--bg-secondary)',
                color:
                  idx === 0
                    ? '#000'
                    : idx === 1
                    ? '#fff'
                    : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '0.75rem',
                flexShrink: 0,
              }}
            >
              {idx + 1}
            </div>

            {/* Details */}
            <div style={{ flexGrow: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
              >
                {g.title}
              </div>
              <div
                style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-tertiary)',
                  display: 'flex',
                  gap: '8px',
                  marginTop: '2px',
                }}
              >
                <span>{g.sector}</span>
                <span>•</span>
                <span>{g.id}</span>
                <span>•</span>
                <span className="badge badge-warning" style={{ fontSize: '0.6rem', padding: '1px 6px' }}>
                  {g.urgency}
                </span>
              </div>
            </div>

            {/* Support count */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                flexShrink: 0,
                color: 'var(--warning)',
                fontWeight: 'bold',
                fontSize: '0.9rem',
              }}
            >
              <Users size={14} />
              {g.supportCount || 0}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
