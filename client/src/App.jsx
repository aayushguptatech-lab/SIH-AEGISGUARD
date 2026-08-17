import ProtectedForm from "./components/ProtectedForm.jsx";
import MouseMonitor from "./components/MouseMonitor.jsx";
import KeyboardMonitor from "./components/KeyboardMonitor.jsx";
import AnalysisResult from "./components/AnalysisResult.jsx";
import { useAegisSession } from "./hooks/useAegisSession.js";

export default function App() {
  const session = useAegisSession();

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-8">
      <header className="mb-6 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Middleware layer</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-wide text-white">AEGISGUARD</h1>
        <p className="mt-1 text-slate-400">Anti-Bot Security Gateway</p>
      </header>

      <div className="mb-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-center text-xs uppercase tracking-wider text-slate-400">
        <span>User / Bot</span>
        <span className="rounded-full border border-cyan-400/40 px-3 py-1 text-cyan-300">
          AegisGuard
        </span>
        <span>Protected Service</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-2xl border border-slate-700/80 bg-slate-900/70 p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
              Protected Service Request
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Simulated public-service form. AegisGuard inspects behavior before forwarding.
            </p>
          </div>

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

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={session.resetTelemetry}
              className="rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-200 hover:border-slate-400"
            >
              Normal Interaction
            </button>
            <button
              type="button"
              onClick={session.simulateBot}
              className="rounded-lg border border-rose-400/50 px-3 py-2 text-sm text-rose-200 hover:bg-rose-500/10"
            >
              Simulate Bot
            </button>
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-slate-700/80 bg-slate-900/70 p-5">
            <p className="mb-3 text-sm text-slate-300">
              AegisGuard is analyzing this interaction...
            </p>
            <div className="space-y-2">
              <MouseMonitor pointCount={session.mouseCount} status="Monitoring" />
              <KeyboardMonitor eventCount={session.keyCount} status="Monitoring" />
              <div className="flex items-center justify-between rounded-lg border border-slate-700/80 bg-slate-950/50 px-3 py-2">
                <p className="text-sm font-medium text-slate-200">Honeypot</p>
                <span className="flex items-center gap-2 text-xs text-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Protected
                </span>
              </div>
            </div>
          </section>
          <AnalysisResult result={session.result} />
        </aside>
      </div>

      {session.error ? (
        <p className="mt-4 text-center text-sm text-rose-300">{session.error}</p>
      ) : null}
    </div>
  );
}
