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
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-fg tracking-tight">Opportunities</h1>
            <span className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent-light text-[11px] font-mono font-semibold">
              Cross-Hackathon DNA
            </span>
          </div>
          <p className="text-secondary text-xs mt-1">
            Discover upcoming hackathons matched against your project's reusable capabilities.
          </p>
        </div>
      </div>

      {/* Project DNA Summary Bar */}
      {project && (
        <div className="glass rounded-2xl p-5 border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Target className="w-4 h-4 text-accent" />
              <h3 className="font-bold text-sm text-fg">Active Project DNA: {project.name}</h3>
            </div>
            <p className="text-xs text-secondary leading-relaxed">
              Matching engine analyzes your tech stack and reusable components to compute code adaptation %:
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {project.capabilities.map((c) => (
                <span
                  key={c}
                  className="px-2.5 py-0.5 rounded-full bg-accent/15 text-accent-light text-[10px] font-medium border border-accent/25"
                >
                  {c}
                </span>
              ))}
              {project.reusableComponents.map((comp) => (
                <span
                  key={comp}
                  className="px-2.5 py-0.5 rounded-full bg-elevated text-secondary text-[10px] font-medium border border-border"
                >
                  📦 {comp}
                </span>
              ))}
            </div>
          </div>

          <div className="text-right shrink-0 bg-elevated/80 p-3.5 rounded-xl border border-border">
            <span className="text-[10px] text-muted block uppercase font-semibold">Average Code Reuse</span>
            <span className="text-2xl font-extrabold font-mono text-success">71%</span>
          </div>
        </div>
      )}

      {/* Category Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              selectedCategory === cat
                ? 'bg-accent/15 text-accent-light border-accent/40 shadow-sm'
                : 'bg-elevated/80 border-border text-secondary hover:text-fg hover:border-border/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOpps.map((opp) => (
          <div
            key={opp.id}
            className="glass rounded-2xl p-6 border-border hover:border-accent/30 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Card top */}
              <div className="flex items-start justify-between mb-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-elevated border border-border text-muted font-medium">
                  {opp.category}
                </span>
                <span className="text-xs font-bold font-mono text-success">
                  {opp.matchScore}% Match
                </span>
              </div>

              <h3 className="text-base font-bold text-fg mt-1">{opp.name}</h3>
              <p className="text-xs text-secondary mt-1.5 leading-relaxed">{opp.tagline}</p>

              {/* Progress Bar for Reuse % */}
              <div className="mt-4 pt-3 border-t border-border/60">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted">Estimated Code Reuse</span>
                  <span className="font-bold font-mono text-accent-light">{opp.reusePercent}%</span>
                </div>
                <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-500"
                    style={{ width: `${opp.reusePercent}%` }}
                  />
                </div>
              </div>

              {/* Deadline & Prize */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-elevated border border-border">
                  <span className="text-muted block text-[10px]">Deadline</span>
                  <strong className="text-fg font-mono">{opp.daysRemaining} days left</strong>
                </div>
                <div className="p-2 rounded-lg bg-elevated border border-border">
                  <span className="text-muted block text-[10px]">Prize</span>
                  <strong className="text-fg font-mono">{opp.prize}</strong>
                </div>
              </div>
            </div>

            {/* Adapt Button */}
            <div className="mt-5 pt-3 border-t border-border">
              <button
                onClick={() => setAdaptingOpp(opp)}
                className="w-full py-2.5 px-4 rounded-xl bg-accent/20 hover:bg-accent/30 border border-accent/30 text-accent-light font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Adapt My Project DNA →</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Adapt Project Modal */}
      {adaptingOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <h3 className="font-bold text-fg text-sm">Adapt Project DNA</h3>
              </div>
              <button
                onClick={() => setAdaptingOpp(null)}
                className="p-1 rounded text-secondary hover:text-fg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-fg text-base">{adaptingOpp.name}</h4>
                <p className="text-secondary mt-0.5">{adaptingOpp.tagline}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-elevated border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted">Target Adaptation Reuse</span>
                  <span className="font-bold font-mono text-success text-sm">
                    {adaptingOpp.reusePercent}% Reuse
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Estimated Adaptation Time</span>
                  <span className="font-mono text-fg font-semibold">~4.5 Hours</span>
                </div>
              </div>

              <div>
                <span className="text-muted block mb-1.5 font-semibold uppercase text-[10px]">
                  Reusable Scaffolding from {project?.name}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {adaptingOpp.reusableComponents.map((c) => (
                    <span
                      key={c}
                      className="px-2.5 py-1 rounded-lg bg-accent/15 text-accent-light border border-accent/25 text-[11px]"
                    >
                      ✓ {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface border border-border text-secondary text-[11px] leading-relaxed">
                Clicking <strong>Import Hackathon</strong> creates a customized workspace with time-sliced tasks to bridge the remaining {100 - adaptingOpp.reusePercent}% domain gap.
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-border">
                <button
                  onClick={() => setAdaptingOpp(null)}
                  className="px-4 py-2 rounded-lg bg-elevated text-secondary hover:text-fg font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleImportToHackathons(adaptingOpp)}
                  className="px-5 py-2 rounded-lg bg-accent text-white font-bold hover:bg-accent-bright shadow-glow flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Import to My Hackathons</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}