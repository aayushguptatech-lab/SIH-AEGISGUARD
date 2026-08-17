export default function Sidebar({ onInitiateScan, onSimulateBot }) {
  return (
    <aside className="flex w-[240px] flex-col border-r border-hairline bg-surface-container">
      {/* Logo/Unit ID */}
      <div className="border-b border-hairline p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center border border-hairline bg-surface">
            <svg className="h-6 w-6 text-brass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <div>
            <p className="font-display text-[24px] leading-none tracking-label text-brass">
              OP_UNIT_01
            </p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-outline">
              LEVEL_4_AUTH
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <a
          href="#inspection"
          className="flex items-center gap-3 border-l-2 border-brass bg-brass/10 px-4 py-3"
        >
          <svg className="h-5 w-5 text-brass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="font-mono text-[11px] uppercase tracking-wider text-brass">
            INSPECTION
          </span>
        </a>
        
        <a
          href="#terminal"
          className="flex items-center gap-3 border-l-2 border-transparent px-4 py-3 hover:border-hairline hover:bg-surface-low"
        >
          <svg className="h-5 w-5 text-outline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="font-mono text-[11px] uppercase tracking-wider text-parchment">
            TERMINAL
          </span>
        </a>

        <a
          href="#traffic"
          className="flex items-center gap-3 border-l-2 border-transparent px-4 py-3 hover:border-hairline hover:bg-surface-low"
        >
          <svg className="h-5 w-5 text-outline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="font-mono text-[11px] uppercase tracking-wider text-parchment">
            TRAFFIC
          </span>
        </a>

        <a
          href="#reports"
          className="flex items-center gap-3 border-l-2 border-transparent px-4 py-3 hover:border-hairline hover:bg-surface-low"
        >
          <svg className="h-5 w-5 text-outline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="font-mono text-[11px] uppercase tracking-wider text-parchment">
            REPORTS
          </span>
        </a>

        <a
          href="#settings"
          className="flex items-center gap-3 border-l-2 border-transparent px-4 py-3 hover:border-hairline hover:bg-surface-low"
        >
          <svg className="h-5 w-5 text-outline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-mono text-[11px] uppercase tracking-wider text-parchment">
            SETTINGS
          </span>
        </a>
      </nav>

      {/* Initiate Scan Button */}
      <div className="border-t border-hairline p-4">
        <button
          onClick={onInitiateScan}
          className="w-full border border-brass px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-brass hover:bg-brass hover:text-surface"
        >
          INITIATE SCAN
        </button>
      </div>

      {/* Logout */}
      <div className="border-t border-hairline p-4">
        <button className="flex items-center gap-3 text-outline hover:text-parchment">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-mono text-[11px] uppercase tracking-wider">LOGOUT</span>
        </button>
      </div>
    </aside>
  );
}