import { useState } from 'react';
import { useHackMaxStore } from '@/lib/store';
import {
  Scale,
  Sparkles,
  Plus,
  Loader2,
  ThumbsUp,
  Code,
  Smartphone,
  Palette,
  AlertTriangle,
  ShieldCheck,
  Lightbulb,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Task } from '@/types';

const personaIcons: Record<string, any> = {
  Overall: Scale,
  Technical: Code,
  Product: Smartphone,
  Design: Palette,
};

export default function Judge() {
  const { state, primaryHackathon, dispatch } = useHackMaxStore();
  const [selectedPersona, setSelectedPersona] = useState<string>('All');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState<string>('');

  const active = primaryHackathon ?? state.hackathons[0];
  const reviews = state.judgeReviews.filter((r) => r.hackathonId === active?.id);

  const filteredReviews =
    selectedPersona === 'All'
      ? reviews
      : reviews.filter((r) => r.persona.toLowerCase() === selectedPersona.toLowerCase());

  const handleTurnFixIntoTask = (fixText: string, persona: string) => {
    if (!active) return;
    const newTask: Task = {
      id: `task-judge-${Date.now()}`,
      hackathonId: active.id,
      title: `[Judge Fix (${persona})] ${fixText}`,
      stage: 'NOW',
      priority: 'HIGH',
      estimatedMinutes: 60,
      impactLevel: 'CRITICAL',
      status: 'todo',
      sortOrder: 0,
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: 'add_task', task: newTask });
    toast.success(`Injected critical fix task into NOW stage!`);
  };

  const handleRunEvaluation = () => {
    setIsSimulating(true);
    setSimulationStep('Analyzing repository code structure & README...');

    setTimeout(() => {
      setSimulationStep('Simulating Technical & Architecture Evaluation...');
    }, 400);

    setTimeout(() => {
      setSimulationStep('Synthesizing Product Viability & Presentation Marks...');
    }, 800);

    setTimeout(() => {
      setIsSimulating(false);
      setSimulationStep('');
      toast.success('AI Practice Judging complete! 4 persona rubrics refreshed.');
    }, 1200);
  };

  return (
    <div className="space-y-5 max-w-6xl mx-auto animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.05]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg font-semibold text-fg tracking-snug">AI Practice Judge</h1>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-2xs font-mono font-medium">
              4 Real-World Rubrics
            </span>
          </div>
          <p className="text-secondary text-xs mt-0.5">
            Simulate realistic scoring from Technical, Product, and Design judges before submitting your project.
          </p>
        </div>

        <button
          onClick={handleRunEvaluation}
          disabled={isSimulating}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-accent hover:bg-accent-bright text-white text-xs font-medium shadow-ambient transition-all active:scale-[0.97] disabled:opacity-50 shrink-0"
        >
          {isSimulating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          <span>{isSimulating ? simulationStep || 'Simulating…' : 'Run Judge Simulation'}</span>
        </button>
      </div>

      {/* Student Guidance Banner */}
      <div className="p-3.5 rounded-xl glass-panel border border-accent/20 bg-accent/[0.02] flex items-start gap-3 shadow-ambient">
        <div className="w-7 h-7 rounded-lg bg-accent/15 border border-accent/25 flex items-center justify-center text-accent-bright shrink-0 mt-0.5">
          <Lightbulb className="w-3.5 h-3.5" />
        </div>
        <div className="text-xs">
          <p className="font-medium text-fg">Pro-Tip for CS/IT Students &amp; First-Timers:</p>
          <p className="text-secondary text-2xs mt-0.5 leading-relaxed">
            Real hackathon judges only have 2 to 3 minutes per team. If a judge gives your project a lower score below, click <strong className="text-fg">"Turn Fix into NOW Task"</strong> to automatically generate the code task that addresses their specific feedback!
          </p>
        </div>
      </div>

      {/* Persona Filters */}
      <div className="flex flex-wrap items-center gap-1.5">
        {['All', 'Overall', 'Technical', 'Product', 'Design'].map((p) => {
          const Icon = personaIcons[p] || Scale;
          const isSelected = selectedPersona === p;
          return (
            <button
              key={p}
              onClick={() => setSelectedPersona(p)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all active:scale-[0.97] ${
                isSelected
                  ? 'bg-white/[0.08] text-fg border-white/[0.14]'
                  : 'bg-white/[0.02] border-white/[0.05] text-ink-muted hover:text-fg hover:bg-white/[0.04]'
              }`}
            >
              {p !== 'All' && <Icon className="w-3.5 h-3.5" />}
              <span>{p} Judges</span>
            </button>
          );
        })}
      </div>

      {/* Review Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReviews.map((r) => {
          const Icon = personaIcons[r.persona] || Scale;
          return (
            <div
              key={r.id}
              className="glass-panel rounded-xl p-5 border border-white/[0.06] flex flex-col justify-between group shadow-ambient hover:border-white/[0.10] transition-colors"
            >
              <div>
                {/* Card Top */}
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-white/[0.05]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/25 flex items-center justify-center text-accent-bright">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-fg text-xs">{r.persona} Judge Persona</h3>
                      <span className="text-2xs text-ink-faint font-mono">
                        Weight in Grand Prize: 25%
                      </span>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-xl font-bold text-fg">{r.overallScore}</span>
                    <span className="text-2xs text-ink-faint"> / 10</span>
                  </div>
                </div>

                {/* Persona Summary */}
                <p className="text-xs text-secondary leading-relaxed mb-3">{r.summary}</p>

                {/* Strengths */}
                {r.strengths && r.strengths.length > 0 && (
                  <div className="mb-3">
                    <span className="text-2xs font-semibold text-ink-faint uppercase tracking-wider font-mono block mb-1.5 flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3 text-emerald-400" /> What Impressed This Judge
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {r.strengths.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-2xs font-mono font-medium"
                        >
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Weakness Callout */}
                <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/15 mb-2.5">
                  <span className="text-2xs font-medium text-red-400 uppercase tracking-wider font-mono block mb-0.5 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Biggest Weakness
                  </span>
                  <p className="text-xs text-fg leading-snug">{r.biggestWeakness}</p>
                </div>

                {/* Recommended Fix */}
                <div className="p-3 rounded-lg bg-accent/8 border border-accent/20">
                  <span className="text-2xs font-medium text-accent-bright uppercase tracking-wider font-mono block mb-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Highest-Leverage Fix
                  </span>
                  <p className="text-xs text-fg leading-snug">{r.recommendedFix}</p>
                </div>
              </div>

              {/* 1-Click Action */}
              <div className="mt-4 pt-2.5 border-t border-white/[0.04] flex items-center justify-between">
                <span className="text-2xs text-ink-faint font-mono">Estimated Lift: +4.2 Pts</span>
                <button
                  onClick={() => handleTurnFixIntoTask(r.recommendedFix, r.persona)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent hover:bg-accent-bright text-white font-medium text-xs shadow-ambient transition-all active:scale-[0.97]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Turn Fix into NOW Task</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}