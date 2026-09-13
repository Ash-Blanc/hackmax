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
      impactLevel: 'HIGH',
      status: 'todo',
      sortOrder: 0,
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: 'add_task', task: newTask });
    toast.success(`Created NOW task: ${newTask.title}`);
  };

  const handleRunEvaluation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      toast.success('AI Judge Simulation complete! Scores and fixes refreshed.');
    }, 900);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-fg tracking-tight">Judge Mode</h1>
            <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[11px] font-mono font-semibold">
              4 AI Personas
            </span>
          </div>
          <p className="text-secondary text-xs mt-1">
            Simulate your project through the eyes of elite hackathon judges before you submit.
          </p>
        </div>

        <button
          onClick={handleRunEvaluation}
          disabled={isSimulating}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white font-bold text-xs hover:bg-accent-bright shadow-glow transition-all disabled:opacity-50 shrink-0"
        >
          {isSimulating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          <span>{isSimulating ? 'Simulating Judges...' : 'Run Judge Simulation'}</span>
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
                  ? 'bg-accent/15 text-accent-light border-accent/40 shadow-sm'
                  : 'bg-elevated/80 border-border text-secondary hover:text-fg hover:border-border/80'
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
              className="glass rounded-2xl p-6 border-border hover:border-accent/30 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Card Top */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-fg text-sm">{r.persona} Judge Persona</h3>
                      <span className="text-[10px] text-muted font-mono">
                        Weight in Grand Prize: 25%
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold font-mono text-fg">{r.overallScore}</span>
                    <span className="text-xs text-muted font-mono"> / 10</span>
                  </div>
                </div>

                {/* Persona Summary */}
                <p className="text-xs text-secondary leading-relaxed mb-4">{r.summary}</p>

                {/* Strengths */}
                {r.strengths && r.strengths.length > 0 && (
                  <div className="mb-4">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                      <ThumbsUp className="w-3 h-3 text-success" /> What Impressed This Judge
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {r.strengths.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 rounded-lg bg-success/10 border border-success/20 text-success text-[11px] font-medium"
                        >
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Weakness Callout */}
                <div className="p-3.5 rounded-xl bg-red-500/5 border border-red-500/15 mb-3">
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block mb-1">
                    Biggest Weakness
                  </span>
                  <p className="text-xs text-fg leading-snug">{r.biggestWeakness}</p>
                </div>

                {/* Recommended Fix */}
                <div className="p-3.5 rounded-xl bg-accent/5 border border-accent/20">
                  <span className="text-[10px] font-bold text-accent-light uppercase tracking-wider block mb-1">
                    Highest-Leverage Fix
                  </span>
                  <p className="text-xs text-fg leading-snug">{r.recommendedFix}</p>
                </div>
              </div>

              {/* 1-Click Action */}
              <div className="mt-5 pt-3 border-t border-border flex items-center justify-between">
                <span className="text-[11px] text-muted">Estimated Lift: +4.2 Max Points</span>
                <button
                  onClick={() => handleTurnFixIntoTask(r.recommendedFix, r.persona)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/20 hover:bg-accent/30 text-accent-light font-semibold text-xs border border-accent/30 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Turn Fix into Task →</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}