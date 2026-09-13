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
        surface: {
          DEFAULT: "#0d0f17",
          1: "#0d0f17",
          2: "#131622",
          3: "#1c2030",
        },
        elevated: "#181b26",
        border: {
          DEFAULT: "#1e2333",
          subtle: "rgba(255, 255, 255, 0.06)",
          highlight: "rgba(255, 255, 255, 0.12)",
          accent: "rgba(99, 102, 241, 0.35)",
        },
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
        "glow-lg": "0 0 0 1px rgba(99,102,241,0.35), 0 0 36px rgba(99,102,241,0.2)",
        emerald: "0 0 0 1px rgba(16,185,129,0.25), 0 0 20px rgba(16,185,129,0.12)",
        rose: "0 0 0 1px rgba(244,63,94,0.25), 0 0 20px rgba(244,63,94,0.12)",
        "inner-glow": "inset 0 1px 0 0 rgba(255,255,255,0.08)",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.16, 1, 0.3, 1)",
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
        radar: {
          "0%": { transform: "scale(0.95)", opacity: "0.8" },
          "100%": { transform: "scale(1.35)", opacity: "0" },
        },
      },
      animation: {
        "pulse-warn": "pulseWarn 1.6s ease-in-out infinite",
        tick: "tick 1s ease-in-out infinite",
        radar: "radar 2s cubic-bezier(0.16, 1, 0.3, 1) infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
