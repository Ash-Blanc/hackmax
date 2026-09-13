import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHackMaxStore } from '@/lib/store';
import {
  Boxes,
  Target,
  Plus,
  Layers,
  ArrowRight,
  X,
  Lightbulb,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Project } from '@/types';

export default function Projects() {
  const navigate = useNavigate();
  const { state, dispatch } = useHackMaxStore();
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [repoName, setRepoName] = useState('');
  const [techStack, setTechStack] = useState('React, TypeScript, FastAPI');

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

  return (
    <div className="space-y-5 max-w-6xl mx-auto animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.05]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-fenix text-fg tracking-normal">Projects &amp; Reusable Code</h1>
            <span className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent-bright text-2xs font-mono font-medium">
              {state.projects.length} Repositories Connected
            </span>
          </div>
          <p className="text-secondary text-xs mt-0.5">
            Save your starter templates, auth setups, and components to kickstart future hackathons.
          </p>
        </div>

        <button
          onClick={() => setIsAddProjectOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent hover:bg-accent-bright text-white text-xs font-medium shadow-ambient transition-all active:scale-[0.97]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Project / Template</span>
        </button>
      </div>

      {/* Student Tip Card */}
      <div className="p-3.5 rounded-xl glass-panel border border-accent/20 bg-accent/[0.02] flex items-start gap-3 shadow-ambient">
        <div className="w-7 h-7 rounded-lg bg-accent/15 border border-accent/25 flex items-center justify-center text-accent-bright shrink-0 mt-0.5">
          <Lightbulb className="w-3.5 h-3.5" />
        </div>
        <div className="text-xs">
          <p className="font-medium text-fg">Why Keep Reusable Starter Projects?</p>
          <p className="text-secondary text-2xs mt-0.5 leading-relaxed">
            Winning hackathoners never code basic database setups, auth forms, or UI layouts from scratch. Keeping your starter code here allows you to launch prototypes 10x faster and spend all your competition hours on the core challenge feature.
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {state.projects.map((p) => (
          <div
            key={p.id}
            onClick={() => navigate(`/projects/${p.id}`)}
            className="glass-panel rounded-xl p-5 border border-white/[0.05] hover:border-white/[0.10] transition-colors cursor-pointer flex flex-col justify-between group shadow-ambient"
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