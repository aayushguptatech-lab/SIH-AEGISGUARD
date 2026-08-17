export default function ProtectedForm({
  form,
  onChange,
  honeypotFieldName,
  honeypotValue,
  onHoneypotChange,
  onKeyDown,
  onKeyUp,
  onSubmit,
  submitting,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-3" autoComplete="off">
      <div>
        <label className="mb-1 block font-mono text-[10px] font-semibold uppercase tracking-wider text-parchment">
          Full Name
        </label>
        <input
          name="name"
          value={form.name}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          className="w-full border border-hairline bg-surface-lowest px-3 py-2 font-sans text-[13px] leading-[18px] text-parchment transition-colors focus:border-brass focus:outline-none"
          placeholder="J. Doe Simulation"
        />
      </div>

      <div>
        <label className="mb-1 block font-mono text-[10px] font-semibold uppercase tracking-wider text-parchment">
          Email
        </label>
        <input
          name="email"
          value={form.email}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          className="w-full border border-hairline bg-surface-lowest px-3 py-2 font-sans text-[13px] leading-[18px] text-parchment transition-colors focus:border-brass focus:outline-none"
          placeholder="bot_instance_77@proxy.net"
        />
      </div>

      <div>
        <label className="mb-1 block font-mono text-[10px] font-semibold uppercase tracking-wider text-parchment">
          Service Requested
        </label>
        <select
          name="service"
          value={form.service}
          onChange={onChange}
          className="w-full border border-hairline bg-surface-lowest px-3 py-2 font-sans text-[13px] leading-[18px] text-parchment transition-colors focus:border-brass focus:outline-none"
        >
          <option value="">—</option>
          <option value="certificate">E-CERTIFICATE ISSUANCE (STANDARD)</option>
          <option value="status">APPLICATION STATUS CHECK</option>
          <option value="records">PUBLIC RECORDS REQUEST</option>
        </select>
      </div>

      {honeypotFieldName ? (
        <div className="hp-trap" aria-hidden="true">
          <label htmlFor={honeypotFieldName}>Leave blank</label>
          <input
            id={honeypotFieldName}
            type="text"
            name={honeypotFieldName}
            tabIndex={-1}
            autoComplete="off"
            value={honeypotValue}
            onChange={onHoneypotChange}
          />
        </div>
      ) : null}

      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="w-full border border-brass bg-brass px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-surface transition-colors hover:bg-brass-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "ANALYZING..." : "SUBMIT REQUEST"}
        </button>
      </div>
    </form>
  );
}
