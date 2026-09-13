import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHackMaxStore } from '@/lib/store';
import {
  FolderGit2,
  Target,
  Plus,
  Layers,
  ArrowRight,
  X,
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
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Projects & DNA</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-accent/15 border border-accent/30 text-accent-bright text-[11px] font-mono font-semibold">
              {state.projects.length} Repositories Connected
            </span>
          </div>
          <p className="text-secondary text-xs mt-1">
            Manage your project DNA, reusable components, and connected hackathon repositories.
          </p>
        </div>

        <button
          onClick={() => setIsAddProjectOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent to-indigo-600 text-white text-xs font-semibold hover:from-accent-bright hover:to-indigo-500 shadow-glow transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Project DNA</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {state.projects.map((p) => (
          <div
            key={p.id}
            onClick={() => navigate(`/projects/${p.id}`)}
            className="glass-panel rounded-2xl p-6 border border-white/[0.06] chamfer-top hover:border-white/[0.15] transition-all cursor-pointer flex flex-col justify-between group shadow-lg"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent to-indigo-500 p-0.5 shadow-glow flex items-center justify-center group-hover:scale-105 transition-transform">
                    <div className="w-full h-full bg-[#0d0f17] rounded-[10px] flex items-center justify-center">
                      <FolderGit2 className="w-5 h-5 text-accent" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base group-hover:text-accent-light transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-xs text-muted font-mono">{p.repositoryName}</p>
                  </div>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-semibold">
                  Primary DNA
                </span>
              </div>

              <p className="text-xs text-secondary leading-relaxed mb-4">{p.tagline}</p>

              {/* Tech stack */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {p.techStack.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[10px] text-white font-mono"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom DNA summary */}
            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
              <div className="flex items-center gap-3 text-[11px] text-muted font-mono">
                <span className="flex items-center gap-1">
                  <Target className="w-3.5 h-3.5 text-accent" />
                  {p.capabilities.length} capabilities
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  {p.reusableComponents.length} components
                </span>
              </div>

              <span className="text-accent-light text-xs font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>DNA Vault</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Project Modal */}
      {isAddProjectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="glass-elevated border border-white/[0.12] rounded-2xl p-6 w-full max-w-md shadow-2xl chamfer-top animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.08]">
              <h3 className="font-extrabold text-white text-sm">Add New Project DNA</h3>
              <button
                onClick={() => setIsAddProjectOpen(false)}
                className="p-1 rounded-lg text-secondary hover:text-white hover:bg-white/[0.06]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div>
                <label className="block text-secondary mb-1.5 font-medium">Project Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Autonoma Engine"
                  required
                  className="w-full py-2.5 px-3 rounded-xl bg-[#131622] border border-white/[0.08] text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-secondary mb-1.5 font-medium">Tagline / Summary</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Production multi-agent orchestration runtime"
                  className="w-full py-2.5 px-3 rounded-xl bg-[#131622] border border-white/[0.08] text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-secondary mb-1.5 font-medium">GitHub Repository</label>
                <input
                  type="text"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  placeholder="username/repo-name"
                  className="w-full py-2.5 px-3 rounded-xl bg-[#131622] border border-white/[0.08] text-white focus:outline-none focus:border-accent font-mono"
                />
              </div>

              <div>
                <label className="block text-secondary mb-1.5 font-medium">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  placeholder="React, TypeScript, Python, FastAPI"
                  className="w-full py-2.5 px-3 rounded-xl bg-[#131622] border border-white/[0.08] text-white focus:outline-none focus:border-accent font-mono"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2.5 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsAddProjectOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.04] text-secondary hover:text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-indigo-600 text-white font-bold hover:from-accent-bright hover:to-indigo-500 shadow-glow"
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