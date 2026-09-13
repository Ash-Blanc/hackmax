import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHackMaxStore } from '@/lib/store';
import {
  GitBranch,
  Code,
  Target,
  Rocket,
  Plus,
  ExternalLink,
  ArrowLeft,
} from 'lucide-react';
import { toast } from 'sonner';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useHackMaxStore();

  const [newCap, setNewCap] = useState('');
  const [newComp, setNewComp] = useState('');
  const [showCapInput, setShowCapInput] = useState(false);
  const [showCompInput, setShowCompInput] = useState(false);

  const project = state.projects.find((p) => p.id === id) || state.projects[0];

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="text-center p-8 glass-panel rounded-xl border border-white/[0.06] max-w-sm">
          <p className="text-sm font-semibold text-fg mb-2">Project Not Found</p>
          <button
            onClick={() => navigate('/projects')}
            className="px-4 py-2 bg-accent hover:bg-accent-bright text-white rounded-lg text-xs font-medium transition-all active:scale-[0.97]"
          >
            ← Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const handleAddCapability = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCap.trim()) return;
    dispatch({ type: 'add_capability', projectId: project.id, capability: newCap.trim() });
    toast.success(`Added capability: ${newCap.trim()}`);
    setNewCap('');
    setShowCapInput(false);
  };

  const handleAddComponent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComp.trim()) return;
    dispatch({ type: 'add_component', projectId: project.id, component: newComp.trim() });
    toast.success(`Added component: ${newComp.trim()}`);
    setNewComp('');
    setShowCompInput(false);
  };

  return (
    <div className="space-y-5 max-w-6xl mx-auto animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.05]">
        <div>
          <button
            onClick={() => navigate('/projects')}
            className="text-2xs text-ink-faint hover:text-fg flex items-center gap-1 mb-1.5 transition-colors font-mono"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Back to Projects</span>
          </button>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-fenix text-fg tracking-normal">{project.name}</h1>
            <span className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent-bright text-2xs font-mono">
              {project.repositoryName}
            </span>
          </div>
          <p className="text-secondary text-xs mt-1 max-w-xl leading-relaxed">{project.description}</p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={project.repositoryUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-xs font-medium text-secondary hover:text-fg transition-all font-mono active:scale-[0.97]"
          >
            <GitBranch className="w-3.5 h-3.5 text-accent-bright" />
            <span>GitHub Repo</span>
            <ExternalLink className="w-3 h-3 text-ink-faint ml-0.5" />
          </a>
        </div>
      </div>

      {/* Tech Stack & Capabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tech Stack */}
        <div className="glass-panel rounded-xl p-5 border border-white/[0.05]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-accent-bright" />
              <h3 className="font-semibold text-xs text-fg">Tech Stack & Frameworks</h3>
            </div>
            <span className="text-2xs font-mono text-ink-faint">{project.techStack.length} tools</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-md bg-accent/10 border border-accent/20 text-accent-bright text-xs font-mono font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Capabilities Matrix */}
        <div className="glass-panel rounded-xl p-5 border border-white/[0.05]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              <h3 className="font-semibold text-xs text-fg">Key Features & Capabilities</h3>
            </div>
            <button
              onClick={() => setShowCapInput(!showCapInput)}
              className="text-2xs text-secondary hover:text-fg flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Add</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {project.capabilities.map((cap) => (
              <span
                key={cap}
                className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium"
              >
                ✓ {cap}
              </span>
            ))}
          </div>

          {showCapInput && (
            <form onSubmit={handleAddCapability} className="mt-3 flex gap-2">
              <input
                type="text"
                value={newCap}
                onChange={(e) => setNewCap(e.target.value)}
                placeholder="e.g. Vector Search, Auth Flow, API Client"
                className="flex-1 py-1.5 px-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-fg focus:outline-none focus:border-accent"
                autoFocus
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-accent hover:bg-accent-bright text-white rounded-lg text-xs font-medium shadow-ambient transition-all active:scale-[0.97]"
              >
                Add
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Reusable Components Section */}
      <div className="glass-panel rounded-xl p-5 border border-white/[0.05]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-accent-bright" />
            <h3 className="font-semibold text-xs text-fg">Reusable Code & Starter Modules</h3>
          </div>
          <button
            onClick={() => setShowCompInput(!showCompInput)}
            className="text-2xs text-secondary hover:text-fg flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>Add</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {project.reusableComponents.map((comp) => (
            <div
              key={comp}
              className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center gap-2 font-mono"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-accent-bright shrink-0" />
              <span className="text-xs text-fg font-normal">{comp}</span>
            </div>
          ))}
        </div>

        {showCompInput && (
          <form onSubmit={handleAddComponent} className="mt-3 flex gap-2 max-w-sm">
            <input
              type="text"
              value={newComp}
              onChange={(e) => setNewComp(e.target.value)}
              placeholder="e.g. Auth Modal, SQLite Store, API Client"
              className="flex-1 py-1.5 px-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-fg focus:outline-none focus:border-accent"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-accent hover:bg-accent-bright text-white rounded-lg text-xs font-medium shadow-ambient transition-all active:scale-[0.97]"
            >
              Add
            </button>
          </form>
        )}
      </div>

      {/* Connected Hackathons */}
      <div className="glass-panel rounded-xl p-5 border border-white/[0.05]">
        <h3 className="font-semibold text-xs text-fg mb-0.5">Associated Hackathons</h3>
        <p className="text-2xs text-secondary mb-3">Competitions powered by this codebase</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {state.hackathons.map((h) => (
            <div
              key={h.id}
              onClick={() => navigate(`/hackathons/${h.id}`)}
              className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.10] transition-colors cursor-pointer flex items-center justify-between group"
            >
              <div>
                <h4 className="font-medium text-xs text-fg group-hover:text-accent-bright transition-colors">
                  {h.title}
                </h4>
                <p className="text-2xs text-ink-faint mt-0.5 font-mono">Max Score: {h.maxScore}/100</p>
              </div>
              <span className="text-2xs text-secondary group-hover:text-fg font-medium flex items-center gap-1 font-mono transition-colors">
                Workspace →
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}