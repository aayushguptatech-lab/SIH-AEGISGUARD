export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';

  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 border border-hairline px-3 py-2 hover:border-brass"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      <span className="font-mono text-[11px] uppercase tracking-wider text-outline">
        THEME
      </span>
      
      {/* Toggle Switch */}
      <div className="relative h-4 w-8 border border-hairline bg-surface-lowest">
        <div
          className={`absolute top-0 h-full w-1/2 border border-brass bg-brass transition-transform duration-300 ${
            isDark ? 'translate-x-0' : 'translate-x-full'
          }`}
        />
      </div>

      {/* Icon */}
      {isDark ? (
        <svg className="h-4 w-4 text-parchment" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ) : (
        <svg className="h-4 w-4 text-parchment" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
    </button>
  );
}
