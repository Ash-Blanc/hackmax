import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#08090d",
          raised: "#0f111a",
          elevated: "#181b26",
        },
        surface: "#0f111a",
        elevated: "#181b26",
        border: "#1e2333",
        line: "#1e2333",
        fg: "#f8fafc",
        secondary: "#94a3b8",
        muted: "#64748b",
        ink: {
          DEFAULT: "#f8fafc",
          muted: "#94a3b8",
          faint: "#64748b",
        },
        accent: {
          DEFAULT: "#6366f1",
          bright: "#818cf8",
          light: "#818cf8",
        },
        success: "#10b981",
        glow: "#10b981",
        warn: "#f59e0b",
        danger: "#ef4444",
      },
      fontFamily: {
        sans: ["Geist", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(99,102,241,0.25), 0 0 24px rgba(99,102,241,0.12)",
        emerald: "0 0 0 1px rgba(16,185,129,0.25), 0 0 20px rgba(16,185,129,0.12)",
      },
      keyframes: {
        pulseWarn: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
        tick: {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.04)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "pulse-warn": "pulseWarn 1.6s ease-in-out infinite",
        tick: "tick 1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
