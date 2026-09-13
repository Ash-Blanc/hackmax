import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /* ── Surface depth ladder (Linear-inspired achromatic void) ── */
        bg: {
          DEFAULT: "#08090d",
          raised: "#0f1117",
          elevated: "#151823",
          popover: "#1c2030",
          input: "#1a1e2e",
        },
        surface: {
          DEFAULT: "#0d0f17",
          1: "#0d0f17",
          2: "#131622",
          3: "#1c2030",
          4: "#242938",
        },

        /* ── Border weight system (hairline geometry) ── */
        border: {
          DEFAULT: "#1e2333",
          subtle: "rgba(255, 255, 255, 0.05)",
          medium: "rgba(255, 255, 255, 0.08)",
          strong: "rgba(255, 255, 255, 0.14)",
          accent: "rgba(99, 102, 241, 0.30)",
        },
        line: "#1e2333",

        /* ── Ink luminance ladder (4-step text hierarchy) ── */
        fg: "#f7f8f8",
        ink: {
          DEFAULT: "#f7f8f8",
          body: "#d0d6e0",
          muted: "#8a8f98",
          faint: "#62666d",
        },
        secondary: "#94a3b8",
        muted: "#64748b",

        /* ── Brand & interactive ── */
        accent: {
          DEFAULT: "#6366f1",
          bright: "#818cf8",
          light: "#818cf8",
          subtle: "rgba(99, 102, 241, 0.12)",
        },
        success: "#10b981",
        glow: "#10b981",
        warn: "#f59e0b",
        danger: "#ef4444",

        /* ── AI timeline pastels (Cursor-inspired) ── */
        ai: {
          thinking: "rgba(223, 168, 143, 0.12)",
          searching: "rgba(159, 201, 162, 0.12)",
          reading: "rgba(159, 187, 224, 0.12)",
          generating: "rgba(192, 168, 221, 0.12)",
        },
      },

      fontFamily: {
        sans: [
          "Inter",
          "Geist",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "Geist Mono",
          "JetBrains Mono",
          "Berkeley Mono",
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
      },

      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],   /* 11px */
      },

      fontWeight: {
        display: "510",  /* Linear-inspired interpolated weight */
      },

      letterSpacing: {
        snug: "-0.01em",
        display: "-0.02em",
      },

      borderRadius: {
        xs: "4px",
        sm: "6px",
        DEFAULT: "8px",
        md: "8px",
        lg: "10px",
        xl: "14px",
        "2xl": "20px",
      },

      boxShadow: {
        /* Elevation shadows */
        ambient: "0 1px 2px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
        lifted: "0 4px 16px -2px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
        overlay: "0 16px 48px -8px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        /* Glow shadows */
        glow: "0 0 0 1px rgba(99,102,241,0.25), 0 0 20px rgba(99,102,241,0.10)",
        "glow-lg": "0 0 0 1px rgba(99,102,241,0.35), 0 0 32px rgba(99,102,241,0.18)",
        emerald: "0 0 0 1px rgba(16,185,129,0.25), 0 0 16px rgba(16,185,129,0.10)",
        rose: "0 0 0 1px rgba(244,63,94,0.25), 0 0 16px rgba(244,63,94,0.10)",
        /* Inner highlight for glass surfaces */
        "inner-glow": "inset 0 1px 0 0 rgba(255,255,255,0.08)",
      },

      transitionTimingFunction: {
        spring: "cubic-bezier(0.16, 1, 0.3, 1)",
        swift: "cubic-bezier(0.4, 0, 0.2, 1)",
      },

      transitionDuration: {
        snap: "80ms",
        hover: "140ms",
        modal: "220ms",
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
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-warn": "pulseWarn 1.6s ease-in-out infinite",
        tick: "tick 1s ease-in-out infinite",
        radar: "radar 2s cubic-bezier(0.16, 1, 0.3, 1) infinite",
        shimmer: "shimmer 2s linear infinite",
        "fade-in": "fade-in 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
