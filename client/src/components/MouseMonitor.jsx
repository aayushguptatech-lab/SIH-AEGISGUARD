export default function MouseMonitor({ pointCount, status, blocked }) {
  return (
    <div className="flex items-center justify-between border border-hairline bg-surface px-3 py-2">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-wider text-parchment">MOUSE BEHAVIOR</p>
        <p className="font-mono text-[10px] text-outline">{pointCount} samples</p>
      </div>
      <span className="flex items-center gap-2">
        <span className={blocked ? "h-2 w-2 bg-brick" : "h-2 w-2 bg-moss"} />
        <span className={blocked ? "font-mono text-[10px] uppercase tracking-wider text-brick" : "font-mono text-[10px] uppercase tracking-wider text-moss"}>{status}</span>
      </span>
    </div>
  );
}
