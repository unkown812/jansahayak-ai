import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import ReactECharts from 'echarts-for-react';
import { AlertTriangle, CheckCircle2, Clock, ChevronDown, ChevronRight, Hammer, ShieldAlert } from 'lucide-react';

export default function QualityDashboard({ onSelectGrievance }) {
  const { grievances, resolveQualityReport, addProject, theme } = useApp();
  const [expandedRows, setExpandedRows] = useState({});

  const isDark = theme === 'dark';
  const gridColor = isDark ? '#27272a' : '#e2e8f0';

  const qualityStats = useMemo(() => {
    const resolved = grievances.filter((g) => g.status === 'Resolved' && g.resolvedDate);
    const flagged = resolved.filter((g) => (g.qualityReports || []).some((r) => r.status !== 'closed'));
    const allOpenReports = grievances.filter((g) =>
      (g.qualityReports || []).some((r) => r.status !== 'closed')
    );

    const avgResolutionTime =
      resolved.length > 0
        ? resolved.reduce((sum, g) => {
            const filed = new Date(g.timestamp);
            const resolvedD = new Date(g.resolvedDate);
            const days = Math.max(0, (resolvedD - filed) / (1000 * 60 * 60 * 24));
            return sum + days;
          }, 0) / resolved.length
        : 0;

    return {
      totalResolved: resolved.length,
      flaggedCount: flagged.length,
      reOpenRate: resolved.length ? ((flagged.length / resolved.length) * 100).toFixed(1) : 0,
      avgResolutionDays: avgResolutionTime.toFixed(1),
      maintenancePending: allOpenReports.length,
      openReportsCount: allOpenReports.reduce(
        (sum, g) => sum + (g.qualityReports || []).filter((r) => r.status !== 'closed').length,
        0
      ),
    };
  }, [grievances]);

  const flaggedGrievances = useMemo(() => {
    return grievances
      .filter((g) => (g.qualityReports || []).length > 0)
      .sort((a, b) => {
        const openA = (a.qualityReports || []).filter((r) => r.status !== 'closed').length;
        const openB = (b.qualityReports || []).filter((r) => r.status !== 'closed').length;
        return openB - openA;
      });
  }, [grievances]);

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateWorkOrder = (g) => {
    const projId = `PROJ-MAINT-${g.id.split('-')[1]}`;
    if (projects.some((p) => p.id === projId)) {
      alert('A maintenance work order for this grievance already exists!');
      return;
    }
    let estimatedCost = 8;
    if (g.urgency === 'Critical') estimatedCost = 20;
    else if (g.urgency === 'Medium') estimatedCost = 12;

    const newProject = {
      id: projId,
      name: `Maintenance: ${g.title}`,
      sector: g.sector,
      cost: estimatedCost,
      duration: g.urgency === 'Critical' ? 7 : 14,
      materials: 'Inspection & repair materials',
      status: 'queued',
      category: 'Maintenance',
    };
    addProject(newProject);
    alert(`Maintenance work order ${projId} created and sent to Optimizer!`);
  };

  // Chart 1: Reopen rate sparkline (mini donut)
  const reopenDonutOption = {
    series: [
      {
        type: 'pie',
        radius: ['60%', '85%'],
        avoidLabelOverlap: false,
        label: { show: false },
        data: [
          {
            value: qualityStats.flaggedCount,
            name: 'Flagged',
            itemStyle: { color: 'var(--warning)' },
          },
          {
            value: Math.max(0, qualityStats.totalResolved - qualityStats.flaggedCount),
            name: 'Clean',
            itemStyle: { color: gridColor },
          },
        ],
      },
    ],
    tooltip: {
      formatter: '{b}: {c}',
      backgroundColor: isDark ? '#18181b' : '#ffffff',
      borderColor: gridColor,
      textStyle: { color: isDark ? '#f4f4f5' : '#0f172a', fontSize: 10 },
    },
  };

  // Chart 2: Resolution time trend (mock sparkline)
  const resTimeSparklineOption = {
    grid: { left: 5, right: 5, top: 5, bottom: 5 },
    xAxis: { type: 'category', show: false },
    yAxis: { type: 'value', show: false },
    series: [
      {
        data: [5.2, 4.8, 5.5, 4.3, 4.0, 3.8, Number(qualityStats.avgResolutionDays)],
        type: 'line',
        smooth: true,
        showSymbol: false,
        lineStyle: { color: 'var(--info)', width: 2 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(6, 182, 212, 0.25)' },
              { offset: 1, color: 'rgba(6, 182, 212, 0)' },
            ],
          },
        },
      },
    ],
    tooltip: { show: false },
  };

  // Chart 3: Maintenance pending breakdown
  const pendingBarOption = {
    grid: { left: 5, right: 5, top: 5, bottom: 5 },
    xAxis: { type: 'category', show: false },
    yAxis: { type: 'value', show: false },
    series: [
      {
        data: [qualityStats.maintenancePending],
        type: 'bar',
        itemStyle: {
          color: 'var(--warning)',
          borderRadius: 4,
        },
        barWidth: '60%',
      },
    ],
    tooltip: { show: false },
  };

  return (
    <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* KPI Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Card 1: Re-open Rate */}
        <div
          className="glass-panel"
          style={{
            padding: '16px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            minHeight: '120px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-tertiary)',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  letterSpacing: '0.05em',
                }}
              >
                Re-open Rate
              </span>
              <div style={{ fontSize: '1.6rem', fontWeight: 'bold', marginTop: '2px' }}>
                {qualityStats.reOpenRate}%
                <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginLeft: '6px', fontWeight: 'normal' }}>
                  ({qualityStats.flaggedCount}/{qualityStats.totalResolved})
                </span>
              </div>
            </div>
            <div
              style={{
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--warning-bg)',
                color: 'var(--warning)',
              }}
            >
              <ShieldAlert size={20} />
            </div>
          </div>
          <div style={{ height: '40px', marginTop: 'auto' }}>
            <ReactECharts option={reopenDonutOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* Card 2: Avg Resolution Time */}
        <div
          className="glass-panel"
          style={{
            padding: '16px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            minHeight: '120px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-tertiary)',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  letterSpacing: '0.05em',
                }}
              >
                Avg Resolution Time
              </span>
              <div style={{ fontSize: '1.6rem', fontWeight: 'bold', marginTop: '2px' }}>
                {qualityStats.avgResolutionDays}
                <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginLeft: '6px', fontWeight: 'normal' }}>
                  days
                </span>
              </div>
            </div>
            <div
              style={{
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--info-bg)',
                color: 'var(--info)',
              }}
            >
              <Clock size={20} />
            </div>
          </div>
          <div style={{ height: '40px', marginTop: 'auto' }}>
            <ReactECharts option={resTimeSparklineOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* Card 3: Maintenance Pending */}
        <div
          className="glass-panel"
          style={{
            padding: '16px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            minHeight: '120px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-tertiary)',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  letterSpacing: '0.05em',
                }}
              >
                Maintenance Pending
              </span>
              <div style={{ fontSize: '1.6rem', fontWeight: 'bold', marginTop: '2px' }}>
                {qualityStats.openReportsCount}
                <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginLeft: '6px', fontWeight: 'normal' }}>
                  open reports
                </span>
              </div>
            </div>
            <div
              style={{
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--danger-bg)',
                color: 'var(--danger)',
              }}
            >
              <Hammer size={20} />
            </div>
          </div>
          <div style={{ height: '40px', marginTop: 'auto' }}>
            <ReactECharts option={pendingBarOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>
      </div>

      {/* Flagged Issues Table */}
      <div
        className="glass-panel"
        style={{
          padding: '20px',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '12px',
          }}
        >
          <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} style={{ color: 'var(--warning)' }} />
            Flagged Maintenance Issues
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
            {flaggedGrievances.length} grievance(s) with reports
          </span>
        </div>

        {flaggedGrievances.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '40px',
              color: 'var(--text-tertiary)',
              fontSize: '0.9rem',
            }}
          >
            <CheckCircle2 size={40} style={{ margin: '0 auto 12px', color: 'var(--success)' }} />
            No quality issues reported. All resolved work is holding up well.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.85rem',
              }}
            >
              <thead>
                <tr
                  style={{
                    background: 'var(--bg-tertiary)',
                    borderBottom: '1px solid var(--border-color)',
                  }}
                >
                  <th style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: '600', width: '30px' }}></th>
                  <th style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: '600', textAlign: 'left' }}>ID</th>
                  <th style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: '600', textAlign: 'left' }}>Title</th>
                  <th className="hide-mobile" style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: '600', textAlign: 'left' }}>Ward/Sector</th>
                  <th className="hide-mobile" style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: '600', textAlign: 'left' }}>Resolved On</th>
                  <th style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: '600', textAlign: 'center' }}>Reports</th>
                  <th style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: '600', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {flaggedGrievances.map((g) => {
                  const openReports = (g.qualityReports || []).filter((r) => r.status !== 'closed');
                  const isExpanded = expandedRows[g.id];
                  return (
                    <React.Fragment key={g.id}>
                      <tr
                        style={{
                          borderBottom: '1px solid var(--border-color)',
                          cursor: 'pointer',
                          background: openReports.length > 0 ? 'var(--warning-bg)' : 'transparent',
                        }}
                        className="table-row-hover"
                      >
                        <td
                          style={{ padding: '12px 8px', textAlign: 'center' }}
                          onClick={() => toggleRow(g.id)}
                        >
                          {isExpanded ? (
                            <ChevronDown size={14} style={{ color: 'var(--text-tertiary)' }} />
                          ) : (
                            <ChevronRight size={14} style={{ color: 'var(--text-tertiary)' }} />
                          )}
                        </td>
                        <td
                          style={{ padding: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                          onClick={() => onSelectGrievance && onSelectGrievance(g)}
                        >
                          {g.id}
                        </td>
                        <td
                          style={{ padding: '12px', fontWeight: '500', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        >
                          {g.title}
                        </td>
                        <td className="hide-mobile" style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                          {g.sector}
                        </td>
                        <td className="hide-mobile" style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                          {g.resolvedDate
                            ? new Date(g.resolvedDate).toLocaleDateString()
                            : '—'}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <span
                            className={`badge ${openReports.length > 0 ? 'badge-danger' : 'badge-success'}`}
                            style={{ fontSize: '0.7rem' }}
                          >
                            {openReports.length} open
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <button
                            onClick={() => handleCreateWorkOrder(g)}
                            className="btn"
                            style={{
                              padding: '4px 8px',
                              fontSize: '0.7rem',
                              border: '1px solid var(--accent)',
                              color: 'var(--accent)',
                              background: 'transparent',
                            }}
                          >
                            <Hammer size={10} /> Create WO
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan="7" style={{ padding: '0 12px 12px 40px', background: 'var(--bg-tertiary)' }}>
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                                padding: '12px',
                              }}
                            >
                              {(g.qualityReports || []).map((r) => (
                                <div
                                  key={r.id}
                                  className="glass-panel"
                                  style={{
                                    padding: '10px 14px',
                                    backgroundColor: 'var(--bg-secondary)',
                                    border: `1px solid ${r.status === 'open' ? 'var(--danger-border)' : 'var(--success-border)'}`,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                  }}
                                >
                                  <div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: '500', marginBottom: '2px' }}>
                                      {r.description}
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                                      Reported: {new Date(r.date).toLocaleDateString()} by {r.reportedBy}
                                    </div>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                                    <span
                                      className={`badge ${r.status === 'open' ? 'badge-danger' : 'badge-success'}`}
                                      style={{ fontSize: '0.65rem' }}
                                    >
                                      {r.status}
                                    </span>
                                    {r.status !== 'closed' && (
                                      <button
                                        onClick={() => resolveQualityReport(g.id, r.id)}
                                        className="btn"
                                        style={{
                                          padding: '3px 8px',
                                          fontSize: '0.65rem',
                                          border: '1px solid var(--success)',
                                          color: 'var(--success)',
                                          background: 'transparent',
                                        }}
                                      >
                                        <CheckCircle2 size={10} /> Mark Addressed
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
