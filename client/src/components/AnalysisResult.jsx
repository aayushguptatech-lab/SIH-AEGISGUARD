import RiskScore from "./RiskScore.jsx";

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1 text-sm">
      <span className="text-slate-400">{label}</span>
      <span className="font-mono text-slate-100">{value}</span>
    </div>
  );
}

function formatScore(value) {
  if (typeof value !== "number") return "—";
  return value.toFixed(2);
}

export default function AnalysisResult({ result }) {
  if (!result) return null;

  const { analysis, riskScore, decision, weights } = result;
  const honeypotTriggered = analysis.honeypot.triggered;

  return (
    <section className="rounded-2xl border border-slate-700/80 bg-slate-900/70 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
          AegisGuard Analysis
        </h2>
        <p className="font-mono text-[11px] text-slate-500">
          weights {Math.round(weights.mouse * 100)} / {Math.round(weights.keyboard * 100)} /{" "}
          {Math.round(weights.honeypot * 100)}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <h3 className="mb-2 text-sm font-semibold text-slate-200">Mouse Behavior</h3>
          <Row label="Velocity" value={`${formatScore(analysis.mouse.velocity)}  ${analysis.mouse.labels.velocity}`} />
          <Row label="Acceleration" value={`${formatScore(analysis.mouse.acceleration)}  ${analysis.mouse.labels.acceleration}`} />
          <Row label="Trajectory" value={`${formatScore(analysis.mouse.trajectory)}  ${analysis.mouse.labels.trajectory}`} />
          <Row label="Jitter" value={`${formatScore(analysis.mouse.jitter)}  ${analysis.mouse.labels.jitter}`} />
          <Row label="Mouse score" value={formatScore(analysis.mouse.score)} />
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <h3 className="mb-2 text-sm font-semibold text-slate-200">Keyboard Behavior</h3>
          <Row label="Typing speed" value={`${analysis.keyboard.labels.typingSpeed}  ${formatScore(analysis.keyboard.typingSpeed)}`} />
          <Row label="Dwell time" value={`${formatScore(analysis.keyboard.dwell)}  ${analysis.keyboard.labels.dwell}`} />
          <Row label="Flight time" value={`${formatScore(analysis.keyboard.flight)}  ${analysis.keyboard.labels.flight}`} />
          <Row label="Variance" value={`${formatScore(analysis.keyboard.variance)}  ${analysis.keyboard.labels.variance}`} />
          <Row label="Keyboard score" value={formatScore(analysis.keyboard.score)} />
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
        <h3 className="mb-2 text-sm font-semibold text-slate-200">Honeypot</h3>
        <Row
          label="Status"
          value={honeypotTriggered ? "TRIGGERED" : "NOT TRIGGERED"}
        />
        <Row label="Honeypot score" value={analysis.honeypot.score} />
      </div>

      <div className="mt-4">
        <RiskScore riskScore={riskScore} decision={decision} />
      </div>

      <p className="mt-4 text-center text-xs text-slate-500">
        {decision === "ALLOW"
          ? "Request forwarded to Protected Service"
          : "Request rejected by AegisGuard middleware"}
      </p>
    </section>
  );
}
