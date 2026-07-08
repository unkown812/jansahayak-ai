import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, AlertTriangle, Hammer, Calendar, IndianRupee, Sparkles, Plus, Trash2, TrendingUp } from 'lucide-react';

// Score a project by combined urgency + community support
const getCombinedPriority = (project, grievances) => {
  const urgencyWeight = { Critical: 3, High: 2, Medium: 1, Low: 0.5 };
  const urgency = urgencyWeight[project.urgency] || 1;
  // Find matching grievance support count
  const matchId = project.id?.replace('PROJ-WO-', '').replace('PROJ-MAINT-', '');
  const matchingGrievance = grievances.find(
    (g) => g.id.includes(matchId) || matchId?.includes(g.id.split('-')[1])
  );
  const supportCount = matchingGrievance?.supportCount || 0;
  const supportScore = Math.min(3, supportCount / 5);
  return urgency * 0.6 + supportScore * 0.4;
};

// Sortable Card Item Subcomponent
function SortableProjectCard({ project, index, fitsInBudget, cumulativeCost, onDelete, communityScore }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 1
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return 'badge-info';
      case 'queued': return 'badge-warning';
      case 'completed': return 'badge-success';
      default: return 'badge-info';
    }
  };

  return (
    <div
      ref={setNodeRef}
      className="glass-panel"
      style={{
        ...style,
        padding: '14px',
        backgroundColor: fitsInBudget ? 'var(--bg-secondary)' : 'var(--bg-tertiary)',
        border: fitsInBudget 
          ? (project.status === 'active' ? '1px solid var(--accent)' : '1px solid var(--border-color)')
          : '1px dashed var(--danger-border)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '10px',
        boxShadow: fitsInBudget ? 'var(--shadow-sm)' : 'none',
        position: 'relative'
      }}
    >
      {/* Drag Handle */}
      <div 
        {...attributes} 
        {...listeners} 
        style={{ cursor: 'grab', padding: '6px', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center' }}
      >
        <GripVertical size={18} />
      </div>

      {/* Project Details */}
      <div style={{ flexGrow: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-tertiary)' }}>#{index + 1}</span>
          <span className={`badge ${getStatusBadge(project.status)}`} style={{ fontSize: '0.65rem' }}>
            {project.status}
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{project.sector}</span>
          
          {!fitsInBudget && (
            <span className="badge badge-danger" style={{ fontSize: '0.65rem', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
              <AlertTriangle size={10} /> Exceeds Cap
            </span>
          )}
        </div>

        <h4 style={{ fontSize: '0.9rem', fontWeight: '600', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          {project.name}
        </h4>

        {/* Materials breakdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <Hammer size={12} />
          <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {project.materials}
          </span>
        </div>
      </div>

      {/* Project metadata */}
      <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
        <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: fitsInBudget ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
          ₹{project.cost} Lakhs
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
          <Calendar size={12} />
          {project.duration} Days
        </div>
        {communityScore !== undefined && (
          <div style={{
            fontSize: '0.65rem',
            padding: '2px 6px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: communityScore > 2 ? 'var(--warning-bg)' : 'var(--info-bg)',
            color: communityScore > 2 ? 'var(--warning)' : 'var(--info)',
            fontWeight: '600',
            marginTop: '2px',
          }}>
            Priority: {communityScore.toFixed(1)}
          </div>
        )}
      </div>

      {/* Delete button (if manually added / queued) */}
      <button
        onClick={() => onDelete(project.id)}
        className="btn btn-icon"
        style={{ border: 'none', background: 'transparent', padding: '4px', marginLeft: '6px', color: 'var(--text-tertiary)' }}
        title="Delete Proposal"
      >
        <Trash2 size={14} className="hover-red" />
      </button>
    </div>
  );
}

// Main Optimizer component
export default function Optimizer() {
  const {
    projects,
    setProjects,
    budgetCap,
    currentBudgetUsed,
    addProject,
    deleteProject,
    reorderProjects,
    grievances,
  } = useApp();

  const [optimizerLogs, setOptimizerLogs] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Setup pointers sensor for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = projects.findIndex((i) => i.id === active.id);
      const newIndex = projects.findIndex((i) => i.id === over.id);
      const newProjects = arrayMove(projects, oldIndex, newIndex);
      reorderProjects(newProjects);
    }
  };

  // Run AI Planning tool to auto-generate a custom project
  const handleAutoPlanProject = async () => {
    setIsGenerating(true);
    setOptimizerLogs([]);

    const steps = [
      'Querying active constituency grievance database...',
      'Identifying high-frequency sectors (Water, Sanitation)...',
      'Correlating reports for Ward C: Rural Green...',
      'Calculating materials (Bricks, filtration units, cement)...',
      'Estimating timeline scheduling constraints...',
      'Finalizing budget proposal...'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((r) => setTimeout(r, 600));
      setOptimizerLogs((prev) => [...prev, `[ai-planner] ${steps[i]}`]);
    }

    // Add generated project
    const newProjId = `PROJ-GEN-${Date.now().toString().slice(-4)}`;
    const newProj = {
      id: newProjId,
      name: 'AI Proposal: Ward C Water Security Upgrades',
      sector: 'Water Supply',
      ward: 'Ward C: Rural Green',
      cost: 16,
      duration: 18,
      materials: 'Water Purification units: 3, Concrete Pipe: 100m, Labor: 140 Man-days',
      status: 'queued'
    };

    addProject(newProj);
    setIsGenerating(false);
  };

  // Cumulative budget checks to tag card fit
  let runningBudget = 0;
  const projectFits = projects.map((proj) => {
    runningBudget += proj.cost;
    return runningBudget <= budgetCap;
  });

  // Gantt Chart Calculations
  // Recalculates sequential timelines based on list ordering
  let currentOffsetDays = 0;
  const ganttItems = projects.map((proj, idx) => {
    const fits = projectFits[idx];
    const startDay = currentOffsetDays;
    const endDay = startDay + proj.duration;
    
    // Only accumulate days if the project fits in the budget and is active/queued
    if (fits && proj.status !== 'completed') {
      currentOffsetDays += proj.duration;
    }

    return {
      id: proj.id,
      name: proj.name,
      startDay,
      duration: proj.duration,
      endDay,
      status: proj.status,
      fits
    };
  });

  const totalGanttTimelineDays = Math.max(100, currentOffsetDays + 30);

  return (
    <div className="optimizer-grid">
      
      {/* LEFT PANE: Priority List & Budget Progress */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Budget overview panel */}
        <div className="glass-panel" style={{ padding: '20px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IndianRupee size={18} style={{ color: 'var(--accent)' }} />
            Priority Planning & Budget allocation
          </h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              ₹{currentBudgetUsed}L <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 'normal' }}>allocated</span>
            </span>
            <span style={{ fontSize: '0.9rem', color: currentBudgetUsed > budgetCap ? 'var(--danger)' : 'var(--text-secondary)', fontWeight: '600' }}>
              Cap: ₹{budgetCap}L
            </span>
          </div>

          {/* Budget progress bar */}
          <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: '12px' }}>
            <div style={{
              width: `${Math.min(100, (currentBudgetUsed / budgetCap) * 100)}%`,
              height: '100%',
              backgroundColor: currentBudgetUsed > budgetCap ? 'var(--danger)' : 'var(--accent)',
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.4s ease, background-color 0.3s ease'
            }}></div>
          </div>

          {currentBudgetUsed > budgetCap && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--danger)', backgroundColor: 'var(--danger-bg)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--danger-border)' }}>
              <AlertTriangle size={16} />
              <span>Budget exceeded! Drag low priority projects to the bottom to exclude them.</span>
            </div>
          )}
        </div>

          {/* Community Priority Sorting */}
          <button
            onClick={() => {
              const sorted = [...projects].sort((a, b) => {
                const scoreA = getCombinedPriority(a, grievances);
                const scoreB = getCombinedPriority(b, grievances);
                return scoreB - scoreA;
              });
              reorderProjects(sorted);
            }}
            className="btn"
            style={{ fontSize: '0.8rem', padding: '8px', borderColor: 'var(--info)', color: 'var(--info)', background: 'var(--info-bg)' }}
          >
            <TrendingUp size={14} /> Auto-Sort by Community Priority
          </button>

          {/* Plan generator button & console */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={handleAutoPlanProject}
            disabled={isGenerating}
            className="btn btn-primary"
            style={{
              padding: '12px'
            }}
          >
            <Sparkles size={16} /> {isGenerating ? 'AI Architecting...' : 'Run AI Project Planner'}
          </button>

          {/* Planner terminal logs */}
          {(isGenerating || optimizerLogs.length > 0) && (
            <div className="glass-panel" style={{
              padding: '12px',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              fontFamily: 'Consolas, monospace',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              maxHeight: '120px',
              overflowY: 'auto'
            }}>
              {optimizerLogs.map((log, idx) => (
                <div key={idx} style={{ borderLeft: '2px solid var(--accent)', paddingLeft: '8px', marginBottom: '2px' }}>{log}</div>
              ))}
              {isGenerating && <div className="pulse-glow" style={{ color: 'var(--accent)', fontWeight: 'bold' }}>&gt; Analyzing regional maps...</div>}
            </div>
          )}
        </div>

        {/* Sortable drag/drop list */}
        <div style={{ flexGrow: 1 }}>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
            Drag handles to prioritize (Top is highest priority)
          </h3>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={projects} strategy={verticalListSortingStrategy}>
              <div style={{ maxHeight: '450px', overflowY: 'auto', paddingRight: '4px' }}>
                {projects.map((proj, idx) => (
                  <SortableProjectCard
                    key={proj.id}
                    project={proj}
                    index={idx}
                    fitsInBudget={projectFits[idx]}
                    onDelete={deleteProject}
                    communityScore={getCombinedPriority(proj, grievances)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>

      {/* RIGHT PANE: Interactive Gantt Chart Timeline */}
      <div className="glass-panel" style={{
        padding: '20px',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        overflow: 'hidden'
      }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} style={{ color: 'var(--accent)' }} />
            Dynamic Sequential Gantt Timeline
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Timeline is automatically simulated and scheduled sequentially based on project priority order. Completed projects are excluded from scheduler delay.
          </p>
        </div>

        {/* Gantt Area */}
        <div style={{
          flexGrow: 1,
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-tertiary)',
          padding: '16px',
          minHeight: '400px',
          overflowX: 'auto',
          width: '100%'
        }}>
          <div style={{ minWidth: '500px', display: 'flex', flexDirection: 'column', gap: '16px', flexGrow: 1 }}>
            {/* Timeline axis labels */}
            <div 
              className="gantt-row"
              style={{
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '8px',
                marginBottom: '16px',
                fontSize: '0.75rem',
                color: 'var(--text-tertiary)',
                fontWeight: '600'
              }}
            >
              <span>Project Name</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', width: '100%' }}>
                <span>Day 0</span>
                <span>Day {Math.round(totalGanttTimelineDays / 3)}</span>
                <span>Day {Math.round(totalGanttTimelineDays * 2 / 3)}</span>
                <span>Day {Math.round(totalGanttTimelineDays)}</span>
              </div>
            </div>

            {/* Gantt Bars List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', flexGrow: 1 }}>
              {ganttItems.map((item, idx) => {
                // Calculate percent positions
                const startPercent = (item.startDay / totalGanttTimelineDays) * 100;
                const widthPercent = (item.duration / totalGanttTimelineDays) * 100;

                return (
                  <div
                    key={item.id}
                    className="gantt-row"
                    style={{
                      fontSize: '0.8rem'
                    }}
                  >
                    {/* Truncated Name */}
                    <span
                      style={{
                        fontWeight: '500',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        paddingRight: '12px',
                        color: item.fits ? 'var(--text-primary)' : 'var(--text-tertiary)'
                      }}
                      title={item.name}
                    >
                      {item.name}
                    </span>

                    {/* Gantt Bar Row */}
                    <div style={{ position: 'relative', width: '100%', height: '24px', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '4px' }}>
                      {/* Render Bar if project fits and is not completed */}
                      {item.fits && item.status !== 'completed' ? (
                        <div
                          style={{
                            position: 'absolute',
                            left: `${startPercent}%`,
                            width: `${widthPercent}%`,
                            height: '100%',
                            backgroundColor: item.status === 'active' ? 'var(--accent)' : 'var(--warning)',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            paddingLeft: '6px',
                            fontSize: '0.65rem',
                            color: '#ffffff',
                            fontWeight: 'bold',
                            boxShadow: 'var(--shadow-sm)',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {item.duration}d
                        </div>
                      ) : item.status === 'completed' ? (
                        <div
                          style={{
                            position: 'absolute',
                            left: '0%',
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'var(--success-bg)',
                            border: '1px solid var(--success-border)',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.7rem',
                            color: 'var(--success)',
                            fontWeight: 'bold'
                          }}
                        >
                          Completed (0d Remaining)
                        </div>
                      ) : (
                        <div
                          style={{
                            position: 'absolute',
                            left: '0%',
                            width: '100%',
                            height: '100%',
                            border: '1px dashed var(--danger-border)',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.7rem',
                            color: 'var(--text-tertiary)',
                            background: 'rgba(239, 68, 68, 0.02)'
                          }}
                        >
                          Suspended (No Budget)
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
