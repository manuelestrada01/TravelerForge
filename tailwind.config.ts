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
          base: "#07080c",
          surface: "#0e1117",
          card: "#131720",
          border: "#1c2030",
        },
        gold: {
          DEFAULT: "#d4a017",
          bright: "#f7c948",
        },
        teal: "#00c9a7",
        sage: "#8899aa",
        cream: "#e8e0d0",
        danger: "#e63946",
        arcane: "#8b5cf6",
        ember: "#ff6b35",
      },
      fontFamily: {
        serif: ["var(--font-eb-garamond)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "gold-glow": "0 0 8px rgba(212,160,23,0.8), 0 0 20px rgba(212,160,23,0.3)",
        "gold-glow-sm": "0 0 4px rgba(212,160,23,0.6), 0 0 10px rgba(212,160,23,0.2)",
        "teal-glow": "0 0 8px rgba(0,201,167,0.7), 0 0 20px rgba(0,201,167,0.25)",
        "danger-glow": "0 0 6px rgba(230,57,70,0.8), 0 0 16px rgba(230,57,70,0.3)",
        "panel": "0 4px 24px rgba(0,0,0,0.7), inset 0 1px 0 rgba(212,160,23,0.05)",
      },
      keyframes: {
        "gold-pulse": {
          "0%, 100%": { boxShadow: "0 0 6px rgba(212,160,23,0.6)" },
          "50%": { boxShadow: "0 0 16px rgba(212,160,23,1), 0 0 32px rgba(212,160,23,0.4)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "92%": { opacity: "1" },
          "93%": { opacity: "0.85" },
          "94%": { opacity: "1" },
          "96%": { opacity: "0.9" },
          "97%": { opacity: "1" },
        },
        "ember-pulse": {
          "0%, 100%": { boxShadow: "0 0 6px rgba(255,107,53,0.6)" },
          "50%": { boxShadow: "0 0 14px rgba(255,107,53,0.9), 0 0 28px rgba(255,107,53,0.3)" },
        },
        "void-breathe": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.65", transform: "scale(1.03)" },
        },
        "teal-pulse": {
          "0%, 100%": { boxShadow: "0 0 8px rgba(0,201,167,0.6)" },
          "50%": { boxShadow: "0 0 16px rgba(0,201,167,0.9), 0 0 32px rgba(0,201,167,0.25)" },
        },
      },
      animation: {
        "gold-pulse": "gold-pulse 2.5s ease-in-out infinite",
        flicker: "flicker 8s ease-in-out infinite",
        "ember-pulse": "ember-pulse 2s ease-in-out infinite",
        "void-breathe": "void-breathe 4s ease-in-out infinite",
        "teal-pulse": "teal-pulse 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
