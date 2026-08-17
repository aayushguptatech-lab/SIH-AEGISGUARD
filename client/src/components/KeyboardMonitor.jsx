export default function KeyboardMonitor({ eventCount, status }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-700/80 bg-slate-950/50 px-3 py-2">
      <div>
        <p className="text-sm font-medium text-slate-200">Keyboard Behavior</p>
        <p className="font-mono text-[11px] text-slate-500">
          {eventCount} timings (no key values stored)
        </p>
      </div>
      <span className="flex items-center gap-2 text-xs text-cyan-300">
        <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
        {status}
      </span>
    </div>
  );
}
