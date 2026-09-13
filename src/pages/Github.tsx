import { useState } from 'react';
import { useHackMaxStore } from '@/lib/store';
import {
  GitCommit,
  GitPullRequest,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { toast } from 'sonner';

export default function GithubView() {
  const { state } = useHackMaxStore();
  const [selectedRepo, setSelectedRepo] = useState('agentic-researcher');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const repos = [
    { name: 'agentic-researcher', defaultBranch: 'main', commits: 48, prs: 14, issues: 2, status: 'passing' },
    { name: 'hackmax-core', defaultBranch: 'main', commits: 32, prs: 8, issues: 1, status: 'passing' },
  ];

  const activity = state.githubActivity;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('GitHub Telemetry refreshed! 0 new untracked commits.');
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Header with Repo Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">GitHub Telemetry</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-semibold">
              ● Connected
            </span>
          </div>
          <p className="text-secondary text-xs mt-1">
            Real-time repository analytics, commit velocity, and AI engineering triage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Repository Selector */}
          <select
            value={selectedRepo}
            onChange={(e) => setSelectedRepo(e.target.value)}
            className="py-2.5 px-3.5 rounded-xl bg-[#131622] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-accent font-mono"
          >
            {repos.map((r) => (
              <option key={r.name} value={r.name}>
                ash-agentic / {r.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleRefresh}
            className="p-2.5 rounded-xl glass-card text-secondary hover:text-white transition-colors"
            title="Refresh GitHub telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-accent' : ''}`} />
          </button>
        </div>
      </div>

      {/* Max Engineering Insight Callout */}
      <div className="p-5 rounded-2xl glass-panel border border-accent/30 chamfer-top flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-glow">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent shrink-0">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-accent-bright uppercase tracking-wider font-mono">
              Max Telemetry Insight
            </h3>
            <p className="text-xs text-white mt-0.5 leading-relaxed">
              Your backend and agent workflows are <strong className="text-emerald-400">90% complete</strong> with high commit velocity. Shift focus now to demo video recording and submission checklist.
            </p>
          </div>
        </div>
        <button
          onClick={() => toast.info('Anti-slop rule enforced: Non-critical code commits blocked.')}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-accent to-indigo-600 hover:from-accent-bright hover:to-indigo-500 text-white text-xs font-bold shadow-glow transition-all shrink-0"
        >
          Acknowledge
        </button>
      </div>

      {/* Telemetry Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-white/[0.06] chamfer-top shadow-lg">
          <div className="flex items-center justify-between text-muted mb-2 font-mono">
            <span className="text-[10px] uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <GitCommit className="w-4 h-4 text-accent" /> Commits
            </span>
            <span className="text-[10px] text-muted">main</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white">48</span>
            <span className="text-xs text-emerald-400 font-mono">+6 today</span>
          </div>
          <p className="text-[11px] text-secondary mt-1">High commit velocity</p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/[0.06] chamfer-top shadow-lg">
          <div className="flex items-center justify-between text-muted mb-2 font-mono">
            <span className="text-[10px] uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <GitPullRequest className="w-4 h-4 text-amber-400" /> Pull Requests
            </span>
            <span className="text-[10px] text-muted">velocity</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white">14</span>
            <span className="text-xs text-muted font-mono">12 merged, 2 open</span>
          </div>
          <p className="text-[11px] text-secondary mt-1">85% PR merge rate</p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/[0.06] chamfer-top shadow-lg">
          <div className="flex items-center justify-between text-muted mb-2 font-mono">
            <span className="text-[10px] uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> CI / Build Health
            </span>
            <span className="text-[10px] text-muted">Actions</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-emerald-400 flex items-center gap-1.5 font-mono">
              <CheckCircle2 className="w-5 h-5" /> Passing
            </span>
          </div>
          <p className="text-[11px] text-secondary mt-1">100% clean TypeScript build</p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/[0.06] chamfer-top shadow-lg">
          <div className="flex items-center justify-between text-muted mb-2 font-mono">
            <span className="text-[10px] uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-accent-light" /> Open Issues
            </span>
            <span className="text-[10px] text-muted">backlog</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white">2</span>
            <span className="text-xs text-muted font-mono">0 critical</span>
          </div>
          <p className="text-[11px] text-secondary mt-1">Zero blocker bugs</p>
        </div>
      </div>

      {/* GitHub Activity Feed */}
      <div className="glass-panel rounded-2xl p-6 border border-white/[0.06] chamfer-top shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-sm text-white">Live GitHub Activity Stream</h3>
            <p className="text-secondary text-xs">Recent commits, pull requests, and automated branch telemetry</p>
          </div>
          <a
            href="https://github.com/ash-agentic/agentic-researcher"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-accent-light hover:underline flex items-center gap-1 font-mono font-medium"
          >
            <span>View on GitHub</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="space-y-2.5">
          {activity.map((a) => {
            const isCommit = a.activityType === 'commit';
            const isPR = a.activityType.startsWith('pr');
            const isIssue = a.activityType.includes('issue');

            return (
              <div
                key={a.id}
                className="flex items-center justify-between p-3.5 rounded-xl glass-card border border-white/[0.06] hover:border-white/[0.12] transition-all"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                      isCommit
                        ? 'bg-accent/15 text-accent'
                        : isPR
                        ? 'bg-amber-500/15 text-amber-400'
                        : 'bg-emerald-500/15 text-emerald-400'
                    }`}
                  >
                    {isCommit && <GitCommit className="w-4 h-4" />}
                    {isPR && <GitPullRequest className="w-4 h-4" />}
                    {isIssue && <AlertCircle className="w-4 h-4" />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-white truncate leading-snug">{a.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-muted font-mono">
                      <span>{a.author}</span>
                      <span>•</span>
                      <span>{new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>•</span>
                      <span className="text-accent-bright uppercase text-[9px]">
                        {a.activityType.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                <a
                  href={a.url}
                  onClick={(e) => {
                    if (a.url === '#') {
                      e.preventDefault();
                      toast.info(`Mock commit hash: ${a.id}`);
                    }
                  }}
                  className="text-[11px] text-secondary hover:text-white font-mono px-2.5 py-1 rounded-lg hover:bg-white/[0.06] transition-colors ml-3 shrink-0"
                >
                  view →
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}