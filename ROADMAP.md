# ROADMAP.md — HackMax Phased Implementation Plan

## Phase 1: Project Scaffolding & Application Shell
- [ ] Initialize Vite + React + TypeScript + Tailwind CSS
- [ ] Install & configure `lucide-react`, `shadcn/ui` base utilities (`clsx`, `tailwind-merge`, Radix primitives), and [OpenUI](https://openui.com) (`@openuidev/react-lang`) for dynamic AI-generated UI consoles
- [ ] Set up theme styling: Dark-first, charcoal backgrounds (`#08090d`, `#0e1017`), subtle borders (`#1e2333`), indigo/emerald accents
- [ ] Create layout architecture:
  - Sidebar navigation (Collapsible, responsive)
  - Top header (Global command palette trigger `Cmd+K`, notifications, GitHub status badge, user avatar)
  - Main view container with route outlet
- [ ] Build global routes & placeholder views for all 12 views

## Phase 2: Landing Page & Onboarding Flow
- [ ] **Landing Page (`/`)**:
  - Hero: "Stop tracking hackathons. Start maximizing them."
  - Interactive mini-preview of the Command Center
  - Feature bento grid: Max Score, Judge Simulation, GitHub Telemetry, Cross-Hackathon Reuse
  - CTA button: "Start Maxxing" → `/onboarding` or `/dashboard`
- [ ] **Onboarding (`/onboarding`)**:
  - Step 1: Welcome & Value Prop
  - Step 2: Goal selector ("What are you trying to maximize?")
  - Step 3: Connect GitHub (OAuth trigger or Demo Bypass)
  - Step 4: Add first hackathon (URL input with auto-parse simulation + manual fallback)
  - Step 5: Initial Max Plan generation with celebratory transition to Command Center

## Phase 3: Data Layer & Demo Fallback Engine
- [ ] Configure Supabase client with environment variable handling (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- [ ] Build seamless `MockDataProvider` and `useHackMaxStore` so the entire app is 100% interactive and fully functional even with zero keys set up
- [ ] Seed rich realistic data:
  - Hackathon: `Autonomous Agents Hackathon` (Ending in 19h 42m, Max Score: 74)
  - Project: `Agentic Researcher` (GitHub repo, commits, issues, PRs)
  - Max Plan: Time-partitioned tasks (`NOW`, `NEXT`, `LATER`, `SUBMISSION`)
  - Criteria: Innovation (8.4), Technical (7.8), Impact (8.9), UX (6.7), Presentation (5.8)

## Phase 4: Command Center & Hackathon Workspace
- [ ] **Command Center (`/dashboard`)**:
  - Urgent countdown clock (days, hours, mins, secs with pulse warning)
  - Max Score radial/linear gauge (74/100) with detailed score drivers
  - Highest-Impact Next Action hero card with 1-click "Start Task"
  - Active hackathons cards sorted by urgency and potential impact
- [ ] **Hackathon Detail Workspace (`/hackathons/:id`)**:
  - Header: Live countdown, status, repository link, submission URL
  - Judging Criteria breakdown with confidence tags and AI fix suggestions
  - Execution Plan board (`NOW`, `NEXT`, `LATER`, `SUBMISSION`) with inline task completion and status toggles
  - Interactive Submission Checklist with live readiness indicator

## Phase 5: GitHub Intelligence & Project DNA
- [ ] **GitHub View (`/github`)**:
  - Connected repository switcher
  - Telemetry badges: Last commit, PR velocity, build status, open/closed issues
  - GitHub Activity Feed (real-looking commits, PR merges, README edits)
  - Max Insight callout: "Your backend is 90% complete. Shift focus to demo video."
- [ ] **Project Workspace (`/projects` & `/projects/:id`)**:
  - Project DNA panel: Capabilities (Autonomous Agents, RAG, Tool Use) & Reusable Components (Auth, UI System)
  - Cross-hackathon reuse opportunity card with estimated adaptation hours

## Phase 6: Judge Mode, Opportunities & Analytics
- [ ] **Judge Mode (`/judge`)**:
  - 4 Persona Tabs: Overall, Technical Judge, Product Judge, Design Judge
  - Breakdown: Strengths, Biggest Weakness, Recommended Fix
  - 1-click "Turn Fix into Task" action
- [ ] **Opportunities (`/opportunities`)**:
  - Filterable hackathon discovery cards with Match Score % and Reuse %
  - "Adapt My Project" modal creating a custom Max Plan for new hackathons
- [ ] **Analytics (`/analytics`)**:
  - Max Score progress over time graph
  - Impact vs. Effort distribution chart
  - Anti-slop insights ("You spend 38% of final hours on low-impact CSS tweaks")

## Phase 7: Persistent Copilot "Max" & Polish
- [ ] Collapsible slide-over drawer / bottom bar for "Ask Max"
- [ ] Embed [OpenUI](https://openui.com) dynamic generative inspector for real-time agent output (criteria triage, pitch rewrites, custom checklist generation)
- [ ] Quick actions: "What should I cut?", "Am I on track?", "Review my pitch"
- [ ] Polishing micro-interactions, dark mode glows, toast notifications, keyboard shortcuts
- [ ] Verification check: Zero build errors (`bun run build`), responsive on mobile/desktop, pristine developer aesthetic
