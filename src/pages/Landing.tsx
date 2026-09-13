import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Scale,
  GitBranch,
  Target,
  ShieldCheck,
  ChevronRight,
  Flame,
  Layers,
} from 'lucide-react';
import { CubeLogo } from '@/components/common/CubeLogo';
import { useHackMaxStore } from '@/lib/store';

export default function Landing() {
  const navigate = useNavigate();
  const { liveMaxScore, nextTask, completeTask } = useHackMaxStore();
  const [demoTaskDone, setDemoTaskDone] = useState(false);

  return (
    <div className="min-h-screen bg-bg text-fg flex flex-col font-sans selection:bg-accent/25">
      {/* Landing Navbar */}
      <header className="h-14 border-b border-white/[0.05] px-6 sm:px-10 flex items-center justify-between bg-bg-raised/70 backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-7 h-7 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center shadow-[0_0_12px_rgba(59,130,246,0.25)]">
            <CubeLogo className="w-4.5 h-4.5" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-fg text-sm tracking-snug">HackMax</span>
            <span className="text-2xs px-1.5 py-0.2 rounded-md bg-white/[0.04] border border-white/[0.06] text-ink-muted font-mono">
              v0.2
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs text-ink-muted font-medium">
          <a href="#features" className="hover:text-fg transition-colors">
            Features
          </a>
          <a href="#preview" className="hover:text-fg transition-colors">
            Command Center
          </a>
          <a href="#how-it-works" className="hover:text-fg transition-colors">
            The Loop
          </a>
          <a href="#judging" className="hover:text-fg transition-colors">
            Judge Simulation
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/login')}
            className="text-xs font-medium text-secondary hover:text-fg px-2.5 py-1.5 transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/onboarding')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent hover:bg-accent-bright text-white text-xs font-medium shadow-ambient transition-all active:scale-[0.97]"
          >
            <span>Start Maxxing</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-12 px-6 sm:px-10 max-w-5xl mx-auto text-center">
        {/* Urgency tag (Linear Pill) */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-2xs text-secondary mb-5 shadow-ambient">
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="text-fg font-medium">For CS, ECE, IT Students & Hackers</span>
          <span className="text-ink-faint">•</span>
          <span className="text-accent-bright font-mono">Noobs to Podium Winners</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold text-fg tracking-display max-w-3xl mx-auto leading-[1.12]">
          Stop tracking hackathons.{' '}
          <span className="text-accent-bright">
            Start maximizing them.
          </span>
        </h1>

        <p className="mt-4 text-sm sm:text-base text-secondary max-w-xl mx-auto leading-relaxed">
          Not another generic Kanban board. HackMax is an AI-powered command center answering the only question that matters under deadline pressure:
        </p>

        <div className="mt-4 inline-block px-4 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-fg font-mono text-xs sm:text-sm">
          "What should I do next, and why is it the highest-impact thing right now?"
        </div>

        {/* Hero CTAs */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => navigate('/onboarding')}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-accent hover:bg-accent-bright text-white font-medium text-xs shadow-ambient transition-all active:scale-[0.97]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start Maxxing Free</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-fg font-medium text-xs transition-all active:scale-[0.97]"
          >
            <span>Live Interactive Preview</span>
            <ChevronRight className="w-3.5 h-3.5 text-ink-faint" />
          </button>
        </div>

        {/* Telemetry quick stats */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-6 border-t border-white/[0.05] text-left">
          <div className="p-2.5">
            <p className="text-xl font-bold font-mono text-fg">$2.4M+</p>
            <p className="text-2xs text-secondary mt-0.5">Prizes tracked & won</p>
          </div>
          <div className="p-2.5">
            <p className="text-xl font-bold font-mono text-accent-bright">+26 Pts</p>
            <p className="text-2xs text-secondary mt-0.5">Avg. Max Score increase</p>
          </div>
          <div className="p-2.5">
            <p className="text-xl font-bold font-mono text-emerald-400">4 Personas</p>
            <p className="text-2xs text-secondary mt-0.5">AI Judge simulation</p>
          </div>
          <div className="p-2.5">
            <p className="text-xl font-bold font-mono text-fg">78%</p>
            <p className="text-2xs text-secondary mt-0.5">DNA component reuse</p>
          </div>
        </div>
      </section>

      {/* Interactive Command Center Mini-Preview */}
      <section id="preview" className="py-8 px-6 sm:px-10 max-w-5xl mx-auto w-full">
        <div className="glass-panel rounded-xl p-5 border border-white/[0.06] shadow-overlay">
          {/* Header bar of preview */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.05]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="text-2xs font-mono text-ink-faint ml-2">
                hackmax://autonomous-agents-hackathon
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-2xs text-emerald-400 font-mono font-medium">
              ● Live Sprint Status
            </span>
          </div>

          {/* Preview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Card 1: Urgency Countdown */}
            <div className="md:col-span-4 glass-card rounded-xl p-4 flex flex-col justify-between border border-white/[0.05]">
              <div className="flex items-center justify-between mb-2 font-mono">
                <span className="text-2xs font-medium text-ink-muted uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3 h-3 text-red-400" /> Deadline Clock
                </span>
                <span className="px-1.5 py-0.2 rounded bg-red-500/10 text-red-400 text-2xs font-medium">
                  CRITICAL
                </span>
              </div>
              <div className="my-2 text-center">
                <p className="text-2xl font-bold font-mono text-red-400">
                  0d 19h 42m 14s
                </p>
                <p className="text-2xs text-ink-faint mt-0.5 font-mono">Autonomous Agents Hackathon</p>
              </div>
              <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] text-2xs text-secondary">
                ⚠️ <strong className="text-fg">Triage Alert:</strong> Drop low-impact tasks now. Protect demo video time.
              </div>
            </div>

            {/* Card 2: Max Score Gauge */}
            <div className="md:col-span-4 glass-card rounded-xl p-4 flex flex-col items-center justify-center border border-white/[0.05]">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="6"
                    strokeDasharray={264}
                    strokeDashoffset={264 - (liveMaxScore / 100) * 264}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-bold font-mono text-fg">{liveMaxScore}</span>
                  <span className="text-2xs text-ink-faint uppercase tracking-wider font-medium">
                    Max Score
                  </span>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2 text-2xs text-secondary font-mono">
                <span>Criteria: <strong className="text-fg">82%</strong></span>
                <span>•</span>
                <span>Checklist: <strong className="text-fg">50%</strong></span>
              </div>
            </div>

            {/* Card 3: Highest Impact Action */}
            <div className="md:col-span-4 glass-card rounded-xl p-4 flex flex-col justify-between border border-white/[0.05] border-l-2 border-l-accent">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-2xs font-medium text-accent-bright uppercase tracking-wider flex items-center gap-1">
                    <Flame className="w-3 h-3 text-accent-bright" /> Highest Impact Next
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-accent/15 text-accent-bright text-2xs font-mono font-medium">
                    +6 Pts
                  </span>
                </div>
                <h4 className="font-medium text-xs text-fg mt-1">
                  {demoTaskDone ? 'Wire live search verification cards' : (nextTask?.title ?? 'Finish core agent reasoning loop')}
                </h4>
                <p className="text-2xs text-secondary mt-1 leading-relaxed">
                  Driving Innovation & Technical Execution scores. Estimated: 45m.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-white/[0.04]">
                <button
                  onClick={() => {
                    if (nextTask) completeTask(nextTask.id);
                    setDemoTaskDone(true);
                  }}
                  className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 active:scale-[0.97] ${
                    demoTaskDone
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                      : 'bg-accent hover:bg-accent-bright text-white shadow-ambient'
                  }`}
                >
                  {demoTaskDone ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Completed! Score Recomputed</span>
                    </>
                  ) : (
                    <>
                      <span>Start Task Now</span>
                      <ArrowRight className="w-3 h-3" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Launch Full Workspace CTA */}
          <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between">
            <span className="text-2xs text-ink-faint">
              Synchronized with live repository mock state.
            </span>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-2xs font-medium text-accent-bright hover:underline flex items-center gap-1 font-mono"
            >
              <span>Open Command Center</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section id="features" className="py-12 px-6 sm:px-10 max-w-5xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-fg tracking-tight">
            Built for ruthless hackathon efficiency
          </h2>
          <p className="text-secondary text-xs mt-1.5">
            Every feature is engineered to compress hours, eliminate low-value slop, and maximize your judging score.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Bento 1: Max Score */}
          <div className="glass-panel rounded-xl p-5 border border-white/[0.05] flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent-bright mb-3">
                <Target className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-fg">Max Score Engine</h3>
              <p className="text-secondary text-2xs mt-1.5 leading-relaxed">
                A 0–100 transparent readiness index computed from criteria weights, checklist completeness, task momentum, and time decay.
              </p>
            </div>
            <div className="mt-4 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] font-mono text-2xs text-ink-faint flex items-center justify-between">
              <span>Formula:</span>
              <span className="text-accent-bright">50% Crit + 20% Chk + 20% Plan</span>
            </div>
          </div>

          {/* Bento 2: Judge Mode */}
          <div className="glass-panel rounded-xl p-5 border border-white/[0.05] flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
                <Scale className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-fg">AI Judge Simulation</h3>
              <p className="text-secondary text-2xs mt-1.5 leading-relaxed">
                Simulate your project through 4 distinct personas: Technical Architect, Product Manager, Visual Designer, and Head Judge.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5">
              {['Tech', 'Product', 'Design', 'Overall'].map((p) => (
                <span key={p} className="text-2xs px-1.5 py-0.5 rounded bg-white/[0.03] border border-white/[0.05] text-ink-faint font-mono">
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Bento 3: GitHub Telemetry */}
          <div className="glass-panel rounded-xl p-5 border border-white/[0.05] flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
                <GitBranch className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-fg">GitHub Sync & Velocity</h3>
              <p className="text-secondary text-2xs mt-1.5 leading-relaxed">
                Connect your repository to monitor commit frequency, PR status, and branch health in real-time. Max alerts you before time traps derail your sprint.
              </p>
            </div>
            <div className="mt-4 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] font-mono text-2xs flex items-center justify-between text-emerald-400">
              <span>CI: Passing</span>
              <span className="text-ink-faint">42 commits</span>
            </div>
          </div>

          {/* Bento 4: Projects & Reusable Code */}
          <div className="glass-panel rounded-xl p-5 border border-white/[0.05] flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent-bright mb-3">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-fg">Projects & Reusable Code</h3>
              <p className="text-secondary text-2xs mt-1.5 leading-relaxed">
                Save time by indexing your starter templates, auth setups, and UI kits. Build projects faster with up to 70%+ pre-built code reuse.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-2xs text-ink-faint font-mono">
              <span>Starters:</span>
              <span className="text-fg">Auth, UI, Agent RAG</span>
            </div>
          </div>

          {/* Bento 5: Ask Max Copilot */}
          <div className="glass-panel rounded-xl p-5 border border-white/[0.05] flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent-bright mb-3">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-fg">Ask Max Copilot</h3>
              <p className="text-secondary text-2xs mt-1.5 leading-relaxed">
                Dynamic generative action cards. Ask "What should I cut?", "Review pitch hook", or "Triage plan" and execute in 1-click.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-2xs text-accent-bright font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Context-aware to active repo</span>
            </div>
          </div>

          {/* Bento 6: Anti-Slop Discipline */}
          <div className="glass-panel rounded-xl p-5 border border-white/[0.05] flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-3">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-fg">Anti-Slop Protection</h3>
              <p className="text-secondary text-2xs mt-1.5 leading-relaxed">
                Prevents the classic mistake: spending 40% of final hours fixing CSS bugs while the demo video remains unrecorded.
              </p>
            </div>
            <div className="mt-4 p-2 rounded-md bg-red-500/10 border border-red-500/20 text-2xs text-red-400 font-mono">
              Rule: Video {'>'} Docs {'>'} CSS
            </div>
          </div>
        </div>
      </section>

      {/* The Core User Loop */}
      <section id="how-it-works" className="py-12 px-6 sm:px-10 max-w-4xl mx-auto border-t border-white/[0.05]">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-fg tracking-tight">The HackMax Core Loop</h2>
          <p className="text-secondary text-xs mt-1">
            How elite hackathon builders consistently produce podium submissions under extreme time constraints.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { step: '01', name: 'Discover & Analyze', desc: 'Auto-extract criteria, weights, and deadlines from any DevPost URL.' },
            { step: '02', name: 'Synthesize Plan', desc: 'Partition tasks into NOW, NEXT, LATER, and SUBMISSION buckets.' },
            { step: '03', name: 'Build & Telemetry', desc: 'Track commit velocity and recompute Max Score on every completed item.' },
            { step: '04', name: 'Simulate & Submit', desc: 'Pre-flight through 4 AI judges and submit flawless collateral.' },
          ].map((item) => (
            <div key={item.step} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <span className="font-mono text-2xl font-bold text-accent-bright/30">{item.step}</span>
              <h4 className="font-medium text-xs text-fg mt-1">{item.name}</h4>
              <p className="text-2xs text-secondary mt-1 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="py-16 px-6 sm:px-10 max-w-3xl mx-auto text-center">
        <div className="p-8 rounded-2xl glass-panel border border-white/[0.06] shadow-overlay">
          <h2 className="text-2xl sm:text-3xl font-bold text-fg tracking-tight">
            Ready to win your next hackathon?
          </h2>
          <p className="text-secondary text-xs sm:text-sm mt-2 max-w-md mx-auto">
            Get started in 60 seconds with our 5-step onboarding or jump straight into the Command Center in demo mode.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigate('/onboarding')}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-accent hover:bg-accent-bright text-white font-medium text-xs shadow-ambient transition-all active:scale-[0.97]"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-fg font-medium text-xs transition-colors"
            >
              Bypass to Command Center →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/[0.05] py-6 px-6 sm:px-10 text-center text-2xs text-ink-faint flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CubeLogo className="w-4 h-4" />
          <span className="font-medium text-fg">HackMax</span>
          <span>• Maximize your hackathon.</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="hover:text-fg transition-colors">
            Command Center
          </button>
          <button onClick={() => navigate('/judge')} className="hover:text-fg transition-colors">
            Judge Mode
          </button>
          <button onClick={() => navigate('/opportunities')} className="hover:text-fg transition-colors">
            Opportunities
          </button>
          <button onClick={() => navigate('/settings')} className="hover:text-fg transition-colors">
            Settings
          </button>
        </div>
      </footer>
    </div>
  );
}
