import { useState } from 'react';
import { useHackMaxStore } from '@/lib/store';
import {
  GitCommit,
  GitPullRequest,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  RefreshCw,
  ShieldCheck,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-fg tracking-tight">GitHub Telemetry</h1>
            <span className="px-2 py-0.5 rounded-full bg-success/10 border border-success/20 text-success text-[11px] font-mono font-semibold">
              Connected
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
            className="py-2 px-3 rounded-xl bg-elevated border border-border text-xs text-fg focus:outline-none focus:border-accent"
          >
            {repos.map((r) => (
              <option key={r.name} value={r.name}>
                ash-agentic / {r.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleRefresh}
            className="p-2 rounded-xl bg-elevated hover:bg-surface border border-border text-secondary hover:text-fg transition-colors"
            title="Refresh GitHub telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-accent' : ''}`} />
          </button>
        </div>
      </div>

      {/* Max Engineering Insight Callout */}
      <div className="p-4 sm:p-5 rounded-2xl bg-accent/10 border border-accent/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-glow">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-accent-light uppercase tracking-wider">
              Max Telemetry Insight
            </h3>
            <p className="text-xs text-fg mt-0.5 leading-relaxed">
              Your backend and agent workflows are <strong>90% complete</strong> with high commit velocity. Shift focus now to demo video recording and submission checklist.
            </p>
          </div>
        </div>
        <button
          onClick={() => toast.info('Anti-slop rule enforced: Low-priority code commits blocked.')}
          className="px-3.5 py-1.5 rounded-lg bg-accent text-white text-xs font-semibold hover:bg-accent-bright shrink-0"
        >
          Acknowledge
        </button>
      </div>

      {/* Telemetry Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass rounded-2xl p-5 border-border">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <GitCommit className="w-4 h-4 text-accent" /> Total Commits
            </span>
            <span className="text-[10px] text-muted font-mono">branch: main</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-fg">48</span>
            <span className="text-xs text-success font-mono">+6 today</span>
          </div>
          <p className="text-[11px] text-secondary mt-1">High commit velocity</p>
        </div>

        <div className="glass rounded-2xl p-5 border-border">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <GitPullRequest className="w-4 h-4 text-yellow-400" /> Pull Requests
            </span>
            <span className="text-[10px] text-muted font-mono">velocity</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-fg">14</span>
            <span className="text-xs text-muted font-mono">12 merged, 2 open</span>
          </div>
          <p className="text-[11px] text-secondary mt-1">85% PR merge velocity</p>
        </div>

        <div className="glass rounded-2xl p-5 border-border">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-success" /> CI / Build Health
            </span>
            <span className="text-[10px] text-muted font-mono">GitHub Actions</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-success flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5" /> Passing
            </span>
          </div>
          <p className="text-[11px] text-secondary mt-1">100% clean TypeScript build</p>
        </div>

        <div className="glass rounded-2xl p-5 border-border">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-accent-light" /> Open Issues
            </span>
            <span className="text-[10px] text-muted font-mono">bug backlog</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-fg">2</span>
            <span className="text-xs text-muted font-mono">0 critical</span>
          </div>
          <p className="text-[11px] text-secondary mt-1">Zero blocker bugs</p>
        </div>
      </div>

      {/* GitHub Activity Feed */}
      <div className="glass rounded-2xl p-6 border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm text-fg">Live GitHub Activity Stream</h3>
            <p className="text-secondary text-xs">Recent commits, pull requests, and automated branch telemetry</p>
          </div>
          <a
            href="https://github.com/ash-agentic/agentic-researcher"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-accent-light hover:underline flex items-center gap-1 font-medium"
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
                className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border/80 hover:border-accent/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isCommit
                        ? 'bg-accent/10 text-accent'
                        : isPR
                        ? 'bg-yellow-500/10 text-yellow-400'
                        : 'bg-success/10 text-success'
                    }`}
                  >
                    {isCommit && <GitCommit className="w-4 h-4" />}
                    {isPR && <GitPullRequest className="w-4 h-4" />}
                    {isIssue && <AlertCircle className="w-4 h-4" />}
                  </div>

                  <div>
                    <p className="text-xs font-medium text-fg leading-snug">{a.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-muted">
                      <span>{a.author}</span>
                      <span>•</span>
                      <span>{new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>•</span>
                      <span className="font-mono text-accent-light uppercase text-[9px]">
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
                  className="text-[11px] text-secondary hover:text-fg font-mono p-1 rounded hover:bg-elevated transition-colors"
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