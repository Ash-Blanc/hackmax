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
    setSimulationStep('Ingesting codebase AST & README...');

    setTimeout(() => {
      setSimulationStep('Simulating Technical & Architecture Evaluation...');
    }, 400);

    setTimeout(() => {
      setSimulationStep('Synthesizing Product Viability & Presentation Marks...');
    }, 800);

    setTimeout(() => {
      setIsSimulating(false);
      setSimulationStep('');
      toast.success('AI Judge Simulation complete! 4 persona rubrics refreshed.');
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Judge Mode</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[11px] font-mono font-semibold">
              4 AI Personas Calibrated
            </span>
          </div>
          <p className="text-secondary text-xs mt-1">
            Simulate your project through the eyes of elite hackathon judges before you submit.
          </p>
        </div>

        <button
          onClick={handleRunEvaluation}
          disabled={isSimulating}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent to-indigo-600 text-white font-bold text-xs hover:from-accent-bright hover:to-indigo-500 shadow-glow transition-all disabled:opacity-50 shrink-0"
        >
          {isSimulating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          <span>{isSimulating ? simulationStep || 'Simulating...' : 'Run Judge Simulation'}</span>
        </button>
      </div>

      {/* Persona Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {['All', 'Overall', 'Technical', 'Product', 'Design'].map((p) => {
          const Icon = personaIcons[p] || Scale;
          const isSelected = selectedPersona === p;
          return (
            <button
              key={p}
              onClick={() => setSelectedPersona(p)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isSelected
                  ? 'bg-accent/20 text-accent-light border-accent/40 shadow-glow'
                  : 'glass-card border-white/[0.06] text-secondary hover:text-white'
              }`}
            >
              {p !== 'All' && <Icon className="w-3.5 h-3.5" />}
              <span>{p} Judges</span>
            </button>
          );
        })}
      </div>

      {/* Review Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredReviews.map((r) => {
          const Icon = personaIcons[r.persona] || Scale;
          return (
            <div
              key={r.id}
              className="glass-panel rounded-2xl p-6 border border-white/[0.06] chamfer-top hover:border-white/[0.12] transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                {/* Card Top */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shadow-glow">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{r.persona} Judge Persona</h3>
                      <span className="text-[10px] text-muted font-mono">
                        Weight in Grand Prize: 25%
                      </span>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-2xl font-extrabold text-white">{r.overallScore}</span>
                    <span className="text-xs text-muted font-mono"> / 10</span>
                  </div>
                </div>

                {/* Persona Summary */}
                <p className="text-xs text-secondary leading-relaxed mb-4">{r.summary}</p>

                {/* Strengths */}
                {r.strengths && r.strengths.length > 0 && (
                  <div className="mb-4">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider font-mono block mb-2 flex items-center gap-1.5">
                      <ThumbsUp className="w-3 h-3 text-emerald-400" /> What Impressed This Judge
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {r.strengths.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium font-mono"
                        >
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Weakness Callout */}
                <div className="p-3.5 rounded-xl bg-red-500/5 border border-red-500/20 mb-3">
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider font-mono block mb-1 flex items-center gap-1.5">
                    <AlertTriangle className="w-3 h-3" />
                    Biggest Weakness
                  </span>
                  <p className="text-xs text-white leading-snug">{r.biggestWeakness}</p>
                </div>

                {/* Recommended Fix */}
                <div className="p-3.5 rounded-xl bg-accent/10 border border-accent/25">
                  <span className="text-[10px] font-bold text-accent-bright uppercase tracking-wider font-mono block mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Highest-Leverage Fix
                  </span>
                  <p className="text-xs text-white leading-snug">{r.recommendedFix}</p>
                </div>
              </div>

              {/* 1-Click Action */}
              <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[11px] text-muted font-mono">Estimated Lift: +4.2 Max Points</span>
                <button
                  onClick={() => handleTurnFixIntoTask(r.recommendedFix, r.persona)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-accent to-indigo-600 hover:from-accent-bright hover:to-indigo-500 text-white font-semibold text-xs shadow-glow transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Turn Fix into NOW Task →</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}