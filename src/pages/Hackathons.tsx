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
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">My Hackathons</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-accent/15 border border-accent/30 text-accent-bright text-[11px] font-mono font-semibold">
              {state.hackathons.length} Active Sprints
            </span>
          </div>
          <p className="text-secondary text-xs mt-1">
            Track and maximize all active and past hackathon workspaces.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent to-indigo-600 text-white text-xs font-semibold hover:from-accent-bright hover:to-indigo-500 shadow-glow transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Hackathon</span>
        </button>
      </div>

      {/* Hackathons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {state.hackathons.map((h) => {
          const diff = Math.max(0, new Date(h.endDate).getTime() - Date.now());
          const dDays = Math.floor(diff / 86400000);
          const dHours = Math.floor((diff % 86400000) / 3600000);

          return (
            <div
              key={h.id}
              onClick={() => navigate(`/hackathons/${h.id}`)}
              className="glass-panel rounded-2xl p-6 border border-white/[0.06] chamfer-top hover:border-white/[0.15] transition-all cursor-pointer flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent to-indigo-500 p-0.5 shadow-glow flex items-center justify-center group-hover:scale-105 transition-transform">
                      <div className="w-full h-full bg-[#0d0f17] rounded-[10px] flex items-center justify-center">
                        <FlaskConical className="w-5 h-5 text-accent" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base group-hover:text-accent-light transition-colors">
                        {h.title}
                      </h3>
                      <p className="text-xs text-secondary mt-0.5">{h.tagline}</p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-semibold uppercase ${
                      h.status === 'active'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-white/[0.04] text-muted border border-white/[0.06]'
                    }`}
                  >
                    ● {h.status}
                  </span>
                </div>
                <p className="text-xs text-muted leading-relaxed line-clamp-2 mt-2">{h.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-4">
                  <span className="text-red-400 flex items-center gap-1.5 text-[11px]">
                    <Clock className="w-3.5 h-3.5" /> {dDays}d {dHours}h left
                  </span>
                  <span className="text-muted text-[11px]">
                    Prize: <strong className="text-white">{h.prizePool}</strong>
                  </span>
                </div>

                <span className="text-white font-bold text-xs">
                  Max Score: <span className="text-accent-bright">{h.maxScore}</span>/100
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Hackathon Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="glass-elevated border border-white/[0.12] rounded-2xl p-6 w-full max-w-md shadow-2xl chamfer-top animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.08]">
              <h3 className="font-extrabold text-white text-sm">Add New Hackathon</h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1 rounded-lg text-secondary hover:text-white hover:bg-white/[0.06]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateHackathon} className="space-y-4 text-xs">
              <div>
                <label className="block text-secondary mb-1.5 font-medium">Hackathon Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AI Frontier Hackathon"
                  required
                  className="w-full py-2.5 px-3 rounded-xl bg-[#131622] border border-white/[0.08] text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-secondary mb-1.5 font-medium">Tagline / Mission</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Building next-generation agent tools"
                  className="w-full py-2.5 px-3 rounded-xl bg-[#131622] border border-white/[0.08] text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-secondary mb-1.5 font-medium">Prize Pool</label>
                  <input
                    type="text"
                    value={prize}
                    onChange={(e) => setPrize(e.target.value)}
                    placeholder="$50,000"
                    className="w-full py-2.5 px-3 rounded-xl bg-[#131622] border border-white/[0.08] text-white focus:outline-none focus:border-accent font-mono"
                  />
                </div>
                <div>
                  <label className="block text-secondary mb-1.5 font-medium">Days to Deadline</label>
                  <input
                    type="number"
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    min={1}
                    max={60}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#131622] border border-white/[0.08] text-white focus:outline-none focus:border-accent font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2.5 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.04] text-secondary hover:text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-indigo-600 text-white font-bold hover:from-accent-bright hover:to-indigo-500 shadow-glow"
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