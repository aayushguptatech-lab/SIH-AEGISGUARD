import MouseMonitor from "./MouseMonitor.jsx";
import KeyboardMonitor from "./KeyboardMonitor.jsx";

export default function AnalysisResult({ result, session }) {
  if (!result) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <MouseMonitor pointCount={session?.mouseCount || 0} status="Monitoring" blocked={false} />
          <KeyboardMonitor eventCount={session?.keyCount || 0} status="Monitoring" blocked={false} />
        </div>

        <div className="relative h-48 border border-hairline bg-surface">
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="font-mono text-[10px] uppercase tracking-wider text-outline">
              AWAITING TELEMETRY DATA
            </p>
          </div>
          <svg className="h-full w-full opacity-20" preserveAspectRatio="none">
            {[0, 25, 50, 75, 100].map((y) => (
              <line key={`h-${y}`} x1="0" y1={`${y}%`} x2="100%" y2={`${y}%`} stroke="var(--color-hairline)" strokeWidth="1" />
            ))}
            {[0, 20, 40, 60, 80, 100].map((x) => (
              <line key={`v-${x}`} x1={`${x}%`} y1="0" x2={`${x}%`} y2="100%" stroke="var(--color-hairline)" strokeWidth="1" />
            ))}
          </svg>
        </div>
      </div>
    );
  }

  const { analysis, decision } = result;
  const blocked = decision === "BLOCK";
  const graphColor = blocked ? "#A24A3A" : "#5C7A52";

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <MouseMonitor 
          pointCount={session?.mouseCount || 0} 
          status={blocked ? "SUSPICIOUS" : "NORMAL"} 
          blocked={blocked}
        />
        <KeyboardMonitor 
          eventCount={session?.keyCount || 0} 
          status={blocked ? "ANOMALY" : "NORMAL"}
          blocked={blocked}
        />
      </div>

      <div className="relative h-56 border border-hairline bg-surface">
        <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 400 200">
          <g opacity="0.2">
            {[0, 50, 100, 150, 200].map((y) => (
              <line key={`h-${y}`} x1="0" y1={y} x2="400" y2={y} stroke="var(--color-hairline)" strokeWidth="1" />
            ))}
            {[0, 80, 160, 240, 320, 400].map((x) => (
              <line key={`v-${x}`} x1={x} y1="0" x2={x} y2="200" stroke="var(--color-hairline)" strokeWidth="1" />
            ))}
          </g>

          <path
            d={blocked ? 
              "M0,100 L50,100 L100,102 L150,98 L200,100 L250,102 L300,98 L350,100 L400,100" :
              "M0,120 L40,95 L80,110 L120,85 L160,105 L200,80 L240,100 L280,75 L320,95 L360,70 L400,90"
            }
            fill="none"
            stroke={graphColor}
            strokeWidth="2.5"
          />

          {blocked ? (
            [50, 100, 150, 200, 250, 300, 350].map((x) => (
              <line key={x} x1={x} y1="160" x2={x} y2="180" stroke={graphColor} strokeWidth="2" />
            ))
          ) : (
            [40, 80, 120, 160, 200, 240, 280, 320, 360].map((x, i) => {
              const heights = [15, 25, 18, 30, 20, 22, 28, 19, 26];
              return <line key={x} x1={x} y1={180 - heights[i]} x2={x} y2="180" stroke={graphColor} strokeWidth="2" />;
            })
          )}

          {(blocked ? 
            [50, 100, 150, 200, 250, 300, 350] : 
            [40, 80, 120, 160, 200, 240, 280, 320, 360]
          ).map((x, i) => {
            const yValues = blocked ? 
              [100, 102, 98, 100, 102, 98, 100] :
              [95, 110, 85, 105, 80, 100, 75, 95, 70];
            return <circle key={x} cx={x} cy={yValues[i]} r="3" fill={graphColor} />;
          })}
        </svg>

        <div className="absolute bottom-2 left-2 font-mono text-[9px] text-outline">
          <p>X-102.3</p>
        </div>
        <div className="absolute bottom-2 right-2 font-mono text-[9px] text-outline">
          <p>FREQUENCY // FRAMES</p>
        </div>
        <div className="absolute left-2 top-2 font-mono text-[9px] text-outline">
          <p>Y: VELOCITY / PHASE</p>
        </div>
      </div>
    </div>
  );
}
