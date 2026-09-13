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
    <div className="space-y-5 max-w-6xl mx-auto animate-fade-up">
      {/* Header with Repo Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.05]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg font-semibold text-fg tracking-snug">GitHub Telemetry</h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-2xs font-mono font-medium">
              ● Connected
            </span>
          </div>
          <p className="text-secondary text-xs mt-0.5">
            Real-time repository analytics, commit velocity, and AI engineering triage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Repository Selector */}
          <select
            value={selectedRepo}
            onChange={(e) => setSelectedRepo(e.target.value)}
            className="py-1.5 px-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-fg focus:outline-none focus:border-accent font-mono"
          >
            {repos.map((r) => (
              <option key={r.name} value={r.name} className="bg-bg-raised text-fg">
                ash-agentic / {r.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-ink-muted hover:text-fg transition-colors active:scale-[0.97]"
            title="Refresh GitHub telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-accent-bright' : ''}`} />
          </button>
        </div>
      </div>

      {/* Max Engineering Insight Callout */}
      <div className="p-4 rounded-xl glass-panel border border-accent/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-ambient">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/25 flex items-center justify-center text-accent-bright shrink-0">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-2xs font-semibold text-accent-bright uppercase tracking-wider font-mono">
              Max Telemetry Insight
            </h3>
            <p className="text-xs text-secondary mt-0.5 leading-relaxed">
              Your backend and agent workflows are <span className="text-emerald-400 font-medium">90% complete</span> with high commit velocity. Shift focus now to demo video recording and submission checklist.
            </p>
          </div>
        </div>
        <button
          onClick={() => toast.info('Anti-slop rule enforced: Non-critical code commits blocked.')}
          className="px-3 py-1.5 rounded-lg bg-accent hover:bg-accent-bright text-white text-xs font-medium shadow-ambient transition-all active:scale-[0.97] shrink-0"
        >
          Acknowledge
        </button>
      </div>

      {/* Telemetry Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="glass-panel rounded-xl p-4 border border-white/[0.05]">
          <div className="flex items-center justify-between text-ink-faint mb-1.5 font-mono text-2xs">
            <span className="uppercase tracking-wider flex items-center gap-1.5">
              <GitCommit className="w-3.5 h-3.5 text-accent-bright" /> Commits
            </span>
            <span>main</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-fg">48</span>
            <span className="text-2xs text-emerald-400 font-mono">+6 today</span>
          </div>
          <p className="text-2xs text-secondary mt-1">High commit velocity</p>
        </div>

        <div className="glass-panel rounded-xl p-4 border border-white/[0.05]">
          <div className="flex items-center justify-between text-ink-faint mb-1.5 font-mono text-2xs">
            <span className="uppercase tracking-wider flex items-center gap-1.5">
              <GitPullRequest className="w-3.5 h-3.5 text-amber-400" /> Pull Requests
            </span>
            <span>velocity</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-fg">14</span>
            <span className="text-2xs text-ink-faint font-mono">12 merged, 2 open</span>
          </div>
          <p className="text-2xs text-secondary mt-1">85% PR merge rate</p>
        </div>

        <div className="glass-panel rounded-xl p-4 border border-white/[0.05]">
          <div className="flex items-center justify-between text-ink-faint mb-1.5 font-mono text-2xs">
            <span className="uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> CI / Build Health
            </span>
            <span>Actions</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-semibold text-emerald-400 flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-4 h-4" /> Passing
            </span>
          </div>
          <p className="text-2xs text-secondary mt-1">100% clean TypeScript build</p>
        </div>

        <div className="glass-panel rounded-xl p-4 border border-white/[0.05]">
          <div className="flex items-center justify-between text-ink-faint mb-1.5 font-mono text-2xs">
            <span className="uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-accent-bright" /> Open Issues
            </span>
            <span>backlog</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-fg">2</span>
            <span className="text-2xs text-ink-faint font-mono">0 critical</span>
          </div>
          <p className="text-2xs text-secondary mt-1">Zero blocker bugs</p>
        </div>
      </div>

      {/* GitHub Activity Feed */}
      <div className="glass-panel rounded-xl p-5 border border-white/[0.05]">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.04]">
          <div>
            <h3 className="font-semibold text-xs text-fg">Activity Stream</h3>
            <p className="text-secondary text-2xs">Recent commits, pull requests, and branch telemetry</p>
          </div>
          <a
            href="https://github.com/ash-agentic/agentic-researcher"
            target="_blank"
            rel="noreferrer"
            className="text-2xs text-accent-bright hover:underline flex items-center gap-1 font-mono font-medium"
          >
            <span>GitHub Repo</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="space-y-1.5">
          {activity.map((a) => {
            const isCommit = a.activityType === 'commit';
            const isPR = a.activityType.startsWith('pr');
            const isIssue = a.activityType.includes('issue');

            return (
              <div
                key={a.id}
                className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isCommit
                        ? 'bg-accent/10 text-accent-bright'
                        : isPR
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'bg-emerald-500/10 text-emerald-400'
                    }`}
                  >
                    {isCommit && <GitCommit className="w-3.5 h-3.5" />}
                    {isPR && <GitPullRequest className="w-3.5 h-3.5" />}
                    {isIssue && <AlertCircle className="w-3.5 h-3.5" />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-normal text-fg truncate leading-snug">{a.title}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-2xs text-ink-faint font-mono">
                      <span>{a.author}</span>
                      <span>•</span>
                      <span>{new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>•</span>
                      <span className="text-accent-bright uppercase text-2xs">
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
                  className="text-2xs text-secondary hover:text-fg font-mono px-2 py-0.5 rounded hover:bg-white/[0.04] transition-colors ml-2 shrink-0"
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