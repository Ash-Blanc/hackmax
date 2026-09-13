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
  ChevronDown,
  ChevronUp,
  Info,
  ExternalLink,
  Target,
  Sparkles,
  X,
  Scissors,
  TrendingUp,
  Cpu,
  BookOpen,
  Lightbulb,
} from 'lucide-react';
import { CubeLogo } from '@/components/common/CubeLogo';
import { toast } from 'sonner';

export default function Dashboard() {
  const navigate = useNavigate();
  const { state, primaryHackathon, liveMaxScore, nextTask, startTask, completeTask, cutTask } =
    useHackMaxStore();

  const [showScoreDrivers, setShowScoreDrivers] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
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
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="text-center p-8 glass-panel rounded-xl border border-white/[0.06] max-w-sm">
          <div className="w-12 h-12 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center mx-auto mb-3 shadow-[0_0_16px_rgba(59,130,246,0.3)]">
            <CubeLogo className="w-7 h-7" />
          </div>
          <h2 className="text-sm font-semibold text-fg mb-1">No Active Hackathon</h2>
          <p className="text-secondary text-xs mb-5">
            Add or select an active competition to launch your Command Center.
          </p>
          <button
            onClick={() => navigate('/hackathons')}
            className="px-4 py-2 bg-accent hover:bg-accent-bright text-white rounded-lg text-xs font-medium transition-all active:scale-[0.97]"
          >
            Browse Hackathons →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-6xl mx-auto animate-fade-up">
      {/* Top Banner: Command Center Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.05]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-fenix text-fg tracking-normal">Command Center</h1>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-2xs font-mono font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Sprint Status
            </span>
          </div>
          <p className="text-secondary text-xs mt-0.5">
            Prioritizing highest-impact tasks for{' '}
            <span className="text-fg font-medium">{active.title}</span>
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-xs font-medium text-secondary hover:text-fg transition-all active:scale-[0.97]"
          >
            <BookOpen className="w-3.5 h-3.5 text-accent-bright" />
            <span>Survival Guide</span>
            {showGuide ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          <button
            onClick={() => navigate(`/hackathons/${active.id}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-xs font-medium text-secondary hover:text-fg transition-all active:scale-[0.97]"
          >
            <span>Open Workspace</span>
            <ExternalLink className="w-3.5 h-3.5 text-muted" />
          </button>
          <button
            onClick={() => navigate('/judge')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-accent hover:bg-accent-bright text-white text-xs font-medium shadow-ambient transition-all active:scale-[0.97]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Practice Judge</span>
          </button>
        </div>
      </div>

      {/* Beginner Survival Guide (Noob to Podium) */}
      {showGuide && (
        <div className="glass-panel rounded-xl p-4 border border-accent/20 bg-accent/[0.02] shadow-ambient relative animate-fade-up">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/[0.05]">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-accent/15 border border-accent/25 flex items-center justify-center text-accent-bright">
                <Lightbulb className="w-3 h-3" />
              </div>
              <h3 className="font-semibold text-xs text-fg">Hackathon Survival Guide (Noob to Podium)</h3>
              <span className="text-2xs text-ink-faint font-mono hidden sm:inline">• 4 core rules every CS & engineering student should follow</span>
            </div>
            <button
              onClick={() => setShowGuide(false)}
              className="text-2xs text-ink-faint hover:text-fg font-mono transition-colors"
            >
              Hide Guide
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
              <div className="flex items-center gap-1.5 text-accent-bright font-medium text-2xs mb-1 font-mono">
                <span>📹 Rule 1: Video is 80%</span>
              </div>
              <p className="text-2xs text-secondary leading-relaxed">
                Judges have under 2 minutes per project. A working 90-second screen recording beats 10,000 lines of invisible code that crashes.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium text-2xs mb-1 font-mono">
                <span>🎯 Rule 2: Build MVP First</span>
              </div>
              <p className="text-2xs text-secondary leading-relaxed">
                Don't build auth, password resets, or account settings first! Build the ONE magical core feature that solves the problem.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
              <div className="flex items-center gap-1.5 text-amber-400 font-medium text-2xs mb-1 font-mono">
                <span>🚀 Rule 3: Deploy Early</span>
              </div>
              <p className="text-2xs text-secondary leading-relaxed">
                Deploy to Vercel, Railway, or Streamlit 3 hours before the deadline. Avoid the dreaded 11:55 PM build & CORS panic.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
              <div className="flex items-center gap-1.5 text-red-400 font-medium text-2xs mb-1 font-mono">
                <span>✂️ Rule 4: Cut Unfinished Stuff</span>
              </div>
              <p className="text-2xs text-secondary leading-relaxed">
                If you have &lt; 4 hours left, stop starting new features. Drop unfinished tasks with 1 click so judges only see polished, working parts.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main 3-Column Core Telemetry Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Metric 1: Submission Countdown (Linear Odometer Style) */}
        <div
          className={`md:col-span-4 glass-card rounded-xl p-4 flex flex-col justify-between relative overflow-hidden ${
            isUrgent ? 'border-red-500/30' : ''
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xs font-medium text-ink-muted uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Clock className={`w-3.5 h-3.5 ${isUrgent ? 'text-red-400 animate-pulse' : 'text-accent-bright'}`} />
              Time to Submission
            </span>
            <span
              className={`text-2xs px-2 py-0.5 rounded-full font-mono font-medium ${
                isUrgent
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}
            >
              {isUrgent ? 'URGENT' : 'PACED'}
            </span>
          </div>

          <div className="my-2 text-center">
            <div className="flex items-baseline justify-center gap-1.5 font-mono">
              <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.05] min-w-[52px]">
                <span className="text-2xl font-bold text-fg">{days}</span>
                <span className="text-2xs text-ink-faint block uppercase mt-0.5">days</span>
              </div>
              <span className="text-base text-ink-faint">:</span>
              <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.05] min-w-[52px]">
                <span className={`text-2xl font-bold ${isUrgent ? 'text-red-400' : 'text-fg'}`}>
                  {String(hours).padStart(2, '0')}
                </span>
                <span className="text-2xs text-ink-faint block uppercase mt-0.5">hours</span>
              </div>
              <span className="text-base text-ink-faint">:</span>
              <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.05] min-w-[52px]">
                <span className="text-2xl font-bold text-fg">
                  {String(mins).padStart(2, '0')}
                </span>
                <span className="text-2xs text-ink-faint block uppercase mt-0.5">mins</span>
              </div>
              <span className="text-base text-ink-faint">:</span>
              <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.05] min-w-[52px]">
                <span className="text-2xl font-bold text-accent-bright">
                  {String(secs).padStart(2, '0')}
                </span>
                <span className="text-2xs text-ink-faint block uppercase mt-0.5">secs</span>
              </div>
            </div>
            <p className="text-xs text-secondary mt-2.5 truncate">{active.title}</p>
          </div>

          <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center justify-between text-xs mt-2">
            <span className="text-ink-faint font-mono text-2xs">Total Prize Pool</span>
            <span className="font-mono font-semibold text-emerald-400">{active.prizePool}</span>
          </div>
        </div>

        {/* Metric 2: Max Score Readiness Gauge */}
        <div className="md:col-span-4 glass-card rounded-xl p-4 flex flex-col items-center justify-between relative">
          <div className="w-full flex items-center justify-between">
            <span className="text-2xs font-medium text-ink-muted uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-accent-bright" /> Submission Readiness
            </span>
            <button
              onClick={() => setShowScoreDrivers(!showScoreDrivers)}
              className="text-2xs font-mono text-secondary hover:text-fg flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded hover:bg-white/[0.04]"
            >
              <span>Drivers</span>
              <Info className="w-3 h-3" />
            </button>
          </div>

          {/* Radial Gauge with Precision Gradient */}
          <div className="relative w-32 h-32 my-1 flex items-center justify-center">
            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#38d9f5" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="url(#scoreGrad)"
                strokeWidth="6"
                strokeDasharray={264}
                strokeDashoffset={264 - (liveMaxScore / 100) * 264}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-bold font-mono text-fg tracking-tight">
                {liveMaxScore}
              </span>
              <span className="text-2xs text-ink-faint uppercase tracking-wider font-medium font-mono">
                Max Score
              </span>
            </div>
          </div>

          {/* Bottom quick stats */}
          <div className="w-full grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
              <span className="text-ink-faint block text-2xs font-mono">Tasks Done</span>
              <span className="text-fg font-mono font-medium text-xs">
                {doneTasks.length} / {activeTasks.length}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
              <span className="text-ink-faint block text-2xs font-mono">Checklist</span>
              <span className="text-fg font-mono font-medium text-xs">
                {doneChecks.length} / {checklist.length}
              </span>
            </div>
          </div>
        </div>

        {/* Metric 3: Highest-Impact Next Action Spotlight Card */}
        <div className="md:col-span-4 glass-card rounded-xl p-4 flex flex-col justify-between relative border-l-2 border-l-accent">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-2xs font-medium text-accent-bright uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-accent-bright" /> Highest Impact Next
              </span>
              <span className="px-2 py-0.5 rounded-full bg-accent/15 border border-accent/25 text-accent-bright text-2xs font-mono font-medium">
                +6 Pts Lift
              </span>
            </div>

            {nextTask ? (
              <div>
                <h3 className="font-medium text-sm text-fg leading-snug">{nextTask.title}</h3>
                <p className="text-xs text-secondary mt-1.5 leading-relaxed">
                  Directly impacts <span className="text-fg font-medium">Technical Execution</span> and{' '}
                  <span className="text-fg font-medium">Innovation</span>. Completing this yields the highest return.
                </p>

                <div className="flex items-center gap-2 mt-3 text-2xs">
                  <span className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.06] text-secondary font-mono">
                    ~{nextTask.estimatedMinutes}m est.
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 font-medium uppercase font-mono">
                    {nextTask.priority}
                  </span>
                  <span className="text-ink-faint font-mono">Stage: {nextTask.stage}</span>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center">
                <CheckCircle2 className="w-7 h-7 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs font-medium text-fg">All sprint tasks completed!</p>
                <p className="text-2xs text-secondary mt-0.5">Ready for submission review.</p>
              </div>
            )}
          </div>

          {/* Action button */}
          {nextTask && (
            <div className="mt-3 pt-2.5 border-t border-white/[0.05]">
              {nextTask.status === 'in_progress' ? (
                <button
                  onClick={() => {
                    completeTask(nextTask.id);
                    toast.success(`Completed: ${nextTask.title}`);
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-ambient transition-all flex items-center justify-center gap-1.5 active:scale-[0.97]"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark as Completed (+4 Score)</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    startTask(nextTask.id);
                    toast.info(`Started: ${nextTask.title}`);
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-accent hover:bg-accent-bright text-white font-medium text-xs shadow-ambient transition-all flex items-center justify-center gap-1.5 active:scale-[0.97]"
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

      {/* Proactive Contextual "Max Suggests" AX Card (Cursor Composer Inspired) */}
      <div className="p-3.5 rounded-xl glass-panel border border-accent/25 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-ambient">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/25 flex items-center justify-center text-accent shrink-0 mt-0.5">
            <Cpu className="w-4 h-4 text-accent-bright" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-2xs font-semibold text-fg uppercase tracking-wider">
                Max Proactive Intelligence
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <p className="text-xs text-secondary mt-0.5 leading-relaxed">
              {cuttableTasks.length > 0 ? (
                <>
                  Identified <span className="text-fg font-medium">{cuttableTasks.length} non-essential tasks</span> in LATER stage (~105 mins total). Cutting them now preserves critical demo video recording time before deadline pressure hits.
                </>
              ) : (
                <>
                  Submission readiness is at <span className="text-accent-bright font-mono font-medium">{liveMaxScore}/100</span>. Demo video and DevPost narrative are your highest remaining judging leverage points.
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {cuttableTasks.length > 0 && (
            <button
              onClick={() => {
                cuttableTasks.forEach((t) => cutTask(t.id));
                toast.warning(`Cut ${cuttableTasks.length} tasks! Focus shifted to core demo.`);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-medium transition-colors active:scale-[0.97]"
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Trim {cuttableTasks.length} Non-Essentials</span>
            </button>
          )}

          <button
            onClick={() => navigate('/judge')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-fg border border-white/[0.08] text-xs font-medium transition-colors active:scale-[0.97]"
          >
            <TrendingUp className="w-3.5 h-3.5 text-accent-bright" />
            <span>Simulate Judges</span>
          </button>
        </div>
      </div>

      {/* Score Drivers Drawer Popup */}
      {showScoreDrivers && (
        <div className="p-4 rounded-xl glass-elevated border border-white/[0.08] shadow-overlay relative animate-fade-up">
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-bright" />
              <h3 className="font-semibold text-xs text-fg">How Your Max Score is Calculated (0–100)</h3>
            </div>
            <button
              onClick={() => setShowScoreDrivers(false)}
              className="p-1 rounded-md text-secondary hover:text-fg hover:bg-white/[0.04] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
              <div className="flex items-center justify-between text-ink-faint mb-1 font-mono text-2xs">
                <span>1. Judging Criteria</span>
                <span className="text-accent-bright">50% weight</span>
              </div>
              <p className="text-sm font-semibold text-fg font-mono">7.8 / 10</p>
              <p className="text-2xs text-secondary mt-1 leading-snug">
                Scores across Innovation, Technical Complexity, UI/UX, and Pitch clarity.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
              <div className="flex items-center justify-between text-ink-faint mb-1 font-mono text-2xs">
                <span>2. Submission Checklist</span>
                <span className="text-accent-bright">20% weight</span>
              </div>
              <p className="text-sm font-semibold text-fg font-mono">
                {Math.round((doneChecks.length / Math.max(checklist.length, 1)) * 100)}% verified
              </p>
              <p className="text-2xs text-secondary mt-1 leading-snug">
                Essential links: Working demo link, clean GitHub repo, and 2-minute video.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
              <div className="flex items-center justify-between text-ink-faint mb-1 font-mono text-2xs">
                <span>3. Core Task Execution</span>
                <span className="text-accent-bright">20% weight</span>
              </div>
              <p className="text-sm font-semibold text-fg font-mono">
                {Math.round((doneTasks.length / Math.max(activeTasks.length, 1)) * 100)}% done
              </p>
              <p className="text-2xs text-secondary mt-1 leading-snug">
                Completing highest-impact NOW tasks that directly boost judging points.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
              <div className="flex items-center justify-between text-ink-faint mb-1 font-mono text-2xs">
                <span>4. Deadline Buffer</span>
                <span className="text-accent-bright">10% buffer</span>
              </div>
              <p className="text-sm font-semibold text-amber-400 font-mono">0.95x modifier</p>
              <p className="text-2xs text-secondary mt-1 leading-snug">
                Pacing buffer to ensure you finish 2 hours early without burning out.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Active Hackathons Grid */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-muted font-mono">
            Active Competitions ({state.hackathons.length})
          </h2>
          <button
            onClick={() => navigate('/hackathons')}
            className="text-2xs font-medium text-secondary hover:text-fg flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {state.hackathons.map((h) => {
            const diff = Math.max(0, new Date(h.endDate).getTime() - Date.now());
            const dDays = Math.floor(diff / 86400000);
            const dHours = Math.floor((diff % 86400000) / 3600000);
            const isPrimary = h.id === active.id;

            return (
              <div
                key={h.id}
                onClick={() => navigate(`/hackathons/${h.id}`)}
                className={`glass-card rounded-xl p-4 cursor-pointer transition-all border relative group ${
                  isPrimary
                    ? 'border-accent/30 bg-accent/[0.03] hover:border-accent/50'
                    : 'border-white/[0.05] hover:border-white/[0.10]'
                }`}
              >
                <div className="flex items-start justify-between mb-1.5">
                  <div className="flex-1 pr-2">
                    <h3 className="font-medium text-fg text-xs group-hover:text-accent-bright transition-colors truncate">
                      {h.title}
                    </h3>
                    <p className="text-2xs text-secondary mt-0.5 line-clamp-1">{h.tagline}</p>
                  </div>
                  {isPrimary && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-0.5" />
                  )}
                </div>

                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/[0.04] text-xs">
                  <span className="font-mono text-red-400 flex items-center gap-1 text-2xs">
                    <Clock className="w-3 h-3" />
                    {dDays}d {dHours}h left
                  </span>
                  <span className="font-mono text-fg font-medium text-2xs">
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