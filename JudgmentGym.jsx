import { useState, useEffect, useReducer } from "react";

// ─── Data Layer (in-memory DB) ───
const generateId = () => Math.random().toString(36).slice(2, 10);
const now = () => new Date().toISOString();

const INITIAL_STATE = {
  user: { userId: "u_001", email: "demo@judgmentgym.app" },
  decisions: [],
  practiceAttempts: [],
  view: "dashboard", // dashboard | new | detail | practice | analytics
  activeDecisionId: null,
  toast: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_VIEW":
      return { ...state, view: action.view, activeDecisionId: action.id || null };
    case "ADD_DECISION":
      return { ...state, decisions: [...state.decisions, action.decision], view: "detail", activeDecisionId: action.decision.decisionId };
    case "UPDATE_DECISION":
      return { ...state, decisions: state.decisions.map(d => d.decisionId === action.id ? { ...d, ...action.updates } : d) };
    case "ADD_PRACTICE":
      return { ...state, practiceAttempts: [...state.practiceAttempts, action.attempt] };
    case "TOAST":
      return { ...state, toast: action.msg };
    case "CLEAR_TOAST":
      return { ...state, toast: null };
    default:
      return state;
  }
}

// ─── AI Critique Simulator ───
function generateCritique(context, chosenOption, options) {
  const otherOptions = options.filter(o => o !== chosenOption);
  const critiques = [
    `Devil's Advocate: You chose "${chosenOption}", but have you fully considered the downside risk? If the worst-case scenario materializes, would you still defend this choice?`,
    `Perspective Flip: Someone in the opposite position would argue that "${otherOptions[0] || 'an alternative'}" better addresses the underlying problem because it avoids the key assumption your choice relies on.`,
    `Pre-mortem: Imagine it's 6 months from now and this decision failed. The most likely cause of failure is that "${chosenOption}" depended on external factors outside your control.`,
    `Overconfidence Check: Historical data suggests people are overconfident in similar decisions roughly 60-70% of the time. What evidence specifically supports your confidence level?`,
  ];
  return critiques.join("\n\n");
}

// ─── Practice Scenarios ───
const PRACTICE_SCENARIOS = [
  {
    id: "ps1",
    title: "The Startup Pivot",
    stages: [
      { prompt: "Your SaaS startup has 8 months of runway. Growth is flat at 2% MoM. Your CTO proposes pivoting to an AI-powered version that could take 4 months to build. Your sales lead says doubling down on the current product with aggressive sales could work.", options: ["Pivot to AI product", "Double down on sales", "Split the team 50/50"] },
      { prompt: "UPDATE: A major competitor just announced a similar AI feature. Your biggest customer also hinted they'd pay 3x more for AI capabilities. You have 6 months of runway left.", options: ["Accelerate the pivot", "Negotiate partnership with competitor", "Seek emergency funding first"] },
      { prompt: "FINAL: The AI prototype works but has bugs. A VC offers a term sheet contingent on seeing 'real traction' in 60 days. Your sales team just landed 2 new prospects for the old product.", options: ["Launch AI product with bugs", "Show VC the old traction + AI roadmap", "Ask VC for 90 days instead"] },
    ],
  },
  {
    id: "ps2",
    title: "The Hiring Dilemma",
    stages: [
      { prompt: "You need to fill a senior engineering role. Candidate A has 10 years of experience but asked for 30% above budget. Candidate B is junior but brilliant, available immediately and within budget. The project deadline is in 3 months.", options: ["Hire Candidate A (over budget)", "Hire Candidate B (junior)", "Keep searching for 2 more weeks"] },
      { prompt: "UPDATE: Candidate A received another offer and needs an answer in 48 hours. Candidate B just aced a technical challenge. A colleague recommends Candidate C who could start in 6 weeks.", options: ["Accept Candidate A now", "Go with Candidate B", "Wait for Candidate C"] },
    ],
  },
];

// ─── Styles ───
const FONT = "'Instrument Serif', Georgia, serif";
const MONO = "'JetBrains Mono', 'Fira Code', monospace";
const SANS = "'DM Sans', 'Helvetica Neue', sans-serif";

const palette = {
  bg: "#0C0C0E",
  surface: "#161619",
  surfaceHover: "#1E1E22",
  border: "#2A2A30",
  borderLight: "#38383F",
  text: "#E8E6E1",
  textMuted: "#8A8A94",
  accent: "#C4A265",
  accentDim: "rgba(196,162,101,0.15)",
  red: "#D4544E",
  green: "#5CB85C",
  blue: "#5B8DEF",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap');

  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:${palette.bg}; color:${palette.text}; font-family:${SANS}; }

  .app { min-height:100vh; display:flex; flex-direction:column; }
  .header { padding:20px 32px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid ${palette.border}; background:${palette.surface}; }
  .logo { font-family:${FONT}; font-size:26px; color:${palette.accent}; letter-spacing:-0.5px; cursor:pointer; }
  .logo span { color:${palette.textMuted}; font-style:italic; font-size:18px; margin-left:8px; }
  .nav { display:flex; gap:6px; }
  .nav-btn { background:none; border:1px solid transparent; color:${palette.textMuted}; padding:8px 16px; border-radius:8px; cursor:pointer; font-family:${SANS}; font-size:14px; font-weight:500; transition:all .2s; }
  .nav-btn:hover { color:${palette.text}; background:${palette.surfaceHover}; }
  .nav-btn.active { color:${palette.accent}; border-color:${palette.accent}; background:${palette.accentDim}; }

  .main { flex:1; max-width:900px; width:100%; margin:0 auto; padding:40px 32px; }

  .card { background:${palette.surface}; border:1px solid ${palette.border}; border-radius:14px; padding:28px; margin-bottom:20px; transition:border-color .2s; }
  .card:hover { border-color:${palette.borderLight}; }
  .card-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }

  h1 { font-family:${FONT}; font-size:36px; color:${palette.text}; margin-bottom:8px; font-weight:400; }
  h2 { font-family:${FONT}; font-size:24px; color:${palette.text}; margin-bottom:6px; font-weight:400; }
  h3 { font-family:${SANS}; font-size:14px; font-weight:600; text-transform:uppercase; letter-spacing:1.2px; color:${palette.textMuted}; margin-bottom:16px; }

  .subtitle { color:${palette.textMuted}; font-size:15px; margin-bottom:32px; line-height:1.6; }

  .badge { display:inline-block; padding:4px 12px; border-radius:100px; font-size:12px; font-weight:600; letter-spacing:0.5px; }
  .badge-draft { background:rgba(138,138,148,0.15); color:${palette.textMuted}; }
  .badge-committed { background:${palette.accentDim}; color:${palette.accent}; }
  .badge-critiqued { background:rgba(91,141,239,0.15); color:${palette.blue}; }
  .badge-reflected { background:rgba(92,184,92,0.15); color:${palette.green}; }

  label { display:block; font-size:13px; font-weight:600; color:${palette.textMuted}; margin-bottom:6px; text-transform:uppercase; letter-spacing:0.8px; }
  textarea, input[type="text"], input[type="number"] {
    width:100%; background:${palette.bg}; border:1px solid ${palette.border}; color:${palette.text}; padding:12px 16px;
    border-radius:10px; font-family:${SANS}; font-size:14px; line-height:1.6; resize:vertical; transition:border-color .2s;
  }
  textarea:focus, input:focus { outline:none; border-color:${palette.accent}; }
  textarea { min-height:90px; }
  .field { margin-bottom:20px; }

  .btn { display:inline-flex; align-items:center; gap:8px; padding:10px 22px; border-radius:10px; font-family:${SANS}; font-size:14px; font-weight:600; cursor:pointer; border:none; transition:all .2s; }
  .btn-primary { background:${palette.accent}; color:${palette.bg}; }
  .btn-primary:hover { filter:brightness(1.1); transform:translateY(-1px); }
  .btn-primary:disabled { opacity:0.4; cursor:not-allowed; transform:none; }
  .btn-outline { background:none; border:1px solid ${palette.border}; color:${palette.text}; }
  .btn-outline:hover { border-color:${palette.accent}; color:${palette.accent}; }
  .btn-danger { background:rgba(212,84,78,0.15); color:${palette.red}; border:1px solid transparent; }
  .btn-sm { padding:6px 14px; font-size:13px; }
  .btn-group { display:flex; gap:10px; flex-wrap:wrap; margin-top:8px; }

  .option-chip { padding:10px 18px; border-radius:10px; border:1px solid ${palette.border}; background:${palette.bg}; color:${palette.text}; cursor:pointer; font-size:14px; transition:all .2s; }
  .option-chip:hover { border-color:${palette.accent}; }
  .option-chip.selected { border-color:${palette.accent}; background:${palette.accentDim}; color:${palette.accent}; }

  .critique-box { background:rgba(91,141,239,0.06); border:1px solid rgba(91,141,239,0.2); border-radius:12px; padding:20px; margin-top:16px; white-space:pre-wrap; font-size:14px; line-height:1.7; color:${palette.text}; }

  .slider-wrap { display:flex; align-items:center; gap:16px; }
  .slider-wrap input[type="range"] { flex:1; accent-color:${palette.accent}; }
  .slider-val { font-family:${MONO}; font-size:20px; color:${palette.accent}; min-width:50px; text-align:right; }

  .decision-row { display:flex; align-items:center; justify-content:space-between; padding:16px 20px; border-radius:12px; cursor:pointer; transition:background .15s; border:1px solid transparent; }
  .decision-row:hover { background:${palette.surfaceHover}; border-color:${palette.border}; }
  .decision-row .title { font-size:15px; font-weight:500; }
  .decision-row .date { font-size:13px; color:${palette.textMuted}; font-family:${MONO}; }
  .decision-row .meta { display:flex; align-items:center; gap:12px; }

  .metric-grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(180px,1fr)); gap:16px; margin-bottom:28px; }
  .metric { background:${palette.surface}; border:1px solid ${palette.border}; border-radius:12px; padding:20px; text-align:center; }
  .metric .value { font-family:${MONO}; font-size:32px; color:${palette.accent}; }
  .metric .label { font-size:12px; color:${palette.textMuted}; margin-top:4px; text-transform:uppercase; letter-spacing:1px; }

  .stage-indicator { display:flex; gap:8px; margin-bottom:20px; }
  .stage-dot { width:10px; height:10px; border-radius:50%; background:${palette.border}; transition:background .3s; }
  .stage-dot.active { background:${palette.accent}; }
  .stage-dot.done { background:${palette.green}; }

  .toast { position:fixed; bottom:24px; right:24px; background:${palette.accent}; color:${palette.bg}; padding:12px 24px; border-radius:10px; font-weight:600; font-size:14px; z-index:999; animation: fadeIn .3s; }
  @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

  .locked-overlay { position:relative; }
  .locked-overlay::after { content:'🔒 Locked'; position:absolute; top:8px; right:12px; font-size:11px; color:${palette.textMuted}; background:${palette.bg}; padding:2px 10px; border-radius:6px; border:1px solid ${palette.border}; }

  .comparison { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:16px; }
  .comparison > div { padding:16px; border-radius:10px; border:1px solid ${palette.border}; }
  .comparison .label-sm { font-size:11px; text-transform:uppercase; letter-spacing:1px; color:${palette.textMuted}; margin-bottom:6px; }

  .empty-state { text-align:center; padding:60px 20px; color:${palette.textMuted}; }
  .empty-state .icon { font-size:48px; margin-bottom:16px; }

  .section-divider { border:none; border-top:1px solid ${palette.border}; margin:28px 0; }
`;

// ─── Sub-Components ───

function Dashboard({ state, dispatch }) {
  const decisions = [...state.decisions].reverse();
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:32 }}>
        <div>
          <h1>Your Decisions</h1>
          <p className="subtitle">Document, commit, reflect — sharpen your judgment over time.</p>
        </div>
        <button className="btn btn-primary" onClick={() => dispatch({ type:"SET_VIEW", view:"new" })}>+ New Decision</button>
      </div>

      {decisions.length === 0 ? (
        <div className="empty-state">
          <div className="icon">⚖️</div>
          <h2>No decisions yet</h2>
          <p style={{ marginTop:8 }}>Start your first decision entry to begin training your judgment.</p>
        </div>
      ) : (
        <div className="card" style={{ padding:8 }}>
          {decisions.map(d => (
            <div key={d.decisionId} className="decision-row" onClick={() => dispatch({ type:"SET_VIEW", view:"detail", id:d.decisionId })}>
              <div>
                <div className="title">{d.context.slice(0,60)}{d.context.length > 60 ? "…" : ""}</div>
                <div className="date">{new Date(d.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="meta">
                <span className={`badge badge-${d.status}`}>{d.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NewDecision({ dispatch }) {
  const [context, setContext] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const addOption = () => setOptions([...options, ""]);
  const updateOption = (i, v) => { const o = [...options]; o[i] = v; setOptions(o); };

  const create = () => {
    if (!context.trim() || options.filter(o => o.trim()).length < 2) return;
    const decision = {
      decisionId: generateId(),
      context: context.trim(),
      options: options.filter(o => o.trim()),
      status: "draft",
      createdAt: now(),
      commitment: null,
      critique: null,
      reflection: null,
    };
    dispatch({ type:"ADD_DECISION", decision });
    dispatch({ type:"TOAST", msg:"Decision created!" });
  };

  return (
    <div>
      <h1>New Decision</h1>
      <p className="subtitle">Describe the decision you're facing and the options you see.</p>

      <div className="card">
        <div className="field">
          <label>Decision Context / Background</label>
          <textarea placeholder="What decision are you facing? What's the background?" value={context} onChange={e => setContext(e.target.value)} style={{ minHeight:120 }} />
        </div>
        <div className="field">
          <label>Options</label>
          {options.map((o, i) => (
            <input key={i} type="text" placeholder={`Option ${i+1}`} value={o} onChange={e => updateOption(i, e.target.value)} style={{ marginBottom:8 }} />
          ))}
          <button className="btn btn-outline btn-sm" onClick={addOption} style={{ marginTop:4 }}>+ Add Option</button>
        </div>
        <div className="btn-group">
          <button className="btn btn-primary" onClick={create} disabled={!context.trim() || options.filter(o=>o.trim()).length < 2}>Create Decision</button>
          <button className="btn btn-outline" onClick={() => dispatch({ type:"SET_VIEW", view:"dashboard" })}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function DecisionDetail({ state, dispatch }) {
  const decision = state.decisions.find(d => d.decisionId === state.activeDecisionId);
  if (!decision) return <p>Decision not found.</p>;

  const [chosenOption, setChosenOption] = useState(decision.commitment?.chosenOption || "");
  const [confidence, setConfidence] = useState(decision.commitment?.confidence || 50);
  const [expectedOutcome, setExpectedOutcome] = useState(decision.commitment?.expectedOutcome || "");
  const [actualOutcome, setActualOutcome] = useState(decision.reflection?.actualOutcome || "");
  const [lessons, setLessons] = useState(decision.reflection?.lessons || "");

  const isLocked = decision.status !== "draft";
  const hasCritique = !!decision.critique;
  const hasReflection = !!decision.reflection;

  const commit = () => {
    if (!chosenOption || !expectedOutcome.trim()) return;
    dispatch({ type:"UPDATE_DECISION", id:decision.decisionId, updates: {
      status: "committed",
      commitment: { chosenOption, confidence, expectedOutcome: expectedOutcome.trim() },
    }});
    dispatch({ type:"TOAST", msg:"Decision committed & locked 🔒" });
  };

  const requestCritique = () => {
    const content = generateCritique(decision.context, decision.commitment.chosenOption, decision.options);
    dispatch({ type:"UPDATE_DECISION", id:decision.decisionId, updates: {
      status: "critiqued",
      critique: { content, createdAt: now() },
    }});
    dispatch({ type:"TOAST", msg:"AI critique generated!" });
  };

  const saveReflection = () => {
    if (!actualOutcome.trim()) return;
    dispatch({ type:"UPDATE_DECISION", id:decision.decisionId, updates: {
      status: "reflected",
      reflection: { actualOutcome: actualOutcome.trim(), lessons: lessons.trim(), createdAt: now() },
    }});
    dispatch({ type:"TOAST", msg:"Reflection saved ✓" });
  };

  return (
    <div>
      <button className="btn btn-outline btn-sm" onClick={() => dispatch({ type:"SET_VIEW", view:"dashboard" })} style={{ marginBottom:20 }}>← Back</button>

      {/* Context */}
      <div className="card">
        <div className="card-header">
          <h2>Decision Context</h2>
          <span className={`badge badge-${decision.status}`}>{decision.status}</span>
        </div>
        <p style={{ lineHeight:1.7, color:palette.text }}>{decision.context}</p>
        <div style={{ marginTop:16 }}>
          <label>Available Options</label>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:4 }}>
            {decision.options.map((o,i) => <span key={i} style={{ padding:"6px 14px", borderRadius:8, border:`1px solid ${palette.border}`, fontSize:14, color:palette.textMuted }}>{o}</span>)}
          </div>
        </div>
      </div>

      {/* Commitment */}
      <div className="card" style={{ position:"relative" }}>
        {isLocked && <div style={{ position:"absolute", top:12, right:16, fontSize:11, color:palette.textMuted, background:palette.bg, padding:"2px 10px", borderRadius:6, border:`1px solid ${palette.border}` }}>🔒 Locked</div>}
        <h3>Step 1 — Commit Your Choice</h3>
        <div className="field">
          <label>Chosen Option</label>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {decision.options.map((o,i) => (
              <button key={i} className={`option-chip ${chosenOption === o ? "selected" : ""}`} onClick={() => !isLocked && setChosenOption(o)} disabled={isLocked}>{o}</button>
            ))}
          </div>
        </div>
        <div className="field">
          <label>Confidence Level: {confidence}%</label>
          <div className="slider-wrap">
            <input type="range" min="0" max="100" value={confidence} onChange={e => !isLocked && setConfidence(+e.target.value)} disabled={isLocked} />
            <span className="slider-val">{confidence}%</span>
          </div>
        </div>
        <div className="field">
          <label>Expected Outcome</label>
          <textarea placeholder="What do you expect to happen if you go with this option?" value={expectedOutcome} onChange={e => !isLocked && setExpectedOutcome(e.target.value)} disabled={isLocked} />
        </div>
        {!isLocked && (
          <button className="btn btn-primary" onClick={commit} disabled={!chosenOption || !expectedOutcome.trim()}>Commit Decision</button>
        )}
      </div>

      {/* Critique */}
      {isLocked && (
        <div className="card">
          <h3>Step 2 — AI Critique</h3>
          {!hasCritique ? (
            <button className="btn btn-primary" onClick={requestCritique}>Request AI Critique</button>
          ) : (
            <div className="critique-box">{decision.critique.content}</div>
          )}
        </div>
      )}

      {/* Reflection */}
      {hasCritique && (
        <div className="card">
          <h3>Step 3 — Outcome &amp; Reflection</h3>
          <div className="field">
            <label>Actual Outcome</label>
            <textarea placeholder="What actually happened?" value={actualOutcome} onChange={e => !hasReflection && setActualOutcome(e.target.value)} disabled={hasReflection} />
          </div>
          {actualOutcome.trim() && (
            <div className="comparison">
              <div>
                <div className="label-sm">Expected</div>
                <p style={{ fontSize:14, lineHeight:1.6 }}>{decision.commitment.expectedOutcome}</p>
              </div>
              <div>
                <div className="label-sm">Actual</div>
                <p style={{ fontSize:14, lineHeight:1.6 }}>{actualOutcome}</p>
              </div>
            </div>
          )}
          <div className="field" style={{ marginTop:20 }}>
            <label>Lessons Learned</label>
            <textarea placeholder="What would you do differently? What patterns do you notice?" value={lessons} onChange={e => !hasReflection && setLessons(e.target.value)} disabled={hasReflection} />
          </div>
          {!hasReflection && (
            <button className="btn btn-primary" onClick={saveReflection} disabled={!actualOutcome.trim()}>Save Reflection</button>
          )}
        </div>
      )}
    </div>
  );
}

function PracticeMode({ state, dispatch }) {
  const [activeScenario, setActiveScenario] = useState(null);
  const [stageIdx, setStageIdx] = useState(0);
  const [choices, setChoices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [complete, setComplete] = useState(false);

  const start = (scenario) => {
    setActiveScenario(scenario);
    setStageIdx(0);
    setChoices([]);
    setSelected(null);
    setComplete(false);
  };

  const submitChoice = () => {
    if (!selected) return;
    const newChoices = [...choices, selected];
    setChoices(newChoices);
    setSelected(null);

    if (stageIdx + 1 >= activeScenario.stages.length) {
      setComplete(true);
      dispatch({ type:"ADD_PRACTICE", attempt: { scenarioId: activeScenario.id, choices: newChoices, completedAt: now() } });
      dispatch({ type:"TOAST", msg:"Practice scenario completed!" });
    } else {
      setStageIdx(stageIdx + 1);
    }
  };

  if (!activeScenario) {
    return (
      <div>
        <h1>Practice Drills</h1>
        <p className="subtitle">Train your judgment with multi-stage scenarios under evolving conditions.</p>
        {PRACTICE_SCENARIOS.map(s => (
          <div key={s.id} className="card" style={{ cursor:"pointer" }} onClick={() => start(s)}>
            <h2>{s.title}</h2>
            <p style={{ color:palette.textMuted, marginTop:4, fontSize:14 }}>{s.stages.length} stages · ~5 min</p>
          </div>
        ))}
      </div>
    );
  }

  if (complete) {
    return (
      <div>
        <h1 style={{ marginBottom:16 }}>Scenario Complete ✓</h1>
        <div className="card">
          <h2>{activeScenario.title}</h2>
          {activeScenario.stages.map((s, i) => (
            <div key={i} style={{ marginTop:16, padding:16, background:palette.bg, borderRadius:10, border:`1px solid ${palette.border}` }}>
              <div style={{ fontSize:12, color:palette.textMuted, marginBottom:6 }}>STAGE {i + 1}</div>
              <p style={{ fontSize:14, lineHeight:1.6, marginBottom:8 }}>{s.prompt.slice(0, 120)}…</p>
              <span style={{ color:palette.accent, fontWeight:600, fontSize:14 }}>Your choice: {choices[i]}</span>
            </div>
          ))}
          <div className="btn-group" style={{ marginTop:20 }}>
            <button className="btn btn-primary" onClick={() => setActiveScenario(null)}>Back to Scenarios</button>
            <button className="btn btn-outline" onClick={() => start(activeScenario)}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  const stage = activeScenario.stages[stageIdx];

  return (
    <div>
      <button className="btn btn-outline btn-sm" onClick={() => setActiveScenario(null)} style={{ marginBottom:20 }}>← Back to Scenarios</button>
      <h1>{activeScenario.title}</h1>
      <div className="stage-indicator" style={{ marginTop:12 }}>
        {activeScenario.stages.map((_, i) => (
          <div key={i} className={`stage-dot ${i < stageIdx ? "done" : i === stageIdx ? "active" : ""}`} />
        ))}
      </div>
      <div className="card" style={{ marginTop:16 }}>
        <div style={{ fontSize:12, color:palette.accent, fontWeight:600, marginBottom:12, letterSpacing:1 }}>STAGE {stageIdx + 1} OF {activeScenario.stages.length}</div>
        <p style={{ lineHeight:1.8, fontSize:15, marginBottom:24 }}>{stage.prompt}</p>
        <label>Choose Your Action</label>
        <div style={{ display:"flex", flexDirection:"column", gap:8, marginTop:8 }}>
          {stage.options.map((o, i) => (
            <button key={i} className={`option-chip ${selected === o ? "selected" : ""}`} onClick={() => setSelected(o)}>{o}</button>
          ))}
        </div>
        <button className="btn btn-primary" style={{ marginTop:20 }} onClick={submitChoice} disabled={!selected}>Confirm &amp; Continue →</button>
      </div>
    </div>
  );
}

function Analytics({ state }) {
  const total = state.decisions.length;
  const committed = state.decisions.filter(d => d.commitment).length;
  const reflected = state.decisions.filter(d => d.reflection).length;
  const avgConf = committed > 0 ? Math.round(state.decisions.filter(d => d.commitment).reduce((s, d) => s + d.commitment.confidence, 0) / committed) : 0;
  const practiceCount = state.practiceAttempts.length;

  return (
    <div>
      <h1>Analytics</h1>
      <p className="subtitle">Track your decision-making patterns and calibration over time.</p>

      <div className="metric-grid">
        <div className="metric"><div className="value">{total}</div><div className="label">Total Decisions</div></div>
        <div className="metric"><div className="value">{committed}</div><div className="label">Committed</div></div>
        <div className="metric"><div className="value">{reflected}</div><div className="label">Reflected</div></div>
        <div className="metric"><div className="value">{avgConf}%</div><div className="label">Avg Confidence</div></div>
        <div className="metric"><div className="value">{practiceCount}</div><div className="label">Practice Runs</div></div>
      </div>

      {reflected > 0 && (
        <div className="card">
          <h3>Reflection History</h3>
          {state.decisions.filter(d => d.reflection).map(d => (
            <div key={d.decisionId} style={{ marginBottom:16, padding:16, background:palette.bg, borderRadius:10, border:`1px solid ${palette.border}` }}>
              <div style={{ fontWeight:600, fontSize:14, marginBottom:6 }}>{d.context.slice(0, 80)}</div>
              <div style={{ fontSize:13, color:palette.textMuted }}>Chose: <span style={{ color:palette.accent }}>{d.commitment.chosenOption}</span> at {d.commitment.confidence}% confidence</div>
              <div style={{ fontSize:13, color:palette.textMuted, marginTop:4 }}>Lesson: {d.reflection.lessons || "—"}</div>
            </div>
          ))}
        </div>
      )}

      {total === 0 && (
        <div className="empty-state">
          <div className="icon">📊</div>
          <p>Analytics will populate as you create and reflect on decisions.</p>
        </div>
      )}
    </div>
  );
}

// ─── Main App ───
export default function JudgmentGym() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  useEffect(() => {
    if (state.toast) {
      const t = setTimeout(() => dispatch({ type:"CLEAR_TOAST" }), 2500);
      return () => clearTimeout(t);
    }
  }, [state.toast]);

  const views = {
    dashboard: <Dashboard state={state} dispatch={dispatch} />,
    new: <NewDecision dispatch={dispatch} />,
    detail: <DecisionDetail state={state} dispatch={dispatch} />,
    practice: <PracticeMode state={state} dispatch={dispatch} />,
    analytics: <Analytics state={state} />,
  };

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <header className="header">
          <div className="logo" onClick={() => dispatch({ type:"SET_VIEW", view:"dashboard" })}>
            Judgment Gym<span>v1.0</span>
          </div>
          <nav className="nav">
            {[["dashboard","Decisions"],["practice","Practice"],["analytics","Analytics"]].map(([v,l]) => (
              <button key={v} className={`nav-btn ${state.view === v ? "active" : ""}`} onClick={() => dispatch({ type:"SET_VIEW", view:v })}>{l}</button>
            ))}
          </nav>
        </header>
        <main className="main">
          {views[state.view] || views.dashboard}
        </main>
        {state.toast && <div className="toast">{state.toast}</div>}
      </div>
    </>
  );
}
