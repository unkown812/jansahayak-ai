import React from 'react';
import { useApp } from '../context/AppContext';
import ReactECharts from 'echarts-for-react';
import { Heart, AlertCircle, IndianRupee, Briefcase, TrendingUp, HelpCircle } from 'lucide-react';

export default function KpiGrid() {
  const { grievances, projects, budgetCap, currentBudgetUsed, theme } = useApp();

  const isDark = theme === 'dark';
  const textColor = isDark ? '#a1a1aa' : '#475569';
  const gridColor = isDark ? '#27272a' : '#e2e8f0';

  // Calculations
  const pendingCount = grievances.filter((g) => g.status !== 'Resolved').length;
  const resolvedCount = grievances.filter((g) => g.status === 'Resolved').length;
  const totalGrievances = grievances.length;
  
  // Calculate average satisfaction rate
  // Base is 74%, resolves add to it, pending criticals subtract
  const baseSat = 74;
  const criticalPending = grievances.filter((g) => g.urgency === 'Critical' && g.status !== 'Resolved').length;
  const satValue = Math.min(100, Math.max(30, baseSat + (resolvedCount * 0.5) - (criticalPending * 1.5)));

  // Sector breakdown count for charts
  const sectors = ['Infrastructure', 'Water Supply', 'Sanitation', 'Public Health', 'Heritage & Tourism', 'Transport'];
  const sectorCounts = sectors.map(sec => ({
    name: sec,
    value: grievances.filter(g => g.sector === sec && g.status !== 'Resolved').length
  }));

  // Project statistics
  const activeProjs = projects.filter(p => p.status === 'active').length;
  const queuedProjs = projects.filter(p => p.status === 'queued').length;
  const completedProjs = projects.filter(p => p.status === 'completed').length;

  // Chart 1: Satisfaction Sparkline Options
  const satisfactionSparklineOption = {
    grid: { left: 5, right: 5, top: 5, bottom: 5 },
    xAxis: { type: 'category', show: false },
    yAxis: { type: 'value', min: 50, max: 100, show: false },
    series: [
      {
        data: [71, 72, 70, 73, 74, 75, satValue],
        type: 'line',
        smooth: true,
        showSymbol: false,
        lineStyle: { color: 'var(--success)', width: 2 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(16, 185, 129, 0.25)' },
              { offset: 1, color: 'rgba(16, 185, 129, 0)' }
            ]
          }
        }
      }
    ],
    tooltip: { show: false }
  };

  // Chart 2: Grievances by Department Horizontal Bar
  const sectorBarOption = {
    grid: { left: 75, right: 15, top: 5, bottom: 5 },
    xAxis: { type: 'value', show: false },
    yAxis: {
      type: 'category',
      data: sectorCounts.map(s => s.name.split(' & ')[0].split(' ')[0]), // Shorten names
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: textColor, fontSize: 10 }
    },
    series: [
      {
        data: sectorCounts.map(s => s.value),
        type: 'bar',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: 'var(--accent)' },
              { offset: 1, color: 'rgba(99, 102, 241, 0.4)' }
            ]
          },
          borderRadius: 4
        },
        barWidth: '60%'
      }
    ],
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} tickets',
      backgroundColor: isDark ? '#18181b' : '#ffffff',
      borderColor: gridColor,
      textStyle: { color: isDark ? '#f4f4f5' : '#0f172a', fontSize: 10 }
    }
  };

  // Chart 3: Budget Utilization Donut Options
  const budgetDonutOption = {
    series: [
      {
        type: 'pie',
        radius: ['55%', '85%'],
        avoidLabelOverlap: false,
        label: { show: false },
        emphasis: { label: { show: false } },
        labelLine: { show: false },
        data: [
          { value: currentBudgetUsed, name: 'Used', itemStyle: { color: 'var(--accent)' } },
          { value: Math.max(0, budgetCap - currentBudgetUsed), name: 'Remaining', itemStyle: { color: gridColor } }
        ]
      }
    ],
    tooltip: {
      formatter: '{b}: ₹{c}L',
      backgroundColor: isDark ? '#18181b' : '#ffffff',
      borderColor: gridColor,
      textStyle: { color: isDark ? '#f4f4f5' : '#0f172a', fontSize: 10 }
    }
  };

  // Chart 4: Project Status breakdown donut/pie
  const projectPieOption = {
    series: [
      {
        type: 'pie',
        radius: '75%',
        center: ['50%', '50%'],
        label: { show: false },
        data: [
          { value: activeProjs, name: 'Active', itemStyle: { color: 'var(--accent)' } },
          { value: queuedProjs, name: 'Queued', itemStyle: { color: 'var(--warning)' } },
          { value: completedProjs, name: 'Done', itemStyle: { color: 'var(--success)' } }
        ]
      }
    ],
    tooltip: {
      formatter: '{b}: {c} projects',
      backgroundColor: isDark ? '#18181b' : '#ffffff',
      borderColor: gridColor,
      textStyle: { color: isDark ? '#f4f4f5' : '#0f172a', fontSize: 10 }
    }
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '16px',
      marginBottom: '16px'
    }}>
      {/* CARD 1: Satisfaction */}
      <div className="glass-panel" style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '140px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.05em' }}>Satisfaction Rate</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '2px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              {Math.round(satValue)}%
              <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '2px' }}>
                <TrendingUp size={12} />
                +2.4%
              </span>
            </div>
          </div>
          <div style={{ padding: '8px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
            <Heart size={20} fill="var(--success)" style={{ opacity: 0.8 }} />
          </div>
        </div>
        <div style={{ height: '40px', marginTop: 'auto' }}>
          <ReactECharts option={satisfactionSparklineOption} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>

      {/* CARD 2: Active Grievances */}
      <div className="glass-panel" style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '140px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.05em' }}>Active Grievances</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '2px' }}>
              {pendingCount}
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginLeft: '6px', fontWeight: 'normal' }}>
                / {totalGrievances} total
              </span>
            </div>
          </div>
          <div style={{ padding: '8px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--danger-bg)', color: 'var(--danger)' }}>
            <AlertCircle size={20} />
          </div>
        </div>
        <div style={{ height: '40px', marginTop: 'auto' }}>
          <ReactECharts option={sectorBarOption} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>

      {/* CARD 3: Budget Utilization */}
      <div className="glass-panel" style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '140px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flexGrow: 1 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.05em' }}>Budget Utilization</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '2px' }}>
              ₹{currentBudgetUsed}L
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginLeft: '6px', fontWeight: 'normal' }}>
                / ₹{budgetCap}L cap
              </span>
            </div>
          </div>
          <div style={{ padding: '8px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--accent-glow)', color: 'var(--accent)' }}>
            <IndianRupee size={20} />
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', height: '40px', marginTop: 'auto' }}>
          <div style={{ flexGrow: 1 }}>
            <div style={{ width: '100%', height: '6px', background: gridColor, borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(100, (currentBudgetUsed / budgetCap) * 100)}%`, height: '100%', background: 'var(--accent)', borderRadius: 'var(--radius-full)' }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
              <span>{Math.round((currentBudgetUsed / budgetCap) * 100)}% Used</span>
              <span>₹{budgetCap - currentBudgetUsed}L Left</span>
            </div>
          </div>
          <div style={{ width: '40px', height: '40px', flexShrink: 0 }}>
            <ReactECharts option={budgetDonutOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>
      </div>

      {/* CARD 4: Active Projects */}
      <div className="glass-panel" style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '140px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.05em' }}>Work Projects</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '2px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              {activeProjs} Active
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 'normal' }}>
                ({queuedProjs} queued)
              </span>
            </div>
          </div>
          <div style={{ padding: '8px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--warning-bg)', color: 'var(--warning)' }}>
            <Briefcase size={20} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '40px', marginTop: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
            <span>Completed: <strong style={{ color: 'var(--success)' }}>{completedProjs}</strong></span>
            <span>Total Logged: <strong>{projects.length}</strong></span>
          </div>
          <div style={{ width: '40px', height: '40px', flexShrink: 0 }}>
            <ReactECharts option={projectPieOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
