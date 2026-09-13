import { useHackMaxStore } from '@/lib/store';
import {
  TrendingUp,
  Clock,
  ShieldAlert,
  Flame,
  ArrowUpRight,
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
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Analytics & Trajectory</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-accent/15 border border-accent/30 text-accent-bright text-[11px] font-mono font-semibold">
              Readiness Telemetry
            </span>
          </div>
          <p className="text-secondary text-xs mt-1">
            Historical progression, impact vs effort distribution, and anti-slop intelligence.
          </p>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-white/[0.06] chamfer-top shadow-lg">
          <div className="flex items-center gap-2 text-muted mb-2 font-mono">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span className="text-[10px] uppercase tracking-wider font-semibold">Live Max Score</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white">{liveMaxScore}</span>
            <span className="text-xs text-muted font-mono">/ 100</span>
            <span className="text-xs text-emerald-400 flex items-center font-mono ml-auto font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" /> +16 pts
            </span>
          </div>
          <p className="text-[11px] text-secondary mt-2">Top 15% percentile among active submissions.</p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/[0.06] chamfer-top shadow-lg">
          <div className="flex items-center gap-2 text-muted mb-2 font-mono">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] uppercase tracking-wider font-semibold">Time Remaining</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-amber-400">
              {Math.round(hoursRemaining)}h
            </span>
            <span className="text-xs text-muted font-mono">left</span>
          </div>
          <p className="text-[11px] text-secondary mt-2">Critical submission window is active.</p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/[0.06] chamfer-top shadow-lg">
          <div className="flex items-center gap-2 text-muted mb-2 font-mono">
            <Flame className="w-4 h-4 text-red-400" />
            <span className="text-[10px] uppercase tracking-wider font-semibold">High Impact Ratio</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white">
              {Math.round(
                (activeTasks.filter((t) => t.impactLevel === 'CRITICAL' || t.impactLevel === 'HIGH').length /
                  Math.max(activeTasks.length, 1)) *
                  100
              )}
              %
            </span>
          </div>
          <p className="text-[11px] text-secondary mt-2">Majority of effort allocated to judging drivers.</p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/[0.06] chamfer-top shadow-lg">
          <div className="flex items-center gap-2 text-muted mb-2 font-mono">
            <ShieldAlert className="w-4 h-4 text-accent-light" />
            <span className="text-[10px] uppercase tracking-wider font-semibold">Anti-Slop Ratio</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-accent-light">{antiSlopRatio}%</span>
            <span className="text-xs text-muted font-mono">low priority</span>
          </div>
          <p className="text-[11px] text-secondary mt-2">Tasks that should be cut under time pressure.</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Trajectory Area Chart */}
        <div className="lg:col-span-8 glass-panel rounded-2xl p-6 border border-white/[0.06] chamfer-top shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-white">Readiness Trajectory Curve</h3>
              <p className="text-[11px] text-secondary">
                Max Score progression compared to the ideal podium target curve
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1.5 text-accent-bright">
                <span className="w-2.5 h-2.5 rounded-full bg-accent shadow-glow" /> Actual Score
              </span>
              <span className="flex items-center gap-1.5 text-muted">
                <span className="w-2.5 h-2.5 rounded-full bg-white/20" /> Target Curve
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trajectoryData}>
                <defs>
                  <linearGradient id="scoreGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                <XAxis dataKey="time" stroke="#64748b" textAnchor="end" fontSize={11} />
                <YAxis stroke="#64748b" domain={[0, 100]} fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#131622', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="targetScore" stroke="#475569" strokeDasharray="4 4" fill="none" />
                <Area type="monotone" dataKey="actualScore" stroke="#818cf8" strokeWidth={2.5} fillOpacity={1} fill="url(#scoreGlow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Effort vs Impact Distribution */}
        <div className="lg:col-span-4 glass-panel rounded-2xl p-6 border border-white/[0.06] chamfer-top shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-white">Impact vs Effort Matrix</h3>
            <p className="text-[11px] text-secondary mb-4">Task distribution sorted by expected score lift</p>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={impactEffortData}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#131622', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px', color: '#fff' }}
                  />
                  <Bar dataKey="tasks" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-[11px] text-secondary">
            💡 Focus 80% of remaining time on <strong className="text-white">Critical</strong> and <strong className="text-white">High</strong> tasks.
          </div>
        </div>
      </div>

      {/* Anti-Slop Insights & Criteria Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Anti-Slop Insights Callouts */}
        <div className="lg:col-span-6 glass-panel rounded-2xl p-6 border border-white/[0.06] chamfer-top shadow-lg space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <h3 className="font-bold text-sm text-white">Anti-Slop AI Warnings</h3>
          </div>

          <div className="p-3.5 rounded-xl bg-red-500/5 border border-red-500/20">
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider font-mono block mb-1">
              Warning: CSS & Micro-Polishing Trap
            </span>
            <p className="text-xs text-secondary leading-relaxed">
              Hackathon participants spend an average of 38% of final hours on CSS tweaks that judges spend 0 seconds reviewing. Prioritize your 2-minute demo video.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider font-mono block mb-1">
              The 15-Second Judge Rule
            </span>
            <p className="text-xs text-secondary leading-relaxed">
              Hackathon judges review dozens of projects per track. If your demo video spends more than 20 seconds on slides before showing live software, retention drops 65%.
            </p>
          </div>
        </div>

        {/* Criteria Breakdown */}
        <div className="lg:col-span-6 glass-panel rounded-2xl p-6 border border-white/[0.06] chamfer-top shadow-lg">
          <h3 className="font-bold text-sm text-white mb-1">Criteria Score Distribution</h3>
          <p className="text-[11px] text-secondary mb-4">Estimated score per judging rubric category</p>

          <div className="space-y-3">
            {criteria.map((c) => (
              <div key={c.id}>
                <div className="flex items-center justify-between text-xs mb-1 font-mono">
                  <span className="text-white font-medium">{c.name}</span>
                  <span className="text-accent-bright font-bold">{c.score} / 10</span>
                </div>
                <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent to-emerald-400 rounded-full transition-all duration-500"
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