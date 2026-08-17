import ProtectedForm from "./components/ProtectedForm.jsx";
import AnalysisResult from "./components/AnalysisResult.jsx";
import RiskScore from "./components/RiskScore.jsx";
import Sidebar from "./components/Sidebar.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import { useAegisSession } from "./hooks/useAegisSession.js";
import { useTheme } from "./hooks/useTheme.js";

export default function App() {
  const session = useAegisSession();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-surface text-parchment">
      <header className="grid h-[38px] shrink-0 grid-cols-[142px_minmax(0,1fr)_auto] border-b border-hairline bg-surface-low">
        <div className="flex items-center border-r border-hairline px-4">
          <h1 className="font-display text-[27px] leading-none tracking-display text-brass-primary">
            AEGISGUARD
          </h1>
        </div>

        <div className="flex min-w-0 items-center px-4">
          <p className="truncate font-mono text-[8px] uppercase tracking-[0.22em] text-outline">
            SITS BETWEEN THE REQUEST AND THE SERVICE. READS BEHAVIOR, NOT IDENTITY.
          </p>
        </div>

        <div className="flex items-center gap-3 border-l border-hairline px-4 font-mono text-[8px] uppercase tracking-wider text-outline">
          <span>INCOMING REQUEST</span>
          <span className="text-brass-primary">→</span>
          <span className="border border-hairline px-2 py-1 text-parchment">
            AEGISGUARD CHECKPOINT
          </span>
          <span className="text-brass-primary">→</span>
          <span>E-CERTIFICATE SERVICE</span>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          <span className="text-brass-primary">⬢</span>
          <span className="text-brass-primary">◼</span>
          <span className="text-brick">✖</span>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <Sidebar onInitiateScan={session.resetTelemetry} />

        <main className="flex min-w-0 flex-1">
          <section className="flex min-w-0 flex-1 flex-col bg-surface">
            <div className="flex min-h-0 flex-1 flex-col px-7 py-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-mono text-[10px] font-semibold uppercase tracking-wider text-parchment">
                  REQUEST INTAKE
                </h2>
                <span className="font-mono text-[9px] uppercase tracking-wider text-outline">
                  SEC_ZONE_A
                </span>
              </div>

              <div className="min-h-0 flex-1">
                <ProtectedForm
                  form={session.form}
                  onChange={(event) =>
                    session.setForm((prev) => ({
                      ...prev,
                      [event.target.name]: event.target.value,
                    }))
                  }
                  honeypotFieldName={session.honeypotFieldName}
                  honeypotValue={session.honeypotValue}
                  onHoneypotChange={(event) => session.setHoneypotValue(event.target.value)}
                  onKeyDown={session.handleKeyDown}
                  onKeyUp={session.handleKeyUp}
                  onSubmit={session.submitHuman}
                  submitting={session.submitting}
                />
              </div>
            </div>

            {session.error ? (
              <div className="border-t border-brick bg-surface-lowest px-7 py-2 font-mono text-[9px] uppercase tracking-wider text-brick">
                ERROR: {session.error}
              </div>
            ) : null}

            <footer className="border-t border-dashed border-hairline bg-surface px-7 py-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[9px] uppercase tracking-wider text-outline">
                  DEMO CONTROLS:
                </span>
                <button
                  type="button"
                  onClick={session.resetTelemetry}
                  className="border border-hairline bg-surface-lowest px-7 py-2 font-mono text-[9px] font-semibold uppercase tracking-wider text-parchment hover:border-brass hover:text-brass"
                >
                  RUN NORMAL INTERACTION
                </button>
                <button
                  type="button"
                  onClick={session.simulateBot}
                  className="border border-brick bg-surface-lowest px-7 py-2 font-mono text-[9px] font-semibold uppercase tracking-wider text-brick hover:bg-brick/10"
                >
                  RUN BOT SIMULATION
                </button>
              </div>
            </footer>
          </section>

          <AnalysisResult result={session.result} session={session} />
          <RiskScore result={session.result} session={session} />
        </main>
      </div>
    </div>
  );
}