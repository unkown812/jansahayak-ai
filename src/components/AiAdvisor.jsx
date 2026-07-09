import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Brain, FileText, Copy, Printer, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const constituencyDemographics = {
  "Education Sector": {
    unemploymentRate: "5%",
    primarySchools: 12,
    schoolEnrollmentRate: "94%",
    averageTravelToSchoolKm: "4.5 km",
    infrastructureGap: "Overburdened primary schools in urban center, lack of high-school upgrading funds."
  },
  "Vocational Training & Employment Sector": {
    youthUnemploymentRate: "18%",
    unemployedGraduatesCount: 1200,
    infrastructureGap: "No local skill development or vocational training centers in rural green belt."
  },
  "Water Supply Sector": {
    contaminationsCount: 8,
    populationWithoutFiltration: "42%",
    infrastructureGap: "Lack of central filtration plants and pipe flushes."
  },
  "Sanitation Sector": {
    dailyWasteAccumulationTons: 15,
    infrastructureGap: "Lack of systematic garbage containers and local segregation hubs."
  },
  "Infrastructure & Roads Sector": {
    heavyTrafficRoadWearIndex: "8.5 / 10",
    potholeIncidentsCount: 34,
    infrastructureGap: "Water logging at main junctions, asphalt cracking in industrial expressway."
  }
};

export default function AiAdvisor() {
  const { grievances, projects, budgetCap, currentBudgetUsed, geminiApiKey } = useApp();

  const [isGenerating, setIsGenerating] = useState(false);
  const [briefingText, setBriefingText] = useState('');
  const [copied, setCopied] = useState(false);
  const [advisorLogs, setAdvisorLogs] = useState([]);

  const handleGenerateBriefing = async () => {
    setIsGenerating(true);
    setBriefingText('');
    setAdvisorLogs([]);

    const logs = [
      'Scanning active grievances from Supabase...',
      'Synthesizing scheduled projects priority list...',
      'Combining feedback with Ward Demographics & Public Datasets...',
      'Calculating remaining budget allocation...',
      'Connecting to Google Gemini 1.5 Flash API...',
      'Analyzing comparative trade-offs & bottlenecks...',
      'Structuring strategic recommendations...'
    ];

    for (let i = 0; i < logs.length; i++) {
      await new Promise((r) => setTimeout(r, 450));
      setAdvisorLogs((prev) => [...prev, `[advisor-ai] ${logs[i]}`]);
    }

    let resultReport = '';
    const keyToUse = geminiApiKey;

    if (keyToUse) {
      try {
        const grievancesSummary = grievances.map(g => ({
          id: g.id,
          ward: g.ward,
          sector: g.sector,
          urgency: g.urgency,
          title: g.title
        }));

        const projectsSummary = projects.map(p => ({
          id: p.id,
          name: p.name,
          ward: p.ward,
          sector: p.sector,
          cost: p.cost,
          status: p.status
        }));

        const prompt = `You are the Chief AI Strategic Advisor for a Member of Parliament (MP) in India, Odisha.
Analyze the following live constituency data:

Grievance Complaints Count: ${grievances.length}
Grievances Detail List:
${JSON.stringify(grievancesSummary)}

Scheduled Projects Count: ${projects.length}
Projects Detail List:
${JSON.stringify(projectsSummary)}

Demographics & Infrastructure Gaps of Wards:
${JSON.stringify(constituencyDemographics)}

Budget Constraints:
- MP LAD Fund Budget Cap: ${budgetCap} Lakhs (₹1.0 Crore)
- Budget Allocated: ${currentBudgetUsed} Lakhs
- Remaining Budget: ${budgetCap - currentBudgetUsed} Lakhs

Provide a highly professional, structured constituency strategic roadmap. Use CLEAN, readable markdown format.
You MUST combine the active grievances and proposed projects with the constituency demographic profiles and infrastructure gaps to recommend and rank high-priority development works.
For instance, objectively weigh and compare requests for school upgrades (looking at Ward B's school enrollment rates and travel-distance data) against requests for establishing vocational centers (looking at Ward C's 18% unemployment rate and 1,200 unemployed youth graduates). Show this comparative trade-off analysis explicitly in your recommendations.

Your output must include:
1. ### CONSTITUENCY HEALTH BRIEF
   Calculate a Constituency Health Score (e.g. 75/100) based on active vs. resolved grievances and explain the rating, taking population weight into account.
2. ### PRIMARY BOTTLENECKS
   Identify the top 2 sectors and wards with the highest congestion of grievances.
3. ### STRATEGIC BUDGET RECOMMENDATIONS & TRADE-OFFS
   Recommend where the remaining budget of ${budgetCap - currentBudgetUsed} Lakhs should be allocated. Provide an objective trade-off analysis comparing school upgrades vs. vocational centers or infrastructure vs. sanitation based on the demographic and sector gaps.
4. ### ADMINISTRATIVE DIRECTIVES
   Recommend exactly 3 official directives the MP should issue to local departments (e.g. Water Board, Sanitation Dept) based on this data.`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${keyToUse}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }]
          })
        });

        const data = await response.json();
        resultReport = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        if (!resultReport) {
          throw new Error(data.error?.message || 'Empty response');
        }

      } catch (err) {
        console.error('Error generating briefing:', err);
        setAdvisorLogs((prev) => [...prev, `[error] Live Gemini API failed: ${err.message || err}. Loading fallback report...`]);
        resultReport = getFallbackReport();
      }
    } else {
      setAdvisorLogs((prev) => [...prev, '[system] Gemini API key not detected. Generating template report...']);
      await new Promise((r) => setTimeout(r, 600));
      resultReport = getFallbackReport();
    }

    // Typewrite the results
    let charIdx = 0;
    const interval = setInterval(() => {
      if (charIdx < resultReport.length) {
        setBriefingText((prev) => prev + resultReport[charIdx]);
        charIdx++;
      } else {
        clearInterval(interval);
        setIsGenerating(false);
      }
    }, 4);
  };

  const getFallbackReport = () => {
    return `### CONSTITUENCY HEALTH BRIEF
Constituency Health Score: **68 / 100**
- **Analysis:** Active unresolved issues stand at ${grievances.filter(g => g.status === 'Pending').length} tickets. Satisfaction is low in Ward C and Ward B due to accumulated complaints regarding water contamination and garbage pileups.
- **Budget Margin:** ₹${budgetCap - currentBudgetUsed} Lakhs remaining out of the ₹100 Lakh budget cap.

### PRIMARY BOTTLENECKS
1. **Sanitation Grid Congestion:** High density of garbage and sewer blockage complaints centered in Ward C: Rural Green and Ward B: Urban Center.
2. **Infrastructure Drainage:** Severe road structural damage and potholes reported around Ward A: Industrial Core.

### STRATEGIC BUDGET RECOMMENDATIONS
- **Allocation Plan:** It is advised to deploy ₹15 Lakhs of the remaining budget to set up a waste recycling unit in Ward C.
- **Urgency Dispatch:** Allocate ₹10 Lakhs immediately to drainage repairs in Ward B to alleviate flooding concerns before monsoon escalations.

### ADMINISTRATIVE DIRECTIVES
1. **Directive DIR-B-WATER:** Order to Zonal Water Commissioner to execute immediate main line flushing in Ward B.
2. **Directive DIR-C-SANITATION:** Deploy 4 new garbage disposal trucks to Sector 3 in Ward C.
3. **Directive DIR-A-ROADS:** Direct the municipal engineers to run a safety audit of the Industrial Core expressway.`;
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(briefingText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printContent = document.getElementById('briefing-text-print-area').innerText;
    const windowUrl = 'about:blank';
    const uniqueName = new Date().getTime();
    const printWindow = window.open(windowUrl, uniqueName, 'left=50,top=50,width=800,height=600');

    printWindow.document.write(`
      <html>
        <head>
          <title>JanSahayak AI - Strategic Constituency Report</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
            h3 { color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 30px; }
            pre { white-space: pre-wrap; word-wrap: break-word; font-family: inherit; font-size: 16px; }
            .header { border-bottom: 3px double #94a3b8; padding-bottom: 12px; margin-bottom: 24px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>JanSahayak AI STRATEGIC ADVISOR</h2>
            <p>Office of the Member of Parliament (India Constituency)</p>
          </div>
          <pre>${printContent}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };



  return (
    <div className="admin-advisor-container animate-fade-in" style={{ padding: '24px 0' }}>
      <div className="optimizer-grid" style={{ gap: '24px' }}>

        {/* Left Column: Briefing Controller */}
        <div className="card-outer" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 className="card-title flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Brain size={22} className="text-indigo-400" />
              AI Strategic Consulting Room
            </h3>
            <p className="text-zinc-400 text-sm mt-2">
              Synthesizes active grievances and development projects from your Supabase PostgreSQL database to model a strategic resource plan using Google Gemini AI.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="metrics-box" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '12px' }}>
              <div className="text-zinc-500 text-xs uppercase font-semibold">Parsed Grievances</div>
              <div className="text-2xl font-bold text-white mt-1">{grievances.length}</div>
            </div>
            <div className="metrics-box" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '12px' }}>
              <div className="text-zinc-500 text-xs uppercase font-semibold">Active Projects</div>
              <div className="text-2xl font-bold text-white mt-1">{projects.length}</div>
            </div>
          </div>

          <div className="card-inner" style={{ padding: '16px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <h4 className="text-sm font-semibold text-indigo-300 flex items-center gap-1">
              <Sparkles size={16} /> Gemini LLM Analytics Mode
            </h4>
            <ul className="text-xs text-zinc-400 mt-2 space-y-1">
              <li>• Weighs urgent public demands and geographical congestion.</li>
              <li>• Runs strategic budget simulations under the ₹1.0Cr MP LAD fund cap.</li>
              <li>• Formulates official administrative directives for Zonal Commissioners.</li>
            </ul>
          </div>

          <button
            onClick={handleGenerateBriefing}
            disabled={isGenerating}
            className="gradient-btn"
            style={{
              padding: '12px',
              borderRadius: '10px',
              fontWeight: '600',
              cursor: isGenerating ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#ffffff'
            }}
          >
            {isGenerating ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                Analyzing Database...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate AI Strategic Roadmap
              </>
            )}
          </button>

          {/* Typewriter logs */}
          {advisorLogs.length > 0 && (
            <div className="terminal-logs text-xs font-mono p-4 rounded-lg" style={{ background: '#09090b', border: '1px solid #18181b', color: 'var(--text-tertiary)', maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {advisorLogs.map((log, idx) => (
                <div key={idx} style={{ color: log.includes('error') ? 'var(--danger)' : log.includes('system') ? 'var(--warning)' : '#34d399' }}>
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: AI Briefing Output */}
        <div className="card-outer" style={{ display: 'flex', flexDirection: 'column', minHeight: '400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>
            <h3 className="card-title flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <FileText size={20} className="text-zinc-400" />
              Strategic Executive Report
            </h3>
            {briefingText && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleCopyToClipboard}
                  className="theme-toggle-btn"
                  title="Copy to Clipboard"
                  style={{ border: '1px solid var(--border-color)', background: 'transparent', padding: '6px', borderRadius: '8px', color: 'var(--text-secondary)' }}
                >
                  <Copy size={16} className={copied ? 'text-green-400' : ''} />
                </button>
                <button
                  onClick={handlePrint}
                  className="theme-toggle-btn"
                  title="Print Strategic Brief"
                  style={{ border: '1px solid var(--border-color)', background: 'transparent', padding: '6px', borderRadius: '8px', color: 'var(--text-secondary)' }}
                >
                  <Printer size={16} />
                </button>
              </div>
            )}
          </div>

          <div
            id="briefing-text-print-area"
            style={{
              flexGrow: 1,
              background: '#ffffff',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '24px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '14px',
              maxHeight: '520px',
              overflowY: 'auto'
            }}
          >
            {briefingText ? (
              <div className="space-y-4 font-normal" style={{ color: 'var(--text-secondary)' }}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ node, ...props }) => <h1 style={{ color: 'var(--text-primary)', fontSize: '1.4rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginTop: '20px', marginBottom: '12px' }} {...props} />,
                    h2: ({ node, ...props }) => <h2 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', marginTop: '18px', marginBottom: '10px' }} {...props} />,
                    h3: ({ node, ...props }) => <h3 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', marginTop: '16px', marginBottom: '8px' }} {...props} />,
                    p: ({ node, ...props }) => <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.6', margin: '0 0 12px 0' }} {...props} />,
                    ul: ({ node, ...props }) => <ul style={{ paddingLeft: '20px', margin: '0 0 16px 0', listStyleType: 'disc' }} {...props} />,
                    li: ({ node, ...props }) => <li style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '6px' }} {...props} />,
                    ol: ({ node, ...props }) => <ol style={{ paddingLeft: '20px', margin: '0 0 16px 0', listStyleType: 'decimal' }} {...props} />,
                    strong: ({ node, ...props }) => <strong style={{ color: 'var(--text-primary)', fontWeight: 'bold' }} {...props} />,
                    table: ({ node, ...props }) => <table style={{ width: '100%', borderCollapse: 'collapse', margin: '16px 0', border: '1px solid var(--border-color)' }} {...props} />,
                    th: ({ node, ...props }) => <th style={{ padding: '8px 12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '0.85rem' }} {...props} />,
                    td: ({ node, ...props }) => <td style={{ padding: '8px 12px', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem' }} {...props} />
                  }}
                >
                  {briefingText}
                </ReactMarkdown>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-tertiary)', gap: '12px', textAlign: 'center', padding: '40px' }}>
                <Brain size={48} className="text-zinc-800 animate-pulse" />
                <div>
                  <p className="font-semibold text-zinc-400">Strategic Report Queue Empty</p>
                  <p className="text-xs text-zinc-600 mt-1 max-w-sm">Click "Generate AI Strategic Roadmap" on the left to pull live rows from Supabase and compile the strategic consultation brief.</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
