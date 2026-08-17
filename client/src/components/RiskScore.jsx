export default function RiskScore({ riskScore, decision }) {
  const blocked = decision === "BLOCK";
  const tone = blocked
    ? "border-rose-500/40 bg-rose-500/10 text-rose-200"
    : "border-emerald-500/40 bg-emerald-500/10 text-emerald-200";

  return (
    <div className={`rounded-xl border px-5 py-6 text-center ${tone}`}>
      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
        Final Risk Score
      </p>
      <p className="mt-3 font-mono text-5xl font-semibold">
        {riskScore}
        <span className="text-xl text-slate-400"> / 100</span>
      </p>
      <p className="mt-4 text-2xl font-semibold tracking-[0.2em]">{decision}</p>
    </div>
  );
}
