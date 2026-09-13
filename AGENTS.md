# AGENTS.md — Development Guidelines for AI Coding Agents

## Autonomous Agent Instructions
When building features in this repository:
1. **Source of Truth**: Refer to [GOAL.md](file:///home/ash/lab/hackmax/GOAL.md) for requirements, [SCHEMA.md](file:///home/ash/lab/hackmax/SCHEMA.md) for data schemas, and [ROADMAP.md](file:///home/ash/lab/hackmax/ROADMAP.md) for task order.
2. **Quality & Zero-Error Bar**: Before considering any task or phase complete, run typecheck (`bun x tsc --noEmit`) and build (`bun run build`) to ensure 0 errors and clean compilation.
3. **No Placeholders / Broken Links**: Do not leave empty `TODO` links or inert dead buttons. If an external API or key is not configured, gracefully fall back to the interactive mock data engine with a small non-intrusive "Demo Mode" indicator.
4. **Style Guide**:
   - Dark background: `#08090d` (main background), `#0f111a` (cards/sidebar), `#181b26` (elevated/popover)
   - Border: `#1e2333` or `rgba(255,255,255,0.08)`
   - Primary Accent: Indigo/Violet `#6366f1` / `#818cf8`
   - Success/Glow: Emerald `#10b981`
   - Text: White `#f8fafc` (primary), Slate `#94a3b8` (secondary), `#64748b` (muted)
