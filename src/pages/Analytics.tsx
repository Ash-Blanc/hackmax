import { useHackMaxStore } from '@/lib/store';
import {
  TrendingUp,
  Clock,
  ShieldAlert,
  Flame,
  ArrowUpRight,
  Lightbulb,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts';

export default function Analytics() {
  const { state, primaryHackathon, liveMaxScore, hoursRemaining } = useHackMaxStore();
  const active = primaryHackathon ?? state.hackathons[0];

  const activeTasks = state.tasks.filter((t) => t.hackathonId === active?.id);
  const totalMinutes = activeTasks.reduce((s, t) => s + t.estimatedMinutes, 0);
  const lowImpactTasks = activeTasks.filter((t) => t.impactLevel === 'LOW' || t.impactLevel === 'MEDIUM');
  const antiSlopRatio = totalMinutes > 0 ? Math.round((lowImpactTasks.length / activeTasks.length) * 100) : 0;

  // Trajectory mock data
  const trajectoryData = [
    { time: 'Day 1', actualScore: 42, targetScore: 50 },
    { time: 'Day 2', actualScore: 56, targetScore: 62 },
    { time: 'Day 3', actualScore: 68, targetScore: 72 },
    { time: 'Today', actualScore: liveMaxScore, targetScore: 82 },
    { time: 'Deadline', actualScore: null, targetScore: 92 },
  ];

  // Effort vs Impact breakdown
  const impactEffortData = [
    { name: 'Critical', tasks: activeTasks.filter((t) => t.impactLevel === 'CRITICAL').length, scoreLift: 9 },
    { name: 'High', tasks: activeTasks.filter((t) => t.impactLevel === 'HIGH').length, scoreLift: 5 },
    { name: 'Medium', tasks: activeTasks.filter((t) => t.impactLevel === 'MEDIUM').length, scoreLift: 2 },
    { name: 'Low', tasks: activeTasks.filter((t) => t.impactLevel === 'LOW').length, scoreLift: 1 },
  ];

  const criteria = state.criteria.filter((c) => c.hackathonId === active?.id);

  return (
    <div className="space-y-5 max-w-6xl mx-auto animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.05]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-fenix text-fg tracking-normal">Progress & Score Analytics</h1>
            <span className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent-bright text-2xs font-mono font-medium">
              Readiness Overview
            </span>
          </div>
          <p className="text-secondary text-xs mt-0.5">
            Sprint trajectory, time allocation, and advice to maximize your final score.
          </p>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="glass-panel rounded-xl p-4 border border-white/[0.05]">
          <div className="flex items-center gap-1.5 text-ink-faint mb-1.5 font-mono text-2xs">
            <TrendingUp className="w-3.5 h-3.5 text-accent-bright" />
            <span className="uppercase tracking-wider">Live Max Score</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-fg">{liveMaxScore}</span>
            <span className="text-2xs text-ink-faint font-mono">/ 100</span>
            <span className="text-2xs text-emerald-400 flex items-center font-mono ml-auto font-medium">
              <ArrowUpRight className="w-3 h-3" /> +16 pts
            </span>
          </div>
          <p className="text-2xs text-secondary mt-1">Estimated judging readiness benchmark.</p>
        </div>

        <div className="glass-panel rounded-xl p-4 border border-white/[0.05]">
          <div className="flex items-center gap-1.5 text-ink-faint mb-1.5 font-mono text-2xs">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="uppercase tracking-wider">Time Remaining</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-amber-400">
              {Math.round(hoursRemaining)}h
            </span>
            <span className="text-2xs text-ink-faint font-mono">left</span>
          </div>
          <p className="text-2xs text-secondary mt-1">Aim to finish code 2 hours before deadline.</p>
        </div>

        <div className="glass-panel rounded-xl p-4 border border-white/[0.05]">
          <div className="flex items-center gap-1.5 text-ink-faint mb-1.5 font-mono text-2xs">
            <Flame className="w-3.5 h-3.5 text-red-400" />
            <span className="uppercase tracking-wider">High Impact Focus</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-fg">
              {Math.round(
                (activeTasks.filter((t) => t.impactLevel === 'CRITICAL' || t.impactLevel === 'HIGH').length /
                  Math.max(activeTasks.length, 1)) *
                  100
              )}
              %
            </span>
          </div>
          <p className="text-2xs text-secondary mt-1">Effort on core features judges evaluate.</p>
        </div>

        <div className="glass-panel rounded-xl p-4 border border-white/[0.05]">
          <div className="flex items-center gap-1.5 text-ink-faint mb-1.5 font-mono text-2xs">
            <ShieldAlert className="w-3.5 h-3.5 text-accent-bright" />
            <span className="uppercase tracking-wider">Scope Buffer (Cuttable)</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-accent-bright">{antiSlopRatio}%</span>
            <span className="text-2xs text-ink-faint font-mono">optional</span>
          </div>
          <p className="text-2xs text-secondary mt-1">Tasks you can drop to save time.</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Trajectory Area Chart */}
        <div className="lg:col-span-8 glass-panel rounded-xl p-5 border border-white/[0.05]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-xs text-fg">Readiness Trajectory Curve</h3>
              <p className="text-2xs text-secondary">
                Max Score progression compared to ideal podium target curve
              </p>
            </div>
            <div className="flex items-center gap-2.5 text-2xs font-mono">
              <span className="flex items-center gap-1 text-accent-bright">
                <span className="w-2 h-2 rounded-full bg-accent" /> Actual
              </span>
              <span className="flex items-center gap-1 text-ink-faint">
                <span className="w-2 h-2 rounded-full bg-white/20" /> Target
              </span>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trajectoryData}>
                <defs>
                  <linearGradient id="scoreGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#38d9f5" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" domain={[0, 100]} fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#131622', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '11px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="targetScore" stroke="#475569" strokeDasharray="4 4" fill="none" />
                <Area type="monotone" dataKey="actualScore" stroke="#60a5fa" strokeWidth={2} fillOpacity={1} fill="url(#scoreGlow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Effort vs Impact Distribution */}
        <div className="lg:col-span-4 glass-panel rounded-xl p-5 border border-white/[0.05] flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-xs text-fg">Impact vs Effort Matrix</h3>
            <p className="text-2xs text-secondary mb-3">Task count sorted by score lift tier</p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={impactEffortData}>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#131622', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '11px', color: '#fff' }}
                  />
                  <Bar dataKey="tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-2xs text-secondary mt-2">
            💡 Focus 80% of remaining time on <span className="text-fg font-medium">Critical</span> and <span className="text-fg font-medium">High</span> tasks.
          </div>
        </div>
      </div>

      {/* Hackathon Insights & Criteria Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Hackathon Tips & Time Traps */}
        <div className="lg:col-span-6 glass-panel rounded-xl p-5 border border-white/[0.05] space-y-2.5">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <h3 className="font-semibold text-xs text-fg">Hackathon Golden Rules & Time Traps</h3>
          </div>

          <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/15">
            <span className="text-2xs font-medium text-red-400 uppercase tracking-wider font-mono block mb-0.5">
              Time Trap: CSS & Button Tweaking
            </span>
            <p className="text-2xs text-secondary leading-relaxed">
              Hackathon teams lose points spending 4+ hours on CSS shadows while the core API crashes. Judges test functionality and concept first.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/15">
            <span className="text-2xs font-medium text-amber-400 uppercase tracking-wider font-mono block mb-0.5">
              Pitch Rule: The 15-Second Software Hook
            </span>
            <p className="text-2xs text-secondary leading-relaxed">
              Judges watch dozens of submissions. Show your working software in the first 15 seconds of your demo video before talking about architecture.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
            <span className="text-2xs font-medium text-emerald-400 uppercase tracking-wider font-mono block mb-0.5">
              Pro-Tip: Working Deployed Demo &gt; Localhost
            </span>
            <p className="text-2xs text-secondary leading-relaxed">
              Judges will not clone your repo or troubleshoot node modules. A live link (Vercel, Railway, Streamlit) gives your team instant credibility.
            </p>
          </div>
        </div>

        {/* Criteria Breakdown */}
        <div className="lg:col-span-6 glass-panel rounded-xl p-5 border border-white/[0.05]">
          <h3 className="font-semibold text-xs text-fg mb-0.5">Criteria Score Distribution</h3>
          <p className="text-2xs text-secondary mb-3">Estimated score per judging rubric category</p>

          <div className="space-y-2.5">
            {criteria.map((c) => (
              <div key={c.id}>
                <div className="flex items-center justify-between text-2xs mb-1 font-mono">
                  <span className="text-fg font-medium">{c.name}</span>
                  <span className="text-accent-bright font-medium">{c.score} / 10</span>
                </div>
                <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-500"
                    style={{ width: `${c.score * 10}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}