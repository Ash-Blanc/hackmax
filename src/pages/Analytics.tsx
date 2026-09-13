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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-fg tracking-tight">Analytics & Trajectory</h1>
            <span className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent-light text-[11px] font-mono font-semibold">
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
        <div className="glass rounded-2xl p-5 border-border">
          <div className="flex items-center gap-2 text-muted mb-2">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span className="text-[10px] uppercase tracking-wider font-semibold">Live Max Score</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-fg">{liveMaxScore}</span>
            <span className="text-xs text-muted font-mono">/ 100</span>
            <span className="text-xs text-success flex items-center font-mono ml-auto">
              <ArrowUpRight className="w-3.5 h-3.5" /> +16 pts
            </span>
          </div>
          <p className="text-[11px] text-secondary mt-2">Top 15% percentile among active submissions.</p>
        </div>

        <div className="glass rounded-2xl p-5 border-border">
          <div className="flex items-center gap-2 text-muted mb-2">
            <Clock className="w-4 h-4 text-yellow-400" />
            <span className="text-[10px] uppercase tracking-wider font-semibold">Time Remaining</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-yellow-400">
              {Math.round(hoursRemaining)}h
            </span>
            <span className="text-xs text-muted font-mono">left</span>
          </div>
          <p className="text-[11px] text-secondary mt-2">Critical submission window is active.</p>
        </div>

        <div className="glass rounded-2xl p-5 border-border">
          <div className="flex items-center gap-2 text-muted mb-2">
            <Flame className="w-4 h-4 text-red-400" />
            <span className="text-[10px] uppercase tracking-wider font-semibold">High Impact Ratio</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-fg">
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

        <div className="glass rounded-2xl p-5 border-border">
          <div className="flex items-center gap-2 text-muted mb-2">
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
        <div className="lg:col-span-8 glass rounded-2xl p-6 border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-fg">Readiness Trajectory Curve</h3>
              <p className="text-[11px] text-secondary">
                Max Score progression compared to the ideal podium target curve
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1.5 text-accent-light">
                <span className="w-2.5 h-2.5 rounded-full bg-accent" /> Actual Score
              </span>
              <span className="flex items-center gap-1.5 text-muted">
                <span className="w-2.5 h-2.5 rounded-full bg-border" /> Podium Target
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
                <CartesianGrid stroke="#1e2333" strokeDasharray="3 3" />
                <XAxis dataKey="time" stroke="#64748b" textAnchor="end" fontSize={11} />
                <YAxis stroke="#64748b" domain={[0, 100]} fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f111a', borderColor: '#1e2333', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="targetScore" stroke="#475569" strokeDasharray="4 4" fill="none" />
                <Area type="monotone" dataKey="actualScore" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#scoreGlow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Effort vs Impact Distribution */}
        <div className="lg:col-span-4 glass rounded-2xl p-6 border-border flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-fg">Impact vs Effort Matrix</h3>
            <p className="text-[11px] text-secondary mb-4">Task distribution sorted by expected score lift</p>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={impactEffortData}>
                  <CartesianGrid stroke="#1e2333" strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f111a', borderColor: '#1e2333', borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Bar dataKey="tasks" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-elevated/70 border border-border text-[11px] text-secondary">
            💡 Focus 80% of remaining time on <strong>Critical</strong> and <strong>High</strong> tasks.
          </div>
        </div>
      </div>

      {/* Anti-Slop Insights & Criteria Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Anti-Slop Insights Callouts */}
        <div className="lg:col-span-6 glass rounded-2xl p-6 border-border space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <h3 className="font-bold text-sm text-fg">Anti-Slop AI Warnings</h3>
          </div>

          <div className="p-3.5 rounded-xl bg-red-500/5 border border-red-500/15">
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block mb-1">
              Warning: CSS & Micro-Polishing Trap
            </span>
            <p className="text-xs text-secondary leading-relaxed">
              Hackathon participants spend an average of 38% of final hours on CSS tweaks that judges spend 0 seconds reviewing. Prioritize your 2-minute demo video.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-yellow-500/5 border border-yellow-500/15">
            <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider block mb-1">
              The 15-Second Judge Rule
            </span>
            <p className="text-xs text-secondary leading-relaxed">
              Hackathon judges review dozens of projects per track. If your demo video spends more than 20 seconds on slides before showing live software, retention drops 65%.
            </p>
          </div>
        </div>

        {/* Criteria Breakdown */}
        <div className="lg:col-span-6 glass rounded-2xl p-6 border-border">
          <h3 className="font-bold text-sm text-fg mb-1">Criteria Score Distribution</h3>
          <p className="text-[11px] text-secondary mb-4">Estimated score per judging rubric category</p>

          <div className="space-y-3">
            {criteria.map((c) => (
              <div key={c.id}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-fg font-medium">{c.name}</span>
                  <span className="font-mono text-accent-light font-bold">{c.score} / 10</span>
                </div>
                <div className="w-full h-2 bg-border rounded-full overflow-hidden">
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