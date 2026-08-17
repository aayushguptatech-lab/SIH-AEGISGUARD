/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Bebas Neue", "Impact", "sans-serif"],
        sans: ["Public Sans", "Segoe UI", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
      colors: {
        surface: {
          DEFAULT: "var(--color-surface)",
          dim: "var(--color-surface-dim)",
          bright: "var(--color-surface-bright)",
          lowest: "var(--color-surface-lowest)",
          low: "var(--color-surface-low)",
          container: "var(--color-surface-container)",
          high: "var(--color-surface-high)",
          highest: "var(--color-surface-highest)",
        },
        brass: {
          DEFAULT: "var(--color-brass)",
          primary: "var(--color-brass-primary)",
          container: "var(--color-brass)",
        },
        parchment: {
          DEFAULT: "var(--color-parchment)",
          variant: "var(--color-parchment-variant)",
        },
        moss: "var(--color-moss)",
        brick: "var(--color-brick)",
        hairline: "var(--color-hairline)",
        outline: {
          DEFAULT: "var(--color-outline)",
          variant: "var(--color-outline-variant)",
        },
      },
      letterSpacing: {
        display: "0.1em",
        label: "0.05em",
      },
    },
  },
  plugins: [],
};
