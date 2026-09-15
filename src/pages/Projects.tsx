import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useHackMaxStore } from '@/lib/store';
import {
  Boxes,
  Target,
  Plus,
  Layers,
  ArrowRight,
  X,
  Lightbulb,
  GitCommit,
  GitPullRequest,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Cpu,
  ShieldCheck,
  Code2,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { Project } from '@/types';

interface ProjectsProps {
  initialTab?: 'repos' | 'github' | 'dna';
}

export default function Projects({ initialTab }: ProjectsProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { state, dispatch } = useHackMaxStore();

  const urlTab = searchParams.get('tab') as 'repos' | 'github' | 'dna' | null;
  const [activeTab, setActiveTab] = useState<'repos' | 'github' | 'dna'>(
    initialTab || urlTab || 'repos'
  );

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    } else if (urlTab) {
      setActiveTab(urlTab);
    }
  }, [initialTab, urlTab]);

  const handleTabChange = (tab: 'repos' | 'github' | 'dna') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Add project modal state
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [repoName, setRepoName] = useState('');
  const [techStack, setTechStack] = useState('React, TypeScript, FastAPI');

  // GitHub Telemetry state
  const [selectedRepo, setSelectedRepo] = useState('agentic-researcher');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const repos = [
    { name: 'agentic-researcher', defaultBranch: 'main', commits: 48, prs: 14, issues: 2, status: 'passing' },
    { name: 'hackmax-core', defaultBranch: 'main', commits: 32, prs: 8, issues: 1, status: 'passing' },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('GitHub Telemetry refreshed! Working tree green.');
    }, 600);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      userId: state.profile.id,
      name: name.trim(),
      tagline: tagline.trim() || 'Custom hackathon project',
      description: 'Custom hackathon project with reusable Project DNA capabilities.',
      techStack: techStack.split(',').map((s) => s.trim()).filter(Boolean),
      capabilities: ['AI Reasoning', 'Web Integration'],
      reusableComponents: ['Auth System', 'UI Components'],
      repositoryName: repoName.trim() || 'custom/project',
      repositoryUrl: `https://github.com/${repoName.trim() || 'custom/project'}`,
      createdAt: new Date().toISOString(),
    };

    dispatch({
      type: 'hydrate',
      state: {
        ...state,
        projects: [...state.projects, newProject],
      },
    });

    toast.success(`Created project: ${newProject.name}`);
    setIsAddProjectOpen(false);
    setName('');
    setTagline('');
  };

  // Collect all capabilities across projects
  const allCapabilities = Array.from(
    new Set(state.projects.flatMap((p) => p.capabilities))
  );
  const allComponents = Array.from(
    new Set(state.projects.flatMap((p) => p.reusableComponents))
  );

  return (
    <div className="space-y-5 max-w-6xl mx-auto animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.05]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-fenix text-fg tracking-normal">Projects &amp; Code Hub</h1>
            <span className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent-bright text-2xs font-mono font-medium">
              {state.projects.length} Repositories Connected
            </span>
          </div>
          <p className="text-secondary text-xs mt-0.5">
            Unified repository management, live GitHub commit velocity, and cross-hackathon DNA.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'github' && (
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-2 hover:bg-surface-3 border border-white/[0.06] text-xs font-medium text-ink-muted hover:text-fg transition-colors active:scale-[0.97]"
              title="Refresh GitHub telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-accent-bright' : ''}`} />
              <span>Sync Commits</span>
            </button>
          )}

          <button
            onClick={() => setIsAddProjectOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent hover:bg-accent-bright text-white text-xs font-medium shadow-ambient transition-all active:scale-[0.97]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Repository</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-1 border border-white/[0.05] w-fit">
        <button
          onClick={() => handleTabChange('repos')}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
            activeTab === 'repos'
              ? 'bg-white/[0.08] text-fg shadow-ambient font-medium'
              : 'text-ink-muted hover:text-fg hover:bg-white/[0.03]'
          )}
        >
          <Boxes className="w-3.5 h-3.5 text-accent-bright" />
          <span>Connected Starters ({state.projects.length})</span>
        </button>

        <button
          onClick={() => handleTabChange('github')}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
            activeTab === 'github'
              ? 'bg-white/[0.08] text-fg shadow-ambient font-medium'
              : 'text-ink-muted hover:text-fg hover:bg-white/[0.03]'
          )}
        >
          <GitCommit className="w-3.5 h-3.5 text-emerald-400" />
          <span>Git Velocity &amp; Activity</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </button>

        <button
          onClick={() => handleTabChange('dna')}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
            activeTab === 'dna'
              ? 'bg-white/[0.08] text-fg shadow-ambient font-medium'
              : 'text-ink-muted hover:text-fg hover:bg-white/[0.03]'
          )}
        >
          <Target className="w-3.5 h-3.5 text-accent-cyan" />
          <span>Reusable DNA Catalog</span>
        </button>
      </div>

      {/* TAB 1: CONNECTED REPOSITORIES */}
      {activeTab === 'repos' && (
        <div className="space-y-4">
          {/* Student Tip Card */}
          <div className="p-3.5 rounded-xl glass-panel border border-accent/20 bg-accent/[0.02] flex items-start gap-3 shadow-ambient">
            <div className="w-7 h-7 rounded-lg bg-accent/15 border border-accent/25 flex items-center justify-center text-accent-bright shrink-0 mt-0.5">
              <Lightbulb className="w-3.5 h-3.5" />
            </div>
            <div className="text-xs">
              <p className="font-medium text-fg">Why Keep Reusable Starter Projects?</p>
              <p className="text-secondary text-2xs mt-0.5 leading-relaxed">
                Winning teams don't build basic database schemas, authentication layers, or navigation bars from scratch during sprints. Keeping your starter code indexed here allows you to launch prototypes 10x faster.
              </p>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.projects.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/projects/${p.id}`)}
                className="glass-panel rounded-xl p-5 border border-white/[0.05] hover:border-white/[0.12] transition-all cursor-pointer flex flex-col justify-between group shadow-ambient"
              >
                <div>
                  <div className="flex items-start justify-between mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/25 flex items-center justify-center text-accent-bright shadow-[0_0_8px_rgba(59,130,246,0.2)]">
                        <Boxes className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-fg text-xs group-hover:text-accent-bright transition-colors">
                          {p.name}
                        </h3>
                        <p className="text-2xs text-ink-faint font-mono">{p.repositoryName}</p>
                      </div>
                    </div>
                    <span className="text-2xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-medium">
                      Primary Starter
                    </span>
                  </div>

                  <p className="text-xs text-secondary leading-relaxed mb-3">{p.tagline}</p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {p.techStack.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.06] text-2xs text-secondary font-mono"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom DNA summary */}
                <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-2xs">
                  <div className="flex items-center gap-2.5 text-ink-faint font-mono">
                    <span className="flex items-center gap-1">
                      <Target className="w-3 h-3 text-accent-bright" />
                      {p.capabilities.length} capabilities
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Layers className="w-3 h-3 text-emerald-400" />
                      {p.reusableComponents.length} components
                    </span>
                  </div>

                  <span className="text-secondary hover:text-fg font-medium flex items-center gap-1 transition-colors">
                    <span>View Modules</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: LIVE GITHUB TELEMETRY */}
      {activeTab === 'github' && (
        <div className="space-y-4">
          {/* Repo selector */}
          <div className="flex items-center justify-between gap-3 pb-1">
            <div className="flex items-center gap-2">
              <span className="text-2xs text-secondary font-mono uppercase tracking-wider">Repository:</span>
              <select
                value={selectedRepo}
                onChange={(e) => setSelectedRepo(e.target.value)}
                className="py-1 px-2.5 rounded-lg bg-surface-2 border border-white/[0.08] text-xs text-fg focus:outline-none focus:border-accent font-mono"
              >
                {repos.map((r) => (
                  <option key={r.name} value={r.name} className="bg-bg-raised text-fg">
                    ash-agentic / {r.name} ({r.defaultBranch})
                  </option>
                ))}
              </select>
            </div>
            <span className="text-2xs text-ink-faint font-mono hidden sm:inline">
              Tracked via GitHub Sync
            </span>
          </div>

          {/* Engineering Insight Banner */}
          <div className="p-4 rounded-xl glass-panel border border-accent/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-ambient">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/25 flex items-center justify-center text-accent-bright shrink-0">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-2xs font-semibold text-accent-bright uppercase tracking-wider font-mono">
                  Sprint Engineering Insight
                </h3>
                <p className="text-xs text-secondary mt-0.5 leading-relaxed">
                  Your backend and core workflows are <span className="text-emerald-400 font-medium">90% complete</span> with high commit velocity. Shift focus now to demo video recording and submission checklist.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/workspace')}
              className="px-3 py-1.5 rounded-lg bg-accent/15 border border-accent/30 text-accent-bright hover:bg-accent/25 text-xs font-medium transition-all shrink-0 active:scale-[0.97]"
            >
              Open Checklist →
            </button>
          </div>

          {/* Repo Telemetry KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl glass-panel border border-white/[0.05]">
              <div className="flex items-center justify-between text-secondary mb-1">
                <span className="text-2xs font-mono">Commits on main</span>
                <GitCommit className="w-3.5 h-3.5 text-accent-bright" />
              </div>
              <div className="text-xl font-mono font-semibold text-fg">48</div>
              <span className="text-2xs text-emerald-400 font-mono mt-0.5 block">↑ 12 today</span>
            </div>

            <div className="p-3.5 rounded-xl glass-panel border border-white/[0.05]">
              <div className="flex items-center justify-between text-secondary mb-1">
                <span className="text-2xs font-mono">Pull Requests</span>
                <GitPullRequest className="w-3.5 h-3.5 text-accent-cobalt" />
              </div>
              <div className="text-xl font-mono font-semibold text-fg">14</div>
              <span className="text-2xs text-ink-faint font-mono mt-0.5 block">13 merged, 1 open</span>
            </div>

            <div className="p-3.5 rounded-xl glass-panel border border-white/[0.05]">
              <div className="flex items-center justify-between text-secondary mb-1">
                <span className="text-2xs font-mono">Open Issues</span>
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-xl font-mono font-semibold text-fg">2</div>
              <span className="text-2xs text-amber-400 font-mono mt-0.5 block">Non-blocking</span>
            </div>

            <div className="p-3.5 rounded-xl glass-panel border border-white/[0.05]">
              <div className="flex items-center justify-between text-secondary mb-1">
                <span className="text-2xs font-mono">Build Health</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-xl font-mono font-semibold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Passing
              </div>
              <span className="text-2xs text-ink-faint font-mono mt-0.5 block">0 broken tests</span>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="glass-panel rounded-xl p-5 border border-white/[0.05] shadow-ambient">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.05]">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-fg text-xs">Recent Git Commit &amp; PR Stream</h3>
                <span className="text-2xs px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-ink-muted font-mono">
                  {state.githubActivity.length} Events Logged
                </span>
              </div>
              <a
                href="https://github.com/ash-agentic/agentic-researcher"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-2xs text-accent-bright hover:underline font-mono"
              >
                <span>github.com/ash-agentic/agentic-researcher</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="space-y-2">
              {state.githubActivity.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.03] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-ink-muted group-hover:text-accent-bright transition-colors shrink-0">
                      {a.activityType === 'commit' && <GitCommit className="w-3 h-3" />}
                      {a.activityType === 'pr_opened' && <GitPullRequest className="w-3 h-3 text-amber-400" />}
                      {a.activityType === 'pr_merged' && <GitPullRequest className="w-3 h-3 text-emerald-400" />}
                      {a.activityType === 'issue_closed' && <CheckCircle2 className="w-3 h-3 text-accent-cyan" />}
                    </div>
                    <div>
                      <p className="text-xs text-fg font-medium leading-snug">{a.title}</p>
                      <div className="flex items-center gap-2 text-2xs text-ink-faint font-mono mt-0.5">
                        <span>@{a.author}</span>
                        <span>•</span>
                        <span>{new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span>•</span>
                        <span className="capitalize">{a.activityType.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={a.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-2xs text-secondary hover:text-fg font-mono px-2 py-0.5 rounded hover:bg-white/[0.04] transition-colors ml-2 shrink-0"
                  >
                    view →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REUSABLE DNA CATALOG */}
      {activeTab === 'dna' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl glass-panel border border-white/[0.06] bg-surface-1">
            <div className="flex items-center gap-2 mb-1">
              <Code2 className="w-4 h-4 text-accent-cyan" />
              <h3 className="text-xs font-semibold text-fg">Cross-Hackathon Reusability Matrix</h3>
            </div>
            <p className="text-2xs text-secondary leading-relaxed">
              These indexed architectural blocks are automatically compared against upcoming competitions to score potential code reuse.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Capabilities */}
            <div className="glass-panel rounded-xl p-4 border border-white/[0.05]">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/[0.05]">
                <span className="text-xs font-semibold text-fg flex items-center gap-2">
                  <Target className="w-3.5 h-3.5 text-accent-bright" />
                  Functional Capabilities ({allCapabilities.length})
                </span>
                <span className="text-2xs font-mono text-ink-faint">Reusable Modules</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {allCapabilities.map((cap) => (
                  <span
                    key={cap}
                    className="px-2.5 py-1 rounded-lg bg-accent/10 border border-accent/20 text-accent-bright text-xs font-mono"
                  >
                    ✓ {cap}
                  </span>
                ))}
              </div>
            </div>

            {/* Reusable UI / Logic Components */}
            <div className="glass-panel rounded-xl p-4 border border-white/[0.05]">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/[0.05]">
                <span className="text-xs font-semibold text-fg flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  Pre-Built Components ({allComponents.length})
                </span>
                <span className="text-2xs font-mono text-ink-faint">Ready to import</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {allComponents.map((comp) => (
                  <span
                    key={comp}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono"
                  >
                    ● {comp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {isAddProjectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-up">
          <div className="glass-elevated border border-white/[0.08] rounded-xl p-5 w-full max-w-md shadow-overlay">
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-white/[0.06]">
              <h3 className="font-semibold text-fg text-xs">Add Project / Starter Template</h3>
              <button
                onClick={() => setIsAddProjectOpen(false)}
                className="p-1 rounded-md text-secondary hover:text-fg hover:bg-white/[0.04] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
              <div>
                <label className="block text-secondary mb-1 text-2xs font-medium">Project Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Autonoma Engine"
                  required
                  className="w-full py-2 px-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-fg focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-secondary mb-1 text-2xs font-medium">Tagline / Summary</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Production multi-agent orchestration runtime"
                  className="w-full py-2 px-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-fg focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-secondary mb-1 text-2xs font-medium">GitHub Repository</label>
                <input
                  type="text"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  placeholder="username/repo-name"
                  className="w-full py-2 px-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-fg focus:outline-none focus:border-accent font-mono"
                />
              </div>

              <div>
                <label className="block text-secondary mb-1 text-2xs font-medium">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  placeholder="React, TypeScript, Python, FastAPI"
                  className="w-full py-2 px-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-fg focus:outline-none focus:border-accent font-mono"
                />
              </div>

              <div className="pt-2.5 flex justify-end gap-2 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setIsAddProjectOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-white/[0.03] text-secondary hover:text-fg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-accent hover:bg-accent-bright text-white font-medium shadow-ambient transition-all active:scale-[0.97]"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}