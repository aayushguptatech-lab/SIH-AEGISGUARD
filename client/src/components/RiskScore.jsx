export default function RiskScore({ result, session }) {
  if (!result) {
    return (
      <aside className="flex w-[420px] flex-col border-l border-hairline bg-surface-low">
        <div className="border-b border-hairline bg-surface-container px-6 py-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-outline">INSPECTION_ACTIVE</span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-moss">INIT_LOG</span>
          </div>
          <p className="font-mono text-[11px] text-parchment">Awaiting telemetry data...</p>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center px-8">
          <div className="mb-6 text-center">
                        <p className="mb-2 font-mono text-[14px] uppercase tracking-wider text-outline">SCORE: --/100</p>
            <div className="mt-8 border border-hairline bg-surface px-12 py-16">
              <p className="font-display text-[72px] leading-none tracking-display text-outline">READY</p>
            </div>
          </div>
          <div className="mt-8 w-full space-y-3">
            <StatusBox label="MOUSE BEHAVIOR" count={session?.mouseCount || 0} unit="PTS" />
            <StatusBox label="KEYBOARD BEHAVIOR" count={session?.keyCount || 0} unit="EVT" />
          </div>
        </div>
      </aside>
    );
  }
  const { riskScore, decision, analysis } = result;
  const blocked = decision === 'BLOCK';
  return (
    <aside className="flex w-[420px] flex-col border-l border-hairline bg-surface-low">
      <Header blocked={blocked} analysis={analysis} />
      <MainDisplay riskScore={riskScore} decision={decision} blocked={blocked} analysis={analysis} />
      <Parameters analysis={analysis} />
    </aside>
  );
}
function StatusBox({ label, count, unit }) {
  return (
    <div className="border border-hairline bg-surface px-4 py-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider text-parchment">{label}</span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 bg-moss" />
          <span className="font-mono text-[10px] uppercase text-moss">{count} {unit}</span>
        </span>
      </div>
    </div>
  );
}
function Header({ blocked, analysis }) {
  return (
    <div className="border-b border-hairline bg-surface-container px-6 py-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider text-outline">INSPECTION_ACTIVE</span>
        <span className={`font-mono text-[10px] uppercase tracking-wider ${blocked ? 'text-brick' : 'text-moss'}`}>{blocked ? 'INIT_LOG' : 'CLEAR'}</span>
      </div>
      <p className="font-mono text-[11px] text-parchment">
        {analysis?.honeypot?.triggered ? 'REASONING: TRAJECTORY TOO MECHANICAL, HONEYPOT TRIGGERED' : 'REASONING: ACCESSIBLE VIA BEHAVIORAL_SIGNATURE'}
      </p>
    </div>
  );
}
function MainDisplay({ riskScore, decision, blocked, analysis }) {
  const textColor = blocked ? 'text-brick' : 'text-moss';
  const bgColor = blocked ? 'bg-brick/10' : 'bg-moss/10';
  const borderColor = blocked ? 'border-brick' : 'border-moss';
  return (
    <div className="flex flex-1 flex-col justify-center border-b border-hairline px-8 py-12">
      <div className={`mb-8 border ${borderColor} ${bgColor} py-16`}>
        <h2 className={`text-center font-display text-[96px] leading-none tracking-display ${textColor}`}>{decision}</h2>
      </div>
      <div className="mb-8 text-center">
        <p className="mb-2 font-mono text-[12px] uppercase tracking-wider text-outline">SCORE:</p>
        <div className="flex items-baseline justify-center gap-2">
          <span className={`font-mono text-[84px] font-bold leading-none ${textColor}`}>{riskScore}</span>
          <span className="font-mono text-[32px] text-outline">/100</span>
        </div>
      </div>
      {analysis?.honeypot?.triggered && (
        <div className={`border ${borderColor} ${bgColor} px-4 py-3`}>
          <p className={`text-center font-mono text-[10px] uppercase tracking-wider ${textColor}`}>REASONING: INACCESSIBLE VIA BEHAVIORAL_ANOMALY</p>
        </div>
      )}
    </div>
  );
}
function Parameters({ analysis }) {
  const getDwellColor = () => analysis?.keyboard?.labels?.dwell?.toLowerCase().includes('uniform') ? 'text-brick' : 'text-parchment';
  const getFlightColor = () => analysis?.keyboard?.labels?.flight?.toLowerCase().includes('uniform') ? 'text-brick' : 'text-parchment';
  const getVarianceColor = () => analysis?.keyboard?.labels?.variance?.toLowerCase().includes('uniform') ? 'text-brick' : 'text-parchment';
  return (
    <div className="border-t border-hairline bg-surface px-6 py-5">
      <p className="mb-4 font-mono text-[10px] uppercase tracking-wider text-outline">SYSTEM PARAMETERS</p>
      <div className="space-y-3 font-mono text-[10px]">
        <div className="flex justify-between">
          <span className="text-outline">DWELL_TIME_AVG</span>
          <span className={getDwellColor()}>{analysis?.keyboard?.dwell ? `${analysis.keyboard.dwell.toFixed(2)} ms` : '95.74 ms'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-outline">FLIGHT_TIME_AVG</span>
          <span className={getFlightColor()}>{analysis?.keyboard?.flight ? `${analysis.keyboard.flight.toFixed(2)} ms` : '68.21 ms'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-outline">RHYTHM_VARIANCE</span>
          <span className={getVarianceColor()}>{analysis?.keyboard?.variance !== undefined ? analysis.keyboard.variance.toFixed(2) : '0.62'}</span>
        </div>
      </div>
    </div>
  );
}