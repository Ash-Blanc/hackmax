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
  Zap,
  Scissors,
  TrendingUp,
  Cpu,
} from 'lucide-react';
import { toast } from 'sonner';

export default function Dashboard() {
  const navigate = useNavigate();
  const { state, primaryHackathon, liveMaxScore, nextTask, startTask, completeTask, cutTask } =
    useHackMaxStore();

  const [showScoreDrivers, setShowScoreDrivers] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  // Active hackathon
  const active = primaryHackathon ?? state.hackathons[0];

  // Live countdown calculation
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

  // Task & criteria statistics
  const activeTasks = state.tasks.filter((t) => t.hackathonId === active?.id);
  const doneTasks = activeTasks.filter((t) => t.status === 'done');
  const checklist = state.checklist.filter((c) => c.hackathonId === active?.id);
  const doneChecks = checklist.filter((c) => c.completed);
  const cuttableTasks = activeTasks.filter(
    (t) => (t.stage === 'LATER' || t.impactLevel === 'LOW') && t.status !== 'done' && t.status !== 'cut'
  );

  if (!active) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8 glass-panel rounded-2xl border border-white/[0.08] chamfer-top max-w-md">
          <Zap className="w-8 h-8 text-accent mx-auto mb-3" />
          <p className="text-lg font-bold text-white mb-2">No Active Hackathon Found</p>
          <p className="text-secondary text-xs mb-5">
            Add or select an active competition to launch your Command Center.
          </p>
          <button
            onClick={() => navigate('/hackathons')}
            className="px-5 py-2.5 bg-accent text-white rounded-xl text-xs font-semibold hover:bg-accent-bright shadow-glow"
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Command Center</h1>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent/15 border border-accent/30 text-accent-light text-[11px] font-mono font-semibold shadow-glow">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Telemetry
            </span>
          </div>
          <p className="text-secondary text-xs mt-1">
            Optimizing submission quality per hour remaining for{' '}
            <strong className="text-white">{active.title}</strong>
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate(`/hackathons/${active.id}`)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card text-xs font-semibold text-white hover:border-white/[0.15] transition-all"
          >
            <span>Open Workspace</span>
            <ExternalLink className="w-3.5 h-3.5 text-muted" />
          </button>
          <button
            onClick={() => navigate('/judge')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-accent to-indigo-600 hover:from-accent-bright hover:to-indigo-500 text-white text-xs font-semibold shadow-glow transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Judge Check</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Core Telemetry Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Metric 1: Submission Countdown (Linear Odometer Style) */}
        <div
          className={`md:col-span-4 glass-card rounded-2xl p-5 flex flex-col justify-between chamfer-top relative overflow-hidden ${
            isUrgent ? 'border-red-500/30' : ''
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider font-mono flex items-center gap-2">
              <Clock className={`w-3.5 h-3.5 ${isUrgent ? 'text-red-400 animate-pulse' : 'text-accent'}`} />
              Time to Submission
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                isUrgent
                  ? 'bg-red-500/15 text-red-400 border border-red-500/30 animate-pulse'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}
            >
              {isUrgent ? 'HOT DEADLINE' : 'PACED'}
            </span>
          </div>

          <div className="my-3 text-center">
            <div className="flex items-baseline justify-center gap-2 font-mono">
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] min-w-[58px]">
                <span className="text-3xl font-extrabold text-white">{days}</span>
                <span className="text-[9px] text-muted block uppercase mt-0.5">days</span>
              </div>
              <span className="text-xl text-white/30 font-bold">:</span>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] min-w-[58px]">
                <span className={`text-3xl font-extrabold ${isUrgent ? 'text-red-400' : 'text-white'}`}>
                  {String(hours).padStart(2, '0')}
                </span>
                <span className="text-[9px] text-muted block uppercase mt-0.5">hours</span>
              </div>
              <span className="text-xl text-white/30 font-bold">:</span>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] min-w-[58px]">
                <span className="text-3xl font-extrabold text-white">
                  {String(mins).padStart(2, '0')}
                </span>
                <span className="text-[9px] text-muted block uppercase mt-0.5">mins</span>
              </div>
              <span className="text-xl text-white/30 font-bold">:</span>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] min-w-[58px]">
                <span className="text-3xl font-extrabold text-accent-light">
                  {String(secs).padStart(2, '0')}
                </span>
                <span className="text-[9px] text-muted block uppercase mt-0.5">secs</span>
              </div>
            </div>
            <p className="text-xs text-secondary mt-3 truncate">{active.title}</p>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs">
            <span className="text-muted font-mono text-[11px]">Total Prize Pool</span>
            <span className="font-mono font-bold text-emerald-400">{active.prizePool}</span>
          </div>
        </div>

        {/* Metric 2: Max Score Readiness Gauge */}
        <div className="md:col-span-4 glass-card rounded-2xl p-5 flex flex-col items-center justify-between chamfer-top relative">
          <div className="w-full flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider font-mono flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-accent" /> Submission Readiness
            </span>
            <button
              onClick={() => setShowScoreDrivers(!showScoreDrivers)}
              className="text-[10px] font-mono text-accent-light hover:text-white flex items-center gap-1 transition-colors px-2 py-0.5 rounded-md hover:bg-white/[0.06]"
            >
              <span>Drivers</span>
              <Info className="w-3 h-3" />
            </button>
          </div>

          {/* Radial Gauge with Luminous Gradient */}
          <div className="relative w-36 h-36 my-2 flex items-center justify-center">
            <svg className="w-36 h-36 -rotate-90" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="url(#scoreGrad)"
                strokeWidth="8"
                strokeDasharray={264}
                strokeDashoffset={264 - (liveMaxScore / 100) * 264}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-extrabold font-mono text-white tracking-tight">
                {liveMaxScore}
              </span>
              <span className="text-[10px] text-muted uppercase tracking-wider font-semibold font-mono -mt-1">
                Max Score
              </span>
            </div>
          </div>

          {/* Bottom quick stats */}
          <div className="w-full grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <span className="text-muted block text-[10px] font-mono">Tasks Done</span>
              <strong className="text-white font-mono">
                {doneTasks.length} / {activeTasks.length}
              </strong>
            </div>
            <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <span className="text-muted block text-[10px] font-mono">Checklist</span>
              <strong className="text-white font-mono">
                {doneChecks.length} / {checklist.length}
              </strong>
            </div>
          </div>
        </div>

        {/* Metric 3: Highest-Impact Next Action Spotlight Card */}
        <div className="md:col-span-4 glass-card rounded-2xl p-5 flex flex-col justify-between chamfer-top border-l-2 border-l-accent relative">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-accent-light uppercase tracking-wider font-mono flex items-center gap-2">
                <Flame className="w-3.5 h-3.5 text-accent" /> Highest Impact Next
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-accent/20 border border-accent/30 text-accent-bright text-[10px] font-mono font-bold">
                +6 Pts Lift
              </span>
            </div>

            {nextTask ? (
              <div className="mt-1">
                <h3 className="font-semibold text-sm text-white leading-snug">{nextTask.title}</h3>
                <p className="text-xs text-secondary mt-2 leading-relaxed">
                  Directly drives the <strong className="text-white">Technical Execution</strong> and{' '}
                  <strong className="text-white">Innovation</strong> criteria. Completing this yields the highest return per hour.
                </p>

                <div className="flex items-center gap-2 mt-4 text-[11px]">
                  <span className="px-2 py-0.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-secondary font-mono">
                    ~{nextTask.estimatedMinutes}m est.
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 font-bold uppercase text-[10px] font-mono">
                    {nextTask.priority}
                  </span>
                  <span className="text-muted font-mono text-[10px]">Stage: {nextTask.stage}</span>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-white">All sprint tasks completed!</p>
                <p className="text-[11px] text-secondary mt-1">Ready for submission review.</p>
              </div>
            )}
          </div>

          {/* Action button */}
          {nextTask && (
            <div className="mt-4 pt-3 border-t border-white/[0.06]">
              {nextTask.status === 'in_progress' ? (
                <button
                  onClick={() => {
                    completeTask(nextTask.id);
                    toast.success(`Completed: ${nextTask.title}`);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-emerald transition-all flex items-center justify-center gap-2"
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
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-accent to-indigo-600 hover:from-accent-bright hover:to-indigo-500 text-white font-bold text-xs shadow-glow transition-all flex items-center justify-center gap-2"
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

      {/* Proactive Contextual "Max Suggests" AX Card */}
      <div className="p-4 rounded-2xl glass-panel border border-accent/30 chamfer-top flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-glow">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shrink-0 mt-0.5">
            <Cpu className="w-5 h-5 text-accent animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                Max Proactive Intelligence
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="text-xs text-secondary mt-1 leading-relaxed">
              {cuttableTasks.length > 0 ? (
                <>
                  Identified <strong className="text-white">{cuttableTasks.length} non-essential tasks</strong> in LATER stage (~105 mins total). Cutting them now preserves critical demo video recording time before deadline pressure hits.
                </>
              ) : (
                <>
                  Submission readiness is at <strong className="text-accent-bright">{liveMaxScore}/100</strong>. Demo video and DevPost narrative are your highest remaining judging leverage points.
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {cuttableTasks.length > 0 && (
            <button
              onClick={() => {
                cuttableTasks.forEach((t) => cutTask(t.id));
                toast.warning(`Cut ${cuttableTasks.length} tasks! Focus shifted to core demo.`);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold transition-colors"
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Trim {cuttableTasks.length} Non-Essentials</span>
            </button>
          )}

          <button
            onClick={() => navigate('/judge')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.1] text-xs font-semibold transition-colors"
          >
            <TrendingUp className="w-3.5 h-3.5 text-accent" />
            <span>Simulate Judges</span>
          </button>
        </div>
      </div>

      {/* Score Drivers Drawer Popup */}
      {showScoreDrivers && (
        <div className="p-5 rounded-2xl glass-elevated border border-accent/40 shadow-2xl relative animate-in fade-in slide-in-from-top-2 duration-150 chamfer-top">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <h3 className="font-bold text-sm text-white">Transparent Max Score Drivers (0–100)</h3>
            </div>
            <button
              onClick={() => setShowScoreDrivers(false)}
              className="p-1 rounded-lg text-secondary hover:text-white hover:bg-white/[0.06]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center justify-between text-muted mb-1 font-mono text-[11px]">
                <span>Judging Criteria</span>
                <span className="text-accent-bright">50% weight</span>
              </div>
              <p className="text-base font-bold text-white font-mono">7.8 / 10</p>
              <p className="text-[10px] text-secondary mt-1 leading-snug">
                Weighted average across Innovation, Tech, UX, Impact, and Pitch.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center justify-between text-muted mb-1 font-mono text-[11px]">
                <span>Checklist Verification</span>
                <span className="text-accent-bright">20% weight</span>
              </div>
              <p className="text-base font-bold text-white font-mono">
                {Math.round((doneChecks.length / Math.max(checklist.length, 1)) * 100)}% verified
              </p>
              <p className="text-[10px] text-secondary mt-1 leading-snug">
                Working demo & repo checked. Video upload pending.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center justify-between text-muted mb-1 font-mono text-[11px]">
                <span>Plan Execution</span>
                <span className="text-accent-bright">20% weight</span>
              </div>
              <p className="text-base font-bold text-white font-mono">
                {Math.round((doneTasks.length / Math.max(activeTasks.length, 1)) * 100)}% done
              </p>
              <p className="text-[10px] text-secondary mt-1 leading-snug">
                Impact-weighted task completion in NOW / NEXT stages.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center justify-between text-muted mb-1 font-mono text-[11px]">
                <span>Urgency Modifier</span>
                <span className="text-accent-bright">10% buffer</span>
              </div>
              <p className="text-base font-bold text-amber-400 font-mono">0.95x modifier</p>
              <p className="text-[10px] text-secondary mt-1 leading-snug">
                Paced execution buffer based on remaining competition window.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Active Hackathons Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-extrabold text-white tracking-tight">Active Hackathons</h2>
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
                className={`glass-card rounded-2xl p-5 cursor-pointer transition-all border chamfer-top relative group ${
                  isPrimary
                    ? 'border-accent/40 bg-accent/5 hover:border-accent shadow-glow'
                    : 'border-white/[0.06] hover:border-white/[0.15]'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-white text-sm group-hover:text-accent-light transition-colors">
                      {h.title}
                    </h3>
                    <p className="text-xs text-secondary mt-1 line-clamp-1">{h.tagline}</p>
                  </div>
                  {isPrimary && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0 mt-1" />
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.06] text-xs">
                  <span className="font-mono text-red-400 flex items-center gap-1.5 text-[11px]">
                    <Clock className="w-3.5 h-3.5" />
                    {dDays}d {dHours}h left
                  </span>
                  <span className="font-mono text-white font-bold text-[11px]">
                    Score: <span className="text-accent-bright">{h.maxScore}</span>/100
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