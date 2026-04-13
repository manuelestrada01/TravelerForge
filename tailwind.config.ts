import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./layout/**/*.{js,ts,jsx,tsx,mdx}",
    "./dashboard/**/*.{js,ts,jsx,tsx,mdx}",
    "./xp/**/*.{js,ts,jsx,tsx,mdx}",
    "./strikes/**/*.{js,ts,jsx,tsx,mdx}",
    "./clases-formativas/**/*.{js,ts,jsx,tsx,mdx}",
    "./talentos/**/*.{js,ts,jsx,tsx,mdx}",
    "./distinciones/**/*.{js,ts,jsx,tsx,mdx}",
    "./laminas/**/*.{js,ts,jsx,tsx,mdx}",
    "./misiones/**/*.{js,ts,jsx,tsx,mdx}",
    "./comunidad/**/*.{js,ts,jsx,tsx,mdx}",
    "./docente/**/*.{js,ts,jsx,tsx,mdx}",
    "./shared/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        hud: {
          base: "#080d0a",
          surface: "#0f1a10",
          card: "#131f14",
          border: "#2a4a2e",
        },
        gold: "#c9a227",
        teal: "#00d4aa",
        sage: "#7a9a7e",
        cream: "#f0ebe0",
        danger: "#e53e3e",
        arcane: "#9f7aea",
        // Legacy aliases for backward compatibility
        forest: {
          950: "#080d0a",
          900: "#0f1a10",
          800: "#2a4a2e",
        },
        amber: {
          gold: "#c9a227",
        },
        muted: "#7a9a7e",
      },
      fontFamily: {
        serif: ["var(--font-eb-garamond)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "gold-glow": "0 0 8px rgba(201,162,39,0.8), 0 0 20px rgba(201,162,39,0.3)",
        "gold-glow-sm": "0 0 4px rgba(201,162,39,0.6), 0 0 10px rgba(201,162,39,0.2)",
        "teal-glow": "0 0 8px rgba(0,212,170,0.7), 0 0 20px rgba(0,212,170,0.2)",
        "danger-glow": "0 0 6px rgba(229,62,62,0.8), 0 0 16px rgba(229,62,62,0.3)",
        "panel": "0 4px 24px rgba(0,0,0,0.6), inset 0 1px 0 rgba(201,162,39,0.05)",
      },
      keyframes: {
        "gold-pulse": {
          "0%, 100%": { boxShadow: "0 0 6px rgba(201,162,39,0.6)" },
          "50%": { boxShadow: "0 0 16px rgba(201,162,39,1), 0 0 32px rgba(201,162,39,0.4)" },
        },
      },
      animation: {
        "gold-pulse": "gold-pulse 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
