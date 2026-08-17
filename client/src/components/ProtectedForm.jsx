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
    <form onSubmit={onSubmit} className="space-y-4" autoComplete="off">
      <div>
        <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">
          Name
        </label>
        <input
          name="name"
          value={form.name}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-slate-100 outline-none ring-cyan-400/40 focus:ring"
          placeholder="Applicant name"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">
          Email
        </label>
        <input
          name="email"
          value={form.email}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-slate-100 outline-none ring-cyan-400/40 focus:ring"
          placeholder="name@example.gov"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs uppercase tracking-wider text-slate-400">
          Service
        </label>
        <select
          name="service"
          value={form.service}
          onChange={onChange}
          className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-slate-100 outline-none ring-cyan-400/40 focus:ring"
        >
          <option value="">Select service</option>
          <option value="certificate">Certificate request</option>
          <option value="status">Application status</option>
          <option value="records">Public records lookup</option>
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

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Analyzing interaction..." : "Continue Request"}
      </button>
    </form>
  );
}
