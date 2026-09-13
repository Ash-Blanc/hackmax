import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHackMaxStore } from '@/lib/store';
import {
  Clock,
  Plus,
  X,
  FlaskConical,
} from 'lucide-react';
import { toast } from 'sonner';
import { hoursFromNow } from '@/lib/time';
import type { Hackathon, Task, ChecklistItem } from '@/types';

export default function Hackathons() {
  const navigate = useNavigate();
  const { state, dispatch } = useHackMaxStore();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [prize, setPrize] = useState('$50,000');
  const [days, setDays] = useState(3);

  const handleCreateHackathon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newHack: Hackathon = {
      id: `hack-${Date.now()}`,
      userId: state.profile.id,
      title: title.trim(),
      url: 'https://devpost.com',
      tagline: tagline.trim() || 'Exciting hackathon challenge',
      description: 'Maximize submission quality and deliver winning prototype.',
      startDate: new Date().toISOString(),
      endDate: hoursFromNow(days * 24),
      timezone: 'UTC',
      status: 'active',
      prizePool: prize.trim() || '$25,000',
      maxScore: 60,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const initialTasks: Task[] = [
      {
        id: `task-${Date.now()}-1`,
        hackathonId: newHack.id,
        title: 'Initial Architecture Scaffolding & Setup',
        stage: 'NOW',
        priority: 'CRITICAL',
        estimatedMinutes: 60,
        impactLevel: 'HIGH',
        status: 'todo',
        sortOrder: 0,
        createdAt: new Date().toISOString(),
      },
    ];

    const initialChecklist: ChecklistItem[] = [
      { id: `check-${Date.now()}-1`, hackathonId: newHack.id, itemKey: 'demo', label: 'Working Demo URL', completed: false, value: null, required: true, createdAt: new Date().toISOString() },
      { id: `check-${Date.now()}-2`, hackathonId: newHack.id, itemKey: 'repo', label: 'Public GitHub Repository', completed: false, value: null, required: true, createdAt: new Date().toISOString() },
    ];

    dispatch({
      type: 'add_hackathon',
      hackathon: newHack,
      tasks: initialTasks,
      checklist: initialChecklist,
    });

    toast.success(`Created hackathon: ${newHack.title}`);
    setIsAddOpen(false);
    navigate(`/hackathons/${newHack.id}`);
  };

  return (
    <div className="space-y-5 max-w-6xl mx-auto animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.05]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg font-semibold text-fg tracking-snug">My Hackathons</h1>
            <span className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent-bright text-2xs font-mono font-medium">
              {state.hackathons.length} Active Sprints
            </span>
          </div>
          <p className="text-secondary text-xs mt-0.5">
            Track and maximize all active and past hackathon workspaces.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent hover:bg-accent-bright text-white text-xs font-medium shadow-ambient transition-all active:scale-[0.97]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Hackathon</span>
        </button>
      </div>

      {/* Hackathons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {state.hackathons.map((h) => {
          const diff = Math.max(0, new Date(h.endDate).getTime() - Date.now());
          const dDays = Math.floor(diff / 86400000);
          const dHours = Math.floor((diff % 86400000) / 3600000);

          return (
            <div
              key={h.id}
              onClick={() => navigate(`/hackathons/${h.id}`)}
              className="glass-panel rounded-xl p-5 border border-white/[0.05] hover:border-white/[0.10] transition-colors cursor-pointer flex flex-col justify-between group shadow-ambient"
            >
              <div>
                <div className="flex items-start justify-between mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent-bright">
                      <FlaskConical className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-fg text-xs group-hover:text-accent-bright transition-colors">
                        {h.title}
                      </h3>
                      <p className="text-2xs text-secondary mt-0.5">{h.tagline}</p>
                    </div>
                  </div>
                  <span
                    className={`text-2xs px-2 py-0.5 rounded-full font-mono uppercase ${
                      h.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-white/[0.02] text-ink-faint border border-white/[0.05]'
                    }`}
                  >
                    ● {h.status}
                  </span>
                </div>
                <p className="text-xs text-secondary leading-relaxed line-clamp-2 mt-1.5">{h.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-2xs font-mono">
                <div className="flex items-center gap-3">
                  <span className="text-red-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {dDays}d {dHours}h left
                  </span>
                  <span className="text-ink-faint">
                    Prize: <span className="text-fg font-medium">{h.prizePool}</span>
                  </span>
                </div>

                <span className="text-fg font-medium">
                  Max Score: <span className="text-accent-bright">{h.maxScore}</span>/100
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Hackathon Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-up">
          <div className="glass-elevated border border-white/[0.08] rounded-xl p-5 w-full max-w-md shadow-overlay">
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-white/[0.06]">
              <h3 className="font-semibold text-fg text-xs">Add New Hackathon</h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1 rounded-md text-secondary hover:text-fg hover:bg-white/[0.04] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleCreateHackathon} className="space-y-3 text-xs">
              <div>
                <label className="block text-secondary mb-1 text-2xs font-medium">Hackathon Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AI Frontier Hackathon"
                  required
                  className="w-full py-2 px-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-fg focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-secondary mb-1 text-2xs font-medium">Tagline / Mission</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Building next-generation agent tools"
                  className="w-full py-2 px-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-fg focus:outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-secondary mb-1 text-2xs font-medium">Prize Pool</label>
                  <input
                    type="text"
                    value={prize}
                    onChange={(e) => setPrize(e.target.value)}
                    placeholder="$50,000"
                    className="w-full py-2 px-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-fg focus:outline-none focus:border-accent font-mono"
                  />
                </div>
                <div>
                  <label className="block text-secondary mb-1 text-2xs font-medium">Days to Deadline</label>
                  <input
                    type="number"
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    min={1}
                    max={60}
                    className="w-full py-2 px-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-fg focus:outline-none focus:border-accent font-mono"
                  />
                </div>
              </div>

              <div className="pt-2.5 flex justify-end gap-2 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-white/[0.03] text-secondary hover:text-fg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-accent hover:bg-accent-bright text-white font-medium shadow-ambient transition-all active:scale-[0.97]"
                >
                  Add & Launch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}