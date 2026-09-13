import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
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
import { useHackMaxStore } from '@/lib/store';

export default function Landing() {
  const navigate = useNavigate();
  const { liveMaxScore, nextTask, completeTask } = useHackMaxStore();
  const [demoTaskDone, setDemoTaskDone] = useState(false);

  return (
    <div className="min-h-screen bg-bg text-fg flex flex-col font-sans selection:bg-accent/30 selection:text-white">
      {/* Landing Navbar */}
      <header className="h-16 border-b border-border/80 px-6 sm:px-12 flex items-center justify-between bg-bg/80 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-9 h-9 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shadow-glow">
            <Zap className="w-5 h-5 fill-accent" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight">HackMax</span>
            <span className="text-[10px] text-muted ml-2 px-1.5 py-0.5 rounded bg-elevated border border-border">
              MVP v0.1
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-secondary">
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

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="text-xs font-medium text-secondary hover:text-fg px-3 py-2 transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/onboarding')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-white text-xs font-semibold hover:bg-accent-bright shadow-glow transition-all"
          >
            <span>Start Maxxing</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 sm:px-12 max-w-6xl mx-auto text-center">
        {/* Glow background accent */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/15 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Urgency tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-elevated border border-border text-xs text-secondary mb-6 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="text-fg font-medium">Maximize Submission Quality Per Hour Remaining</span>
          <span className="text-muted">•</span>
          <span className="text-accent-light font-mono">19h 42m Window</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-fg tracking-tight max-w-4xl mx-auto leading-[1.12]">
          Stop tracking hackathons.{' '}
          <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
            Start maximizing them.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-secondary max-w-2xl mx-auto leading-relaxed">
          Not another generic project board. HackMax is an AI-powered command center answering the only question that matters under deadline pressure:
        </p>

        <div className="mt-4 inline-block px-5 py-2.5 rounded-xl bg-elevated/70 border border-border text-fg font-mono text-sm sm:text-base">
          "What should I do next, and why is it the highest-impact thing right now?"
        </div>

        {/* Hero CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => navigate('/onboarding')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-bright shadow-glow transition-all transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start Maxxing Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-elevated border border-border text-fg font-semibold text-sm hover:bg-surface hover:border-accent/40 transition-all"
          >
            <span>Live Interactive Preview</span>
            <ChevronRight className="w-4 h-4 text-muted" />
          </button>
        </div>

        {/* Telemetry quick stats */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6 border-t border-border/60 text-left">
          <div className="p-3">
            <p className="text-2xl font-bold font-mono text-fg">$2.4M+</p>
            <p className="text-xs text-secondary mt-0.5">Prizes tracked & won</p>
          </div>
          <div className="p-3">
            <p className="text-2xl font-bold font-mono text-accent-light">+26 Pts</p>
            <p className="text-xs text-secondary mt-0.5">Avg. Max Score increase</p>
          </div>
          <div className="p-3">
            <p className="text-2xl font-bold font-mono text-success">4 Personas</p>
            <p className="text-xs text-secondary mt-0.5">AI Judge simulation</p>
          </div>
          <div className="p-3">
            <p className="text-2xl font-bold font-mono text-fg">78%</p>
            <p className="text-xs text-secondary mt-0.5">Cross-hackathon DNA reuse</p>
          </div>
        </div>
      </section>

      {/* Interactive Command Center Mini-Preview */}
      <section id="preview" className="py-12 px-6 sm:px-12 max-w-6xl mx-auto w-full">
        <div className="p-1 rounded-2xl bg-gradient-to-b from-accent/30 via-border to-border/40 shadow-2xl">
          <div className="bg-surface rounded-xl p-6 border border-border">
            {/* Header bar of preview */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-border">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="text-xs font-mono text-muted ml-2">
                  hackmax-command-center://autonomous-agents-hackathon
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-success/10 border border-success/20 text-[11px] text-success font-medium">
                  ● Live Simulation
                </span>
              </div>
            </div>

            {/* Preview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Card 1: Urgency Countdown */}
              <div className="md:col-span-4 glass rounded-xl p-5 flex flex-col justify-between border-border/80 hover:border-accent/40 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-red-400" /> Deadline Clock
                  </span>
                  <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-[10px] font-bold">
                    CRITICAL
                  </span>
                </div>
                <div className="my-3 text-center">
                  <p className="text-3xl font-extrabold font-mono text-red-400 animate-pulse">
                    0d 19h 42m 14s
                  </p>
                  <p className="text-[11px] text-muted mt-1">Autonomous Agents Hackathon</p>
                </div>
                <div className="p-2.5 rounded-lg bg-elevated/80 border border-border text-[11px] text-secondary">
                  ⚠️ <span className="text-fg font-medium">Triage Recommendation:</span> Drop low-impact tasks now. Focus strictly on demo video.
                </div>
              </div>

              {/* Card 2: Max Score Gauge */}
              <div className="md:col-span-4 glass rounded-xl p-5 flex flex-col items-center justify-center border-border/80 hover:border-accent/40 transition-colors">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-36 h-36 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="44" fill="none" stroke="#1e2333" strokeWidth="8" />
                    <circle
                      cx="50"
                      cy="50"
                      r="44"
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="8"
                      strokeDasharray={276}
                      strokeDashoffset={276 - (liveMaxScore / 100) * 276}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-4xl font-extrabold font-mono text-fg">{liveMaxScore}</span>
                    <span className="text-[10px] text-muted uppercase tracking-wider font-semibold">
                      Max Score
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-secondary">
                  <span>Criteria: <strong className="text-fg font-mono">82%</strong></span>
                  <span>•</span>
                  <span>Checklist: <strong className="text-fg font-mono">50%</strong></span>
                </div>
              </div>

              {/* Card 3: Highest Impact Action */}
              <div className="md:col-span-4 glass rounded-xl p-5 flex flex-col justify-between border-border/80 border-l-2 border-l-accent hover:border-accent/40 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-accent-light uppercase tracking-wider flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-accent" /> Highest Impact Next
                    </span>
                    <span className="px-2 py-0.5 rounded bg-accent/20 text-accent-bright text-[10px] font-bold">
                      +6 Pts Lift
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm text-fg mt-1">
                    {demoTaskDone ? 'Wire live search verification cards' : (nextTask?.title ?? 'Finish core agent reasoning loop')}
                  </h4>
                  <p className="text-xs text-secondary mt-2 leading-relaxed">
                    Driving the Innovation & Technical Execution scores before the cutoff. Estimated: 45m.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border">
                  <button
                    onClick={() => {
                      if (nextTask) completeTask(nextTask.id);
                      setDemoTaskDone(true);
                    }}
                    className={`w-full py-2.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                      demoTaskDone
                        ? 'bg-success/20 text-success border border-success/30'
                        : 'bg-accent hover:bg-accent-bright text-white shadow-glow'
                    }`}
                  >
                    {demoTaskDone ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Completed! Score Recomputed</span>
                      </>
                    ) : (
                      <>
                        <span>Start Task Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Launch Full Workspace CTA */}
            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
              <span className="text-xs text-muted">
                Interactive preview synchronized with live repository mock state.
              </span>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-xs font-semibold text-accent-light hover:underline flex items-center gap-1"
              >
                <span>Open Full Command Center</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section id="features" className="py-16 px-6 sm:px-12 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-fg tracking-tight">
            Built for ruthless hackathon efficiency
          </h2>
          <p className="text-secondary text-sm mt-3">
            Every feature is engineered to compress hours, eliminate low-value slop, and maximize your judging score.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Bento 1: Max Score */}
          <div className="glass rounded-2xl p-6 border-border/80 hover:border-accent/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent mb-4">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-fg">Max Score Engine</h3>
              <p className="text-secondary text-xs mt-2 leading-relaxed">
                A 0–100 transparent readiness index computed from criteria weights, checklist completeness, task momentum, and time decay. No more guessing if you're ready.
              </p>
            </div>
            <div className="mt-6 p-3 rounded-xl bg-elevated border border-border/80 font-mono text-xs text-muted flex items-center justify-between">
              <span>Formula:</span>
              <span className="text-accent-light">50% Criteria + 20% Checklist + 20% Plan</span>
            </div>
          </div>

          {/* Bento 2: Judge Mode */}
          <div className="glass rounded-2xl p-6 border-border/80 hover:border-accent/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 mb-4">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-fg">Multi-Perspective AI Judge</h3>
              <p className="text-secondary text-xs mt-2 leading-relaxed">
                Simulate your project through 4 distinct personas: Technical Architect, Product Manager, Visual Designer, and Head Judge. Uncover flaws before the judges do.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2">
              {['Technical', 'Product', 'Design', 'Overall'].map((p) => (
                <span key={p} className="text-[10px] px-2 py-1 rounded bg-elevated border border-border text-secondary">
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Bento 3: GitHub Telemetry */}
          <div className="glass rounded-2xl p-6 border-border/80 hover:border-accent/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center text-success mb-4">
                <GitBranch className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-fg">GitHub Velocity Telemetry</h3>
              <p className="text-secondary text-xs mt-2 leading-relaxed">
                Connect your repository to monitor commit velocity, PR merge status, and issue resolution in real-time. Max alerts you when you're bikeshedding on CSS.
              </p>
            </div>
            <div className="mt-6 p-3 rounded-xl bg-elevated border border-border/80 font-mono text-xs flex items-center justify-between text-success">
              <span>CI Build: Passing</span>
              <span className="text-muted">42 commits</span>
            </div>
          </div>

          {/* Bento 4: Cross-Hackathon DNA */}
          <div className="glass rounded-2xl p-6 border-border/80 hover:border-accent/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-fg">Cross-Hackathon DNA</h3>
              <p className="text-secondary text-xs mt-2 leading-relaxed">
                Index reusable components, auth systems, and agent scaffolding across hackathons. Discover new competitions with a calculated 70%+ code reuse score.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between text-xs text-secondary">
              <span>Cataloged components:</span>
              <span className="font-bold text-fg">Auth, UI, RAG, Telemetry</span>
            </div>
          </div>

          {/* Bento 5: Ask Max Copilot */}
          <div className="glass rounded-2xl p-6 border-border/80 hover:border-accent/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-fg">Ask Max Copilot</h3>
              <p className="text-secondary text-xs mt-2 leading-relaxed">
                Powered by OpenUI dynamic generative action cards. Ask "What should I cut?", "Review my pitch hook", or "Triage my plan" and get 1-click executable actions.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-[11px] text-accent-light">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span>Context-aware to your active repo</span>
            </div>
          </div>

          {/* Bento 6: Anti-Slop Discipline */}
          <div className="glass rounded-2xl p-6 border-border/80 hover:border-accent/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-fg">Anti-Slop Protection</h3>
              <p className="text-secondary text-xs mt-2 leading-relaxed">
                Prevents the classic hackathon mistake: spending 40% of the final 6 hours fixing minor CSS bugs while the demo video remains unrecorded.
              </p>
            </div>
            <div className="mt-6 p-2 rounded bg-red-500/10 border border-red-500/20 text-[11px] text-red-400 font-mono">
              Rule of 3: Video {'>'} Docs {'>'} CSS
            </div>
          </div>
        </div>
      </section>

      {/* The Core User Loop */}
      <section id="how-it-works" className="py-16 px-6 sm:px-12 max-w-5xl mx-auto border-t border-border/60">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-fg tracking-tight">The HackMax Core Loop</h2>
          <p className="text-secondary text-sm mt-3">
            How elite hackathon builders consistently produce podium submissions under extreme time constraints.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { step: '01', name: 'Discover & Analyze', desc: 'Auto-extract criteria, weights, and deadlines from any DevPost URL.' },
            { step: '02', name: 'Synthesize Plan', desc: 'Partition tasks into NOW, NEXT, LATER, and SUBMISSION buckets.' },
            { step: '03', name: 'Build & Telemetry', desc: 'Track commit velocity and recompute Max Score on every completed item.' },
            { step: '04', name: 'Simulate & Submit', desc: 'Pre-flight through 4 AI judges and submit flawless collateral.' },
          ].map((item) => (
            <div key={item.step} className="p-5 rounded-xl bg-surface border border-border relative">
              <span className="font-mono text-3xl font-extrabold text-accent/30">{item.step}</span>
              <h4 className="font-bold text-sm text-fg mt-2">{item.name}</h4>
              <p className="text-xs text-secondary mt-1.5 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="py-20 px-6 sm:px-12 max-w-4xl mx-auto text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-elevated to-surface border border-border shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-10" />

          <h2 className="text-3xl sm:text-4xl font-extrabold text-fg tracking-tight">
            Ready to win your next hackathon?
          </h2>
          <p className="text-secondary text-sm sm:text-base mt-4 max-w-xl mx-auto">
            Get started in 60 seconds with our 5-step onboarding or jump straight into the Command Center in demo mode.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate('/onboarding')}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-accent text-white font-bold text-sm hover:bg-accent-bright shadow-glow transition-all"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3.5 rounded-xl bg-surface border border-border text-fg font-semibold text-sm hover:bg-elevated transition-colors"
            >
              Bypass to Command Center →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border/60 py-8 px-6 sm:px-12 text-center text-xs text-muted flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-accent" />
          <span className="font-bold text-fg">HackMax</span>
          <span>• Maximize your hackathon.</span>
        </div>
        <div className="flex items-center gap-6">
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
