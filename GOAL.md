# GOAL.md — HackMax Master Specification

## 1. Product Overview
- **Name**: HackMax
- **AI Copilot**: Max
- **Core Tagline**: *"Maximize your hackathon."*
- **Aesthetic**: Linear × GitHub × Notion × AI Build Copilot. Dark-first, hyper-focused, high density, premium developer tool feel.
- **Core Thesis**: Not a generic hackathon tracker. Its job is to optimize **submission quality per hour remaining** by continuously answering:
  > **"What should I do next, and why is it the highest-impact thing right now?"**

---

## 2. Core User Loop
**Discover → Analyze → Plan → Build → Track → Review → Submit**

---

## 3. Key Pages & Routes
| Route | Name | Purpose |
| :--- | :--- | :--- |
| `/` | Landing Page | High-converting dark dev-tool landing page with live interactive product preview and clear CTAs |
| `/login`, `/signup` | Auth | Supabase Auth (GitHub OAuth & Email/Password) with Demo Bypass button |
| `/onboarding` | 5-Step Onboarding | Welcome → Goal selection → GitHub OAuth → First hackathon (with URL auto-extract) → Initial Max Plan |
| `/dashboard` | Command Center | **Core Screen**: Urgency countdown, Max Score gauge (0-100), highest-impact next action card, active hackathon grid |
| `/hackathons` | My Hackathons | List/filter active and past hackathons with countdowns, scores, and status badges |
| `/hackathons/:id`| Hackathon Workspace | Detail workspace: live countdown, criteria breakdown, Max Plan timeline (NOW/NEXT/LATER), and submission checklist |
| `/projects` | Projects | Repositories, tech stacks, Project DNA (reusable components & capabilities), connected hackathons |
| `/projects/:id` | Project Detail | Capabilities matrix, linked repositories, telemetry, and hackathon associations |
| `/judge` | Judge Mode | Multi-perspective AI judge simulation (Technical, Product, Design, Overall), weaknesses & instant fixes |
| `/opportunities` | Opportunities | Discover upcoming/remote hackathons matched against existing project DNA with reuse percentages |
| `/analytics` | Analytics | Readiness trajectory over time, hours spent vs impact, anti-slop insights, win history |
| `/github` | GitHub Telemetry | Connected accounts, repository switcher, commit/PR velocity timeline, telemetry graphs |
| `/settings` | Settings | Profile, GitHub OAuth status, AI model/provider settings, notification preferences |

---

## 4. Product Terminology & Concepts
- **Max Score**: Transparent 0-100 submission readiness score computed from core functionality, judging alignment, UX polish, demo readiness, docs, and time remaining.
- **Max Plan**: Time-sliced execution schedule categorizing tasks into `NOW` (immediate high impact), `NEXT` (secondary impact), `LATER` (buffer/nice-to-haves), and `SUBMISSION` (final polish & packaging).
- **Max Mode / Ask Max**: Context-aware AI copilot drawer/panel accessible globally, answering "What should I cut?", "Am I on track?", "Review my pitch".
- **Cross-Hackathon DNA**: Capability & component catalog derived from GitHub repos to calculate reuse % for new hackathons.

---

## 5. Visual Guidelines
- **Palette**: Near-black backgrounds (`#08090d`, `#0e1017`), muted slate text (`#94a3b8`), crisp white headings (`#f8fafc`), subtle borders (`#1e2333`), single electric indigo/violet accent (`#6366f1` / `#818cf8`) and emerald status glow (`#10b981`).
- **Typography**: Clean sans-serif (Inter / Geist) with monospaced accents (JetBrains Mono / Geist Mono) for metrics, countdown timers, and Git commit hashes.
- **Components**: Polished `shadcn/ui` foundation, bespoke telemetry widgets, sleek timeline graphs, skeleton states, zero broken buttons.
- **Generative UI ([OpenUI](https://openui.com))**: Powered by `@openuidev/react-lang` for real-time AI-generated review consoles, dynamic criteria evaluation widgets, and interactive Copilot action cards.
