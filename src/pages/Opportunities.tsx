import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHackMaxStore } from '@/lib/store';
import { MOCK_OPPORTUNITIES, type OpportunityItem } from '@/lib/mock-data';
import {
  Target,
  Sparkles,
  CheckCircle2,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { hoursFromNow } from '@/lib/time';
import type { Hackathon, Task, ChecklistItem } from '@/types';

export default function Opportunities() {
  const navigate = useNavigate();
  const { state, dispatch } = useHackMaxStore();
  const project = state.projects[0];

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [adaptingOpp, setAdaptingOpp] = useState<OpportunityItem | null>(null);

  const categories = ['All', 'Autonomous Agents', 'Developer Tools', 'Climate & Data', 'Open Source'];

  const filteredOpps =
    selectedCategory === 'All'
      ? MOCK_OPPORTUNITIES
      : MOCK_OPPORTUNITIES.filter((o) => o.category === selectedCategory);

  const handleImportToHackathons = (opp: OpportunityItem) => {
    const newHackathon: Hackathon = {
      id: `hack-${Date.now()}`,
      userId: state.profile.id,
      title: opp.name,
      url: `https://devpost.com/software/${opp.id}`,
      tagline: opp.tagline,
      description: `Targeting ${opp.category} with ${opp.reusePercent}% codebase reuse.`,
      startDate: new Date().toISOString(),
      endDate: hoursFromNow(opp.daysRemaining * 24),
      timezone: 'UTC',
      status: 'upcoming',
      prizePool: opp.prize,
      maxScore: Math.round(opp.matchScore * 0.8),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const initialTasks: Task[] = [
      {
        id: `task-adapt-1-${Date.now()}`,
        hackathonId: newHackathon.id,
        title: `Port Project DNA (${opp.reusableComponents.join(', ')})`,
        stage: 'NOW',
        priority: 'CRITICAL',
        estimatedMinutes: 60,
        impactLevel: 'CRITICAL',
        status: 'todo',
        sortOrder: 0,
        createdAt: new Date().toISOString(),
      },
      {
        id: `task-adapt-2-${Date.now()}`,
        hackathonId: newHackathon.id,
        title: `Implement domain specific challenge criteria for ${opp.category}`,
        stage: 'NEXT',
        priority: 'HIGH',
        estimatedMinutes: 90,
        impactLevel: 'HIGH',
        status: 'todo',
        sortOrder: 1,
        createdAt: new Date().toISOString(),
      },
    ];

    const initialChecklist: ChecklistItem[] = [
      { id: `c1-${Date.now()}`, hackathonId: newHackathon.id, itemKey: 'demo', label: 'Working Demo URL', completed: false, value: null, required: true, createdAt: new Date().toISOString() },
      { id: `c2-${Date.now()}`, hackathonId: newHackathon.id, itemKey: 'repo', label: 'GitHub Repository', completed: true, value: project?.repositoryUrl || null, required: true, createdAt: new Date().toISOString() },
      { id: `c3-${Date.now()}`, hackathonId: newHackathon.id, itemKey: 'video', label: '2-Minute Walkthrough Video', completed: false, value: null, required: true, createdAt: new Date().toISOString() },
    ];

    dispatch({
      type: 'add_hackathon',
      hackathon: newHackathon,
      tasks: initialTasks,
      checklist: initialChecklist,
    });

    toast.success(`Imported "${opp.name}" into your Hackathons!`);
    setAdaptingOpp(null);
    navigate(`/hackathons/${newHackathon.id}`);
  };

  return (
    <div className="space-y-5 max-w-6xl mx-auto animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.05]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg font-semibold text-fg tracking-snug">Opportunities</h1>
            <span className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent-bright text-2xs font-mono font-medium">
              Cross-Hackathon DNA
            </span>
          </div>
          <p className="text-secondary text-xs mt-0.5">
            Discover upcoming hackathons matched against your project's reusable capabilities.
          </p>
        </div>
      </div>

      {/* Project DNA Summary Bar */}
      {project && (
        <div className="glass-panel rounded-xl p-4 border border-white/[0.05] flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-ambient">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Target className="w-3.5 h-3.5 text-accent-bright" />
              <h3 className="font-semibold text-xs text-fg">Active DNA: {project.name}</h3>
            </div>
            <p className="text-2xs text-secondary leading-relaxed">
              Matching engine analyzes your tech stack and reusable components to compute code adaptation %:
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {project.capabilities.map((c) => (
                <span
                  key={c}
                  className="px-2 py-0.5 rounded-md bg-accent/10 text-accent-bright text-2xs font-mono font-medium border border-accent/20"
                >
                  {c}
                </span>
              ))}
              {project.reusableComponents.map((comp) => (
                <span
                  key={comp}
                  className="px-2 py-0.5 rounded-md bg-white/[0.03] text-secondary text-2xs font-mono border border-white/[0.06]"
                >
                  📦 {comp}
                </span>
              ))}
            </div>
          </div>

          <div className="text-right shrink-0 bg-white/[0.02] p-3 rounded-lg border border-white/[0.05]">
            <span className="text-2xs text-ink-faint block uppercase font-mono">Average Code Reuse</span>
            <span className="text-xl font-bold font-mono text-emerald-400">71%</span>
          </div>
        </div>
      )}

      {/* Category Filter Chips */}
      <div className="flex flex-wrap items-center gap-1.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all active:scale-[0.97] ${
              selectedCategory === cat
                ? 'bg-white/[0.08] text-fg border-white/[0.14]'
                : 'bg-white/[0.02] border-white/[0.05] text-ink-muted hover:text-fg hover:bg-white/[0.04]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOpps.map((opp) => (
          <div
            key={opp.id}
            className="glass-panel rounded-xl p-5 border border-white/[0.05] hover:border-white/[0.10] transition-colors flex flex-col justify-between group shadow-ambient"
          >
            <div>
              {/* Card top */}
              <div className="flex items-start justify-between mb-1.5">
                <span className="text-2xs px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.06] text-ink-faint font-mono">
                  {opp.category}
                </span>
                <span className="text-2xs font-semibold font-mono text-emerald-400">
                  {opp.matchScore}% Match
                </span>
              </div>

              <h3 className="text-xs font-semibold text-fg mt-1 group-hover:text-accent-bright transition-colors">
                {opp.name}
              </h3>
              <p className="text-2xs text-secondary mt-1 leading-relaxed">{opp.tagline}</p>

              {/* Progress Bar for Reuse % */}
              <div className="mt-3 pt-2.5 border-t border-white/[0.04]">
                <div className="flex items-center justify-between text-2xs mb-1 font-mono">
                  <span className="text-ink-faint">Code Reuse</span>
                  <span className="font-semibold text-accent-bright">{opp.reusePercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-500"
                    style={{ width: `${opp.reusePercent}%` }}
                  />
                </div>
              </div>

              {/* Deadline & Prize */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-2xs font-mono">
                <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-ink-faint block">Deadline</span>
                  <strong className="text-red-400">{opp.daysRemaining}d left</strong>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-ink-faint block">Prize</span>
                  <strong className="text-emerald-400">{opp.prize}</strong>
                </div>
              </div>
            </div>

            {/* Adapt Button */}
            <div className="mt-4 pt-2.5 border-t border-white/[0.04]">
              <button
                onClick={() => setAdaptingOpp(opp)}
                className="w-full py-2 px-3 rounded-lg bg-accent hover:bg-accent-bright text-white font-medium text-xs shadow-ambient transition-all flex items-center justify-center gap-1.5 active:scale-[0.97]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Adapt Project DNA →</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Adapt Project Modal */}
      {adaptingOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-up">
          <div className="glass-elevated border border-white/[0.08] rounded-xl p-5 w-full max-w-md shadow-overlay">
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent-bright" />
                <h3 className="font-semibold text-fg text-xs">Adapt Project DNA</h3>
              </div>
              <button
                onClick={() => setAdaptingOpp(null)}
                className="p-1 rounded-md text-secondary hover:text-fg hover:bg-white/[0.04] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <h4 className="font-medium text-fg text-sm">{adaptingOpp.name}</h4>
                <p className="text-secondary text-2xs mt-0.5">{adaptingOpp.tagline}</p>
              </div>

              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05] space-y-1.5 font-mono text-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-ink-faint">Target Adaptation Reuse</span>
                  <span className="font-bold text-emerald-400">
                    {adaptingOpp.reusePercent}% Reuse
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ink-faint">Estimated Time</span>
                  <span className="text-fg font-medium">~4.5 Hours</span>
                </div>
              </div>

              <div>
                <span className="text-ink-faint block mb-1.5 font-mono uppercase text-2xs">
                  Reusable Scaffolding from {project?.name}
                </span>
                <div className="flex flex-wrap gap-1">
                  {adaptingOpp.reusableComponents.map((c) => (
                    <span
                      key={c}
                      className="px-2 py-0.5 rounded-md bg-accent/10 text-accent-bright border border-accent/20 text-2xs font-mono"
                    >
                      ✓ {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-secondary text-2xs leading-relaxed">
                Clicking <strong>Import Hackathon</strong> creates a tailored workspace with sprint tasks to bridge the remaining {100 - adaptingOpp.reusePercent}% domain gap.
              </div>

              <div className="pt-2.5 flex justify-end gap-2 border-t border-white/[0.06]">
                <button
                  onClick={() => setAdaptingOpp(null)}
                  className="px-3.5 py-1.5 rounded-lg bg-white/[0.03] text-secondary hover:text-fg font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleImportToHackathons(adaptingOpp)}
                  className="px-4 py-1.5 rounded-lg bg-accent hover:bg-accent-bright text-white font-medium shadow-ambient flex items-center gap-1.5 active:scale-[0.97]"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Import to Hackathons</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}