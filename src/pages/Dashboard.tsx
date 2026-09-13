import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHackMaxStore } from '@/lib/store';
import {
  Clock,
  Flame,
  ArrowRight,
  CheckCircle2,
  Play,
  Check,
  ChevronRight,
  Info,
  ExternalLink,
  Target,
  Sparkles,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

export default function Dashboard() {
  const navigate = useNavigate();
  const { state, primaryHackathon, liveMaxScore, nextTask, startTask, completeTask } =
    useHackMaxStore();

  const [showScoreDrivers, setShowScoreDrivers] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  // Active hackathon
  const active = primaryHackathon ?? state.hackathons[0];

  // Live ticking countdown
  useEffect(() => {
    if (!active?.endDate) return;

    const calc = () => {
      const diff = Math.max(0, new Date(active.endDate).getTime() - Date.now());
      setSecondsRemaining(Math.floor(diff / 1000));
    };

    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [active?.endDate]);

  const days = Math.floor(secondsRemaining / 86400);
  const hours = Math.floor((secondsRemaining % 86400) / 3600);
  const mins = Math.floor((secondsRemaining % 3600) / 60);
  const secs = secondsRemaining % 60;
  const isUrgent = secondsRemaining < 24 * 3600;

  // Task statistics
  const activeTasks = state.tasks.filter((t) => t.hackathonId === active?.id);
  const doneTasks = activeTasks.filter((t) => t.status === 'done');
  const checklist = state.checklist.filter((c) => c.hackathonId === active?.id);
  const doneChecks = checklist.filter((c) => c.completed);

  if (!active) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8 glass rounded-2xl border border-border">
          <p className="text-xl font-bold text-fg mb-2">No Active Hackathon Found</p>
          <p className="text-secondary text-xs mb-4">Add or select a hackathon to launch your Command Center.</p>
          <button
            onClick={() => navigate('/hackathons')}
            className="px-4 py-2 bg-accent text-white rounded-lg text-xs font-semibold hover:bg-accent-bright"
          >
            Browse Hackathons →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Top Banner: Command Center Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-fg tracking-tight">Command Center</h1>
            <span className="px-2 py-0.5 rounded-full bg-accent/15 border border-accent/30 text-accent-light text-[11px] font-mono font-semibold">
              Live
            </span>
          </div>
          <p className="text-secondary text-xs mt-1">
            Optimizing submission quality per hour remaining for{' '}
            <strong className="text-fg">{active.title}</strong>
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate(`/hackathons/${active.id}`)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-elevated hover:bg-surface border border-border text-xs font-semibold text-fg transition-colors"
          >
            <span>Open Workspace</span>
            <ExternalLink className="w-3.5 h-3.5 text-muted" />
          </button>
          <button
            onClick={() => navigate('/judge')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-accent text-white hover:bg-accent-bright text-xs font-semibold shadow-glow transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Judge Check</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Core Telemetry Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Metric 1: Urgent Deadline Clock */}
        <div
          className={`md:col-span-4 glass rounded-2xl p-6 flex flex-col justify-between border-border hover:border-accent/40 transition-all ${
            isUrgent ? 'border-red-500/30' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-red-400" /> Time to Submission
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                isUrgent ? 'bg-red-500/15 text-red-400 border border-red-500/20 animate-pulse' : 'bg-accent/10 text-accent-light'
              }`}
            >
              {isUrgent ? 'HOT DEADLINE' : 'ON TRACK'}
            </span>
          </div>

          <div className="my-5 text-center">
            <div className="flex items-baseline justify-center gap-2 font-mono">
              <div>
                <span className="text-3xl sm:text-4xl font-extrabold text-red-400">{days}</span>
                <span className="text-[10px] text-muted block uppercase">days</span>
              </div>
              <span className="text-2xl text-red-400/50">:</span>
              <div>
                <span className="text-3xl sm:text-4xl font-extrabold text-red-400">
                  {String(hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-muted block uppercase">hours</span>
              </div>
              <span className="text-2xl text-red-400/50">:</span>
              <div>
                <span className="text-3xl sm:text-4xl font-extrabold text-red-400">
                  {String(mins).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-muted block uppercase">mins</span>
              </div>
              <span className="text-2xl text-red-400/50">:</span>
              <div>
                <span className="text-3xl sm:text-4xl font-extrabold text-red-400">
                  {String(secs).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-muted block uppercase">secs</span>
              </div>
            </div>
            <p className="text-xs text-secondary mt-2 truncate">{active.title}</p>
          </div>

          <div className="p-3 rounded-xl bg-elevated border border-border flex items-center justify-between text-xs">
            <span className="text-muted">Active Prize Pool</span>
            <span className="font-mono font-bold text-fg">{active.prizePool}</span>
          </div>
        </div>

        {/* Metric 2: Max Score Readiness Gauge */}
        <div className="md:col-span-4 glass rounded-2xl p-6 flex flex-col items-center justify-between border-border hover:border-accent/40 transition-all relative">
          <div className="w-full flex items-center justify-between">
            <span className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-accent" /> Submission Readiness
            </span>
            <button
              onClick={() => setShowScoreDrivers(!showScoreDrivers)}
              className="text-[10px] font-semibold text-accent-light hover:underline flex items-center gap-1"
            >
              <span>Score Drivers</span>
              <Info className="w-3 h-3" />
            </button>
          </div>

          {/* Radial Gauge */}
          <div className="relative w-36 h-36 my-2 flex items-center justify-center">
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

          {/* Bottom quick stats */}
          <div className="w-full grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-elevated border border-border">
              <span className="text-muted block text-[10px]">Tasks Done</span>
              <strong className="text-fg font-mono">
                {doneTasks.length} / {activeTasks.length}
              </strong>
            </div>
            <div className="p-2 rounded-lg bg-elevated border border-border">
              <span className="text-muted block text-[10px]">Checklist</span>
              <strong className="text-fg font-mono">
                {doneChecks.length} / {checklist.length}
              </strong>
            </div>
          </div>
        </div>

        {/* Metric 3: Highest-Impact Next Action Card */}
        <div className="md:col-span-4 glass rounded-2xl p-6 flex flex-col justify-between border-border border-l-2 border-l-accent hover:border-accent/40 transition-all">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-accent-light uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-accent" /> Highest Impact Next
              </span>
              <span className="px-2 py-0.5 rounded bg-accent/20 text-accent-bright text-[10px] font-bold">
                +6 Pts Lift
              </span>
            </div>

            {nextTask ? (
              <div className="mt-2">
                <h3 className="font-semibold text-sm text-fg leading-snug">{nextTask.title}</h3>
                <p className="text-xs text-secondary mt-2 leading-relaxed">
                  Directly drives the <strong className="text-fg">Technical Execution</strong> and{' '}
                  <strong className="text-fg">Innovation</strong> criteria. Completing this before cut-off yields highest return per hour.
                </p>

                <div className="flex items-center gap-3 mt-4 text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-elevated border border-border text-secondary font-mono">
                    ~{nextTask.estimatedMinutes}m est.
                  </span>
                  <span className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 font-bold uppercase text-[10px]">
                    {nextTask.priority}
                  </span>
                  <span className="text-muted">Stage: {nextTask.stage}</span>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center">
                <CheckCircle2 className="w-8 h-8 text-success mx-auto mb-2" />
                <p className="text-xs font-semibold text-fg">All current tasks completed!</p>
                <p className="text-[11px] text-secondary mt-1">Ready for submission review.</p>
              </div>
            )}
          </div>

          {/* Action button */}
          {nextTask && (
            <div className="mt-4 pt-3 border-t border-border">
              {nextTask.status === 'in_progress' ? (
                <button
                  onClick={() => {
                    completeTask(nextTask.id);
                    toast.success(`Completed: ${nextTask.title}`);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-success text-white font-bold text-xs hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 shadow-emerald"
                >
                  <Check className="w-4 h-4" />
                  <span>Mark as Completed (+4 Score Lift)</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    startTask(nextTask.id);
                    toast.info(`Started: ${nextTask.title}`);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-accent hover:bg-accent-bright text-white font-bold text-xs shadow-glow transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Start Task Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Score Drivers Modal / Drawer Popup */}
      {showScoreDrivers && (
        <div className="p-5 rounded-2xl bg-elevated border border-accent/30 shadow-2xl relative animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <h3 className="font-bold text-sm text-fg">Transparent Max Score Drivers (0–100)</h3>
            </div>
            <button
              onClick={() => setShowScoreDrivers(false)}
              className="p-1 rounded text-secondary hover:text-fg hover:bg-surface"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-surface border border-border">
              <div className="flex items-center justify-between text-muted mb-1">
                <span>Judging Criteria</span>
                <span className="font-mono text-accent-light">50% weight</span>
              </div>
              <p className="text-sm font-bold text-fg font-mono">7.8 / 10</p>
              <p className="text-[10px] text-secondary mt-1">Weighted average across Innovation, Tech, UX, Impact, Pitch.</p>
            </div>
            <div className="p-3 rounded-xl bg-surface border border-border">
              <div className="flex items-center justify-between text-muted mb-1">
                <span>Submission Checklist</span>
                <span className="font-mono text-accent-light">20% weight</span>
              </div>
              <p className="text-sm font-bold text-fg font-mono">50% complete</p>
              <p className="text-[10px] text-secondary mt-1">Working demo & repo checked. Demo video pending.</p>
            </div>
            <div className="p-3 rounded-xl bg-surface border border-border">
              <div className="flex items-center justify-between text-muted mb-1">
                <span>Execution Plan</span>
                <span className="font-mono text-accent-light">20% weight</span>
              </div>
              <p className="text-sm font-bold text-fg font-mono">
                {Math.round((doneTasks.length / Math.max(activeTasks.length, 1)) * 100)}% done
              </p>
              <p className="text-[10px] text-secondary mt-1">Impact-weighted task completion in NOW / NEXT stages.</p>
            </div>
            <div className="p-3 rounded-xl bg-surface border border-border">
              <div className="flex items-center justify-between text-muted mb-1">
                <span>Time Urgency Factor</span>
                <span className="font-mono text-accent-light">10% buffer</span>
              </div>
              <p className="text-sm font-bold text-yellow-400 font-mono">0.95x modifier</p>
              <p className="text-[10px] text-secondary mt-1">Slight pressure penalty when under 24 hours remaining.</p>
            </div>
          </div>
        </div>
      )}

      {/* Active Hackathons Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-fg">Active Hackathons</h2>
          <button
            onClick={() => navigate('/hackathons')}
            className="text-xs font-semibold text-accent-light hover:underline flex items-center gap-1"
          >
            <span>View All ({state.hackathons.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.hackathons.map((h) => {
            const diff = Math.max(0, new Date(h.endDate).getTime() - Date.now());
            const dDays = Math.floor(diff / 86400000);
            const dHours = Math.floor((diff % 86400000) / 3600000);
            const isPrimary = h.id === active.id;

            return (
              <div
                key={h.id}
                onClick={() => navigate(`/hackathons/${h.id}`)}
                className={`glass rounded-xl p-5 cursor-pointer transition-all border ${
                  isPrimary
                    ? 'border-accent/40 bg-accent/5 hover:border-accent'
                    : 'border-border hover:border-accent/30'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-fg text-sm">{h.title}</h3>
                    <p className="text-xs text-secondary mt-0.5 line-clamp-1">{h.tagline}</p>
                  </div>
                  {isPrimary && (
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse shrink-0 mt-1" />
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/60 text-xs">
                  <span className="font-mono text-red-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {dDays}d {dHours}h left
                  </span>
                  <span className="font-mono text-fg font-bold">
                    Score: <span className="text-accent-light">{h.maxScore}</span>/100
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}