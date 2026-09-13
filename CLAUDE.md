# CLAUDE.md — HackMax Agent Instructions

## Mission
Build **HackMax** (`hackmax`): a dark-first, high-density, production-ready AI-native hackathon command center (Linear × GitHub × Notion × AI Build Copilot).
The single core differentiator across every screen: **"What should I do next, and why is it the highest-impact thing to do right now with the time remaining?"**

Follow the architectural and execution guidelines in:
- [GOAL.md](file:///home/ash/lab/hackmax/GOAL.md): Master product vision, UI/UX feel, and screen breakdown
- [SCHEMA.md](file:///home/ash/lab/hackmax/SCHEMA.md): Supabase PostgreSQL schema, RLS policies, and seed mock data
- [ROADMAP.md](file:///home/ash/lab/hackmax/ROADMAP.md): Strict phased build checklist and acceptance criteria

---

- **Runtime & Package Manager**: [Bun](https://bun.sh) (`bun install`, `bun dev`, `bun run build`)
- **Framework**: Vite + React 18+ + TypeScript (`strict: true`)
- **Styling & UI**: Tailwind CSS + `shadcn/ui` components + Lucide Icons + `class-variance-authority` + `clsx` / `tailwind-merge`
- **Dynamic AI UI & Generative Elements**: [OpenUI](https://openui.com) (`@openuidev/react-lang` / `@openuidev/lang-core`) for agent-generated dynamic review widgets and live copilot interfaces
- **Backend / Database**: Supabase (PostgreSQL, Auth, Row Level Security, Edge Functions)
- **AI Integration**: Server-side Edge Functions / structured JSON schemas + client fallback engine for standalone demo mode
- **State & Data Fetching**: TanStack React Query + React Router DOM v6+

---

## UI / UX Design Principles
- **Aesthetic**: Dark-first (charcoal/near-black backgrounds like `#090a0f`, `#0f1117`, borders `#1e2230`), subtle electric indigo/emerald accent (`#6366f1` / `#10b981`), zero cheap gradients or bubbly SaaS fluff.
- **Density**: Compact, keyboard-navigable, information-dense yet breathable. Linear-like speed and typography.
- **Telemetry**: Real live countdown timers, live progress bars, transparent AI estimation disclaimers ("AI estimate — not official judging score").

---

## Execution Guardrails for Claude Code
1. **Always Runnable**: Ensure `bun dev` and `bun run build` succeed cleanly at every checkpoint. Never leave unresolved TypeScript or JSX syntax errors.
2. **First-Class Demo Mode**: The app MUST work seamlessly out-of-the-box in mock/demo mode (with realistic seed data: Autonomous Agents Hackathon + Agentic Researcher) even when Supabase or GitHub environment variables are omitted or not yet connected.
3. **No Secret Leaks**: Never bundle secret API keys in client-facing code. All AI calls route via Supabase Edge Functions or the local mock provider fallback.
4. **Modularity**: Keep components clean and decoupled (`src/components/command-center`, `src/components/hackathons`, `src/components/github`, `src/components/copilot`, `src/lib/supabase`, `src/lib/ai`, `src/types`).
