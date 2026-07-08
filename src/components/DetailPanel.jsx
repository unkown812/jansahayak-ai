import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { X, Calendar, User, FileText, Send, CheckCircle2, Copy, Printer, ThumbsUp, ShieldAlert } from 'lucide-react';

export default function DetailPanel({ grievance, onClose }) {
  const { updateGrievanceStatus, addProject, projects, geminiApiKey, supportGrievance } = useApp();

  const userId = useMemo(() => localStorage.getItem('js_user_id') || '', []);
  const alreadySupported = (grievance.supporters || []).includes(userId);
  const openQualityReports = (grievance.qualityReports || []).filter(r => r.status !== 'closed');

  const [status, setStatus] = useState(grievance.status);
  const [streamingText, setStreamingText] = useState('');
  const [streamingType, setStreamingType] = useState(null); // 'notice' or 'response'
  const [isStreaming, setIsStreaming] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync state if grievance changes
  useEffect(() => {
    setStatus(grievance.status);
    setStreamingText('');
    setStreamingType(null);
    setIsStreaming(false);
    setCopied(false);
  }, [grievance]);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    updateGrievanceStatus(grievance.id, newStatus);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(streamingText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const streamContent = async (type) => {
    setStreamingType(type);
    setStreamingText('');
    setIsStreaming(true);

    const nowStr = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    let textToStream = '';
    let keyToUse = geminiApiKey;

    if (keyToUse) {
      setStreamingText('Drafting with Google Gemini 1.5 Flash...');
      try {
        let promptText = '';
        if (type === 'notice') {
          promptText = `Draft an official, highly professional, formal municipal directive letter from the Office of the Member of Parliament (MP) to the Senior Zonal Officer/Ward Commissioner regarding the following citizen complaint:
          
Grievance Details:
- ID: ${grievance.id}
- Category/Sector: ${grievance.sector}
- Urgency: ${grievance.urgency}
- Complaint: "${grievance.description}"
- Reported by: ${grievance.reporter}
- Date: ${nowStr}

Structure it like an official government notice. Include Reference ID: DIR-2026-${grievance.id.split('-')[1]}. Outline 3 specific recommended technical municipal actions based on the sector, and state that a compliance report must be submitted within 72 hours. End with 'By Order of, Office of the Member of Parliament'.`;
        } else {
          promptText = `Draft a formal, reassuring official constituency update letter from the Citizen Redressal Desk of the Member of Parliament Office to the citizen ${grievance.reporter} regarding their filed complaint:
          
Grievance Details:
- ID: ${grievance.id}
- Title: ${grievance.title}
- Sector: ${grievance.sector}
- Updated Status: ${status.toUpperCase()}
- Date: ${nowStr}

Write in a professional, polite, and reassuring tone. Tell them that their ticket status has been updated to "${status.toUpperCase()}" and that an Official Directive (Reference DIR-2026-${grievance.id.split('-')[1]}) has been dispatched to the Ward Commissioner requesting immediate remediation. Give details of how they can track it.`;
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${keyToUse}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: promptText }]
            }]
          })
        });
        const data = await response.json();
        textToStream = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        
        if (!textToStream) {
          throw new Error(data.error?.message || 'Empty response');
        }
        setStreamingText('');

      } catch (err) {
        console.error('Error generating directive with Gemini:', err);
        setStreamingText('API Error. Falling back to template...');
        await new Promise(r => setTimeout(r, 1000));
        keyToUse = ''; // Fallback
      }
    }

    if (!keyToUse) {
      setStreamingText('');
      if (type === 'notice') {
        textToStream = `OFFICIAL MUNICIPAL DIRECTIVE\nJanSahayak CONSTITUENCY COMMAND HEADQUARTERS\nReference ID: DIR-2026-${grievance.id.split('-')[1]}\nDate: ${nowStr}\n\nTO:\nThe Senior Zonal Officer / Municipal Commissioner\nMunicipal Grievance and Works Committee\nBhubaneswar, Odisha\n\nSUBJECT: URGENT COMPLIANCE AND FIELD INSPECTION ORDER\n\nThis is a formal directive issued from the Member of Parliament Command Office regarding Ticket Reference ${grievance.id} (Category: ${grievance.sector}).\n\nINCIDENT CITATION:\nReporter: ${grievance.reporter}\nLocation: Coordinates (${grievance.coordinates?.lat || 20.2961}, ${grievance.coordinates?.lng || 85.8245})\nEst. Severity: ${grievance.urgency} (Critical Priority Routing)\nReported Detail: "${grievance.translatedDescription}"\n\nRECOMMENDED MUNICIPAL ACTION:\n1. Dispatch local engineering and inspection staff to the coordinates immediately.\n2. Formulate immediate corrective repairs.\n3. Submit a progress log and photographic proof of resolution to this Command Center.\n\nFailure to resolve or submit a justified delay brief within 72 hours will trigger escalation to the District Collector.\n\nBy Order of,\nOffice of the Member of Parliament\nJanSahayak Constituency Command.`;
      } else {
        textToStream = `OFFICIAL CONSTITUENCY UPDATE\n\nTo:\nMr./Ms. ${grievance.reporter}\nRegistered Citizen\n\nReference: Grievance Ticket ID ${grievance.id}\n\nDear ${grievance.reporter},\n\nWe are writing to update you on the status of your grievance regarding "${grievance.title}" in Bhubaneswar, which you submitted to the JanSahayak portal.\n\nSTATUS PROTOCOL UPDATE:\nYour ticket has been reviewed by the MP Command Center and is officially updated to: [ ${status.toUpperCase()} ].\n\nAction Route:\nWe have drafted and dispatched an Official Directive (Reference DIR-2026-${grievance.id.split('-')[1]}) to the Municipal Commissioner requesting emergency field remediation. The local supervisor has been assigned to audit the location.\n\nYou can monitor the status live on the Citizen Portal using reference ID: ${grievance.id}. Thank you for helping us keep our constituency clean, safe, and progressive.\n\nWarm regards,\nCitizen Redressal Desk\nOffice of the Member of Parliament`;
      }
    }

    let charIdx = 0;
    const interval = setInterval(() => {
      if (charIdx < textToStream.length) {
        setStreamingText((prev) => prev + textToStream[charIdx]);
        charIdx++;
      } else {
        clearInterval(interval);
        setIsStreaming(false);
      }
    }, 6);
  };

  const handlePrintDispatch = () => {
    const projId = `PROJ-WO-${grievance.id.split('-')[1]}`;
    
    // Estimate cost based on urgency and sector
    let estimatedCost = 10;
    if (grievance.urgency === 'Critical') estimatedCost = 25;
    else if (grievance.urgency === 'Medium') estimatedCost = 15;

    const materialsText = grievance.sector === 'Water Supply'
      ? 'RO Filters: 1 Unit, Piping: 50m, Valve replacements, Labor: 40 Man-days'
      : grievance.sector === 'Sanitation'
      ? 'Waste containers: 4 Units, Sanitation Crew, Disinfectant sprayers, Labor: 20 Man-days'
      : 'Structural cement: 50 Bags, Bitumen mix: 5 Tons, Excavator hire, Labor: 60 Man-days';

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Official Dispatch - ${projId}</title>
          <style>
            body { font-family: 'Times New Roman', serif; padding: 40px; color: #1c1917; line-height: 1.5; }
            .header { text-align: center; border-bottom: 2px double #1c1917; padding-bottom: 20px; margin-bottom: 30px; }
            .emblem { font-size: 24px; font-weight: bold; margin-bottom: 8px; }
            .govt { font-size: 14px; letter-spacing: 2px; text-transform: uppercase; font-weight: bold; }
            .office { font-size: 16px; font-weight: bold; margin-top: 4px; }
            .ref { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 20px; font-family: monospace; }
            .title { text-align: center; font-size: 16px; font-weight: bold; text-decoration: underline; margin-bottom: 25px; text-transform: uppercase; }
            .content { font-size: 14px; text-align: justify; margin-bottom: 40px; }
            .meta-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; }
            .meta-table th, .meta-table td { border: 1px solid #78716c; padding: 10px; text-align: left; }
            .meta-table th { background-color: #f5f5f4; font-weight: bold; }
            .sign-block { float: right; text-align: center; margin-top: 50px; width: 250px; }
            .seal { width: 80px; height: 80px; border-radius: 50%; border: 2px dashed #991b1b; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; color: #991b1b; font-weight: bold; margin-top: 10px; text-transform: uppercase; transform: rotate(-5deg); }
          </style>
        </head>
        <body onload="window.print()">
          <div class="header">
            <div class="govt">Satyameva Jayate</div>
            <div class="emblem">🏛️</div>
            <div class="govt">Government of India</div>
            <div class="office">OFFICE OF THE MEMBER OF PARLIAMENT (MPLAD FUNDING)</div>
            <div class="office">Bhubaneswar Constituency Office, Odisha</div>
          </div>
          
          <div class="ref">
            <div>REF NO: LKD/MPLAD/${projId}</div>
            <div>DATE: ${new Date().toLocaleDateString('en-IN')}</div>
          </div>

          <div class="title">OFFICIAL DISPATCH & WORK ORDER AUTHORIZATION NOTICE</div>

          <div class="content">
            <p>To,</p>
            <p><strong>The Commissioner / Chief Engineer,</strong><br/>Bhubaneswar Municipal Corporation (BMC),<br/>Odisha.</p>
            
            <p>Pursuant to powers vested under the Member of Parliament Local Area Development Scheme (MPLADS), funding is hereby authorized and sanctioned for the emergency public development project outlined below, initiated based on active constituent grievances gathered via <strong>JanSahayak AI</strong>:</p>

            <table class="meta-table">
              <tr>
                <th width="30%">Work Order ID</th>
                <td>${projId}</td>
              </tr>
              <tr>
                <th>Project Title</th>
                <td>Grievance Repair: ${grievance.title}</td>
              </tr>
              <tr>
                <th>Sector</th>
                <td>${grievance.sector}</td>
              </tr>
              <tr>
                <th>Authorized Budget</th>
                <td><strong>₹${estimatedCost} Lakhs (INR)</strong> from the MPLAD annual allocation</td>
              </tr>
              <tr>
                <th>Target Completion</th>
                <td>${grievance.urgency === 'Critical' ? '10 Days' : '20 Days'} from dispatch</td>
              </tr>
              <tr>
                <th>Required Materials</th>
                <td>${materialsText}</td>
              </tr>
              <tr>
                <th>Description / Location</th>
                <td>${grievance.translatedDescription || grievance.description} (Coordinates: ${grievance.coordinates?.lat || 20.2961}, ${grievance.coordinates?.lng || 85.8245})</td>
              </tr>
            </table>

            <p>You are directed to immediately invite tenders or deploy emergency municipal services to execute these works. Monthly progress updates and financial utilization certificates must be submitted directly to this office.</p>
          </div>

          <div class="sign-block">
            <p><strong>Authorized Signatory</strong></p>
            <br/><br/>
            <p>___________________________</p>
            <p>Member of Parliament (MP)<br/>Bhubaneswar Constituency</p>
            <div class="seal">
              MP OFFICE SEAL<br/>BHUBANESWAR
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleExportWorkOrder = () => {
    // Check if project already exists
    const projId = `PROJ-WO-${grievance.id.split('-')[1]}`;
    if (projects.some(p => p.id === projId)) {
      alert('A work order / project for this grievance already exists in the Optimizer queue!');
      return;
    }

    // Estimate cost based on urgency and sector
    let estimatedCost = 10;
    if (grievance.urgency === 'Critical') estimatedCost = 25;
    else if (grievance.urgency === 'Medium') estimatedCost = 15;

    const materialsText = grievance.sector === 'Water Supply'
      ? 'RO Filters: 1 Unit, Piping: 50m, Valve replacements, Labor: 40 Man-days'
      : grievance.sector === 'Sanitation'
      ? 'Waste containers: 4 Units, Sanitation Crew, Disinfectant sprayers, Labor: 20 Man-days'
      : 'Structural cement: 50 Bags, Bitumen mix: 5 Tons, Excavator hire, Labor: 60 Man-days';

    const newProject = {
      id: projId,
      name: `Grievance Repair: ${grievance.title}`,
      sector: grievance.sector,
      cost: estimatedCost,
      duration: grievance.urgency === 'Critical' ? 10 : 20,
      materials: materialsText,
      status: 'queued'
    };

    addProject(newProject);
    handleStatusChange('Work Order Created');
    alert(`Successfully generated and exported Work Order (${projId}) to the Resource Optimizer!`);
  };

  return (
    <div className="glass-panel animate-slide-in" style={{
      position: 'relative',
      height: '100%',
      backgroundColor: 'var(--bg-secondary)',
      borderLeft: '1px solid var(--border-color)',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      overflowY: 'auto'
    }}>
      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        <div>
          <span className="badge badge-info" style={{ marginBottom: '4px' }}>{grievance.id}</span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>Grievance Inspector</h2>
        </div>
        <button
          onClick={onClose}
          className="btn btn-icon"
          style={{ border: 'none', background: 'transparent' }}
          title="Close Inspector"
        >
          <X size={18} />
        </button>
      </div>

      {/* Ticket Metadata Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.8rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={14} style={{ color: 'var(--text-tertiary)' }} />
          <div>
            <div style={{ color: 'var(--text-tertiary)' }}>Reporter</div>
            <div style={{ fontWeight: '500' }}>{grievance.reporter}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={14} style={{ color: 'var(--text-tertiary)' }} />
          <div>
            <div style={{ color: 'var(--text-tertiary)' }}>Date Logged</div>
            <div style={{ fontWeight: '500' }}>
              {new Date(grievance.timestamp).toLocaleDateString()}
            </div>
          </div>
        </div>


      </div>

      {/* Status Management Bar */}
      <div className="glass-panel" style={{ padding: '12px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '500' }}>Grievance Status</span>
          <select
            className="form-select"
            style={{ width: 'auto', padding: '4px 8px', fontSize: '0.8rem' }}
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            <option>Pending</option>
            <option>Investigating</option>
            <option>Work Order Created</option>
            <option>Resolved</option>
          </select>
        </div>
      </div>

      {/* Ticket Details Panel */}
      <div>
        <h3 style={{ fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>Citizen Citation</h3>
        <div className="glass-panel" style={{ padding: '14px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', fontSize: '0.85rem', lineHeight: '1.4' }}>
          <h4 style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '6px' }}>{grievance.title}</h4>
          <p style={{ color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>{grievance.description}</p>
          
          {/* Indic translation tag if necessary */}
          {grievance.description !== grievance.translatedDescription && (
            <div style={{ borderTop: '1px dashed var(--border-color)', marginTop: '10px', paddingTop: '8px' }}>
              <span className="badge badge-success" style={{ fontSize: '0.6rem', marginBottom: '4px' }}>
                AI Indic Translation (Hindi to English)
              </span>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                "{grievance.translatedDescription}"
              </p>
            </div>
          )}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '6px', textAlign: 'right' }}>
          Est. Impact: <strong>{grievance.impact}</strong>
        </div>
      </div>

      {/* Community Support */}
      <div className="glass-panel" style={{ padding: '12px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ThumbsUp size={14} style={{ color: 'var(--warning)' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: '500' }}>Community Support</span>
          </div>
          <button
            onClick={() => !alreadySupported && supportGrievance(grievance.id, userId)}
            disabled={alreadySupported}
            className="btn"
            style={{
              fontSize: '0.75rem',
              padding: '4px 10px',
              border: `1px solid ${alreadySupported ? 'var(--success-border)' : 'var(--border-color)'}`,
              backgroundColor: alreadySupported ? 'var(--success-bg)' : 'transparent',
              color: alreadySupported ? 'var(--success)' : 'var(--text-primary)',
              cursor: alreadySupported ? 'default' : 'pointer',
            }}
          >
            <ThumbsUp size={12} />
            {alreadySupported ? `Supported ✓ (${grievance.supportCount || 0})` : `Support (${grievance.supportCount || 0})`}
          </button>
        </div>
      </div>

      {/* Quality Reports (if any) */}
      {(grievance.qualityReports || []).length > 0 && (
        <div>
          <h3 style={{ fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldAlert size={14} style={{ color: 'var(--warning)' }} />
            Quality Reports ({openQualityReports.length} open)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {(grievance.qualityReports || []).map((r) => (
              <div key={r.id} className="glass-panel" style={{
                padding: '8px 12px',
                backgroundColor: 'var(--bg-tertiary)',
                border: `1px solid ${r.status === 'open' ? 'var(--danger-border)' : 'var(--success-border)'}`,
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '500' }}>{r.description}</span>
                  <span className={`badge ${r.status === 'open' ? 'badge-danger' : 'badge-success'}`} style={{ fontSize: '0.6rem' }}>
                    {r.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                  Reported by {r.reportedBy} on {new Date(r.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Command Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Command Actions</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <button
            onClick={() => streamContent('notice')}
            disabled={isStreaming}
            className="btn"
            style={{ fontSize: '0.75rem', padding: '8px' }}
          >
            <FileText size={14} /> Draft Official Notice
          </button>
          
          <button
            onClick={() => streamContent('response')}
            disabled={isStreaming}
            className="btn"
            style={{ fontSize: '0.75rem', padding: '8px' }}
          >
            <Send size={14} /> Draft Citizen Response
          </button>
        </div>

        {status !== 'Resolved' && status !== 'Work Order Created' ? (
          <button
            onClick={handleExportWorkOrder}
              className="btn btn-primary"
              style={{
                fontSize: '0.8rem',
                padding: '10px',
                width: '100%',
                marginTop: '4px'
              }}
          >
            <CheckCircle2 size={14} /> Generate & Export Work Order
          </button>
        ) : (
          status === 'Work Order Created' && (
            <button
              onClick={handlePrintDispatch}
              className="btn"
              style={{
                fontSize: '0.8rem',
                padding: '10px',
                background: 'var(--accent-glow)',
                color: 'var(--accent)',
                borderColor: 'var(--accent)',
                width: '100%',
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <Printer size={14} /> Print Official Dispatch Letter
            </button>
          )
        )}
      </div>

      {/* Live AI Streaming output */}
      {streamingType && (
        <div className="glass-panel" style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--bg-tertiary)',
          border: '1px solid var(--border-color)',
          padding: '16px',
          flexGrow: 1,
          maxHeight: '350px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {streamingType === 'notice' ? 'OFFICIAL COMPLIANCE ORDER' : 'CITIZEN COMMUNICATION'}
              {isStreaming && <div className="pulse-glow" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent)' }}></div>}
            </span>

            {!isStreaming && (
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={handleCopyToClipboard}
                  className="btn"
                  style={{ padding: '2px 6px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '2px' }}
                  title="Copy to Clipboard"
                >
                  <Copy size={10} />
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            )}
          </div>

          <div style={{
            flexGrow: 1,
            overflowY: 'auto',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px'
          }}>
            <pre style={{
              fontFamily: 'Consolas, monospace',
              fontSize: '0.75rem',
              whiteSpace: 'pre-wrap',
              margin: 0,
              color: 'var(--text-primary)',
              lineHeight: '1.4'
            }}>
              {streamingText}
              {isStreaming && <span className="pulse-glow" style={{ borderRight: '2px solid var(--accent)', marginLeft: '1px' }}></span>}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
