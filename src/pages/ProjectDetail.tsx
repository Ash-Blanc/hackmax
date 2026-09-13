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
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8 glass-panel rounded-2xl border border-white/[0.08] chamfer-top">
          <p className="text-xl font-bold text-white mb-2">Project Not Found</p>
          <button
            onClick={() => navigate('/projects')}
            className="px-4 py-2 bg-accent text-white rounded-xl text-xs font-semibold"
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
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.06]">
        <div>
          <button
            onClick={() => navigate('/projects')}
            className="text-xs text-muted hover:text-white flex items-center gap-1 mb-2 transition-colors font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Projects</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">{project.name}</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-accent/15 border border-accent/30 text-accent-bright text-[11px] font-mono">
              {project.repositoryName}
            </span>
          </div>
          <p className="text-secondary text-xs mt-1.5 max-w-2xl leading-relaxed">{project.description}</p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={project.repositoryUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card text-xs font-semibold text-white hover:border-white/[0.15] transition-all font-mono"
          >
            <GitBranch className="w-3.5 h-3.5 text-accent" />
            <span>View GitHub Repo</span>
            <ExternalLink className="w-3 h-3 text-muted ml-1" />
          </a>
        </div>
      </div>

      {/* Tech Stack & Capabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Tech Stack */}
        <div className="glass-panel rounded-2xl p-6 border border-white/[0.06] chamfer-top shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-accent" />
              <h3 className="font-extrabold text-sm text-white">Tech Stack & Frameworks</h3>
            </div>
            <span className="text-xs font-mono text-muted">{project.techStack.length} tools</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 rounded-xl bg-accent/15 border border-accent/25 text-accent-bright text-xs font-mono font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Capabilities Matrix */}
        <div className="glass-panel rounded-2xl p-6 border border-white/[0.06] chamfer-top shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              <h3 className="font-extrabold text-sm text-white">Project Capabilities (DNA)</h3>
            </div>
            <button
              onClick={() => setShowCapInput(!showCapInput)}
              className="text-xs text-accent-light hover:underline flex items-center gap-1 font-semibold"
            >
              <Plus className="w-3 h-3" />
              <span>Add Capability</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.capabilities.map((cap) => (
              <span
                key={cap}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium"
              >
                ✓ {cap}
              </span>
            ))}
          </div>

          {showCapInput && (
            <form onSubmit={handleAddCapability} className="mt-4 flex gap-2">
              <input
                type="text"
                value={newCap}
                onChange={(e) => setNewCap(e.target.value)}
                placeholder="e.g. Vector Search, Graph Extraction"
                className="flex-1 py-2 px-3 rounded-xl bg-[#131622] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-accent"
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-2 bg-accent text-white rounded-xl text-xs font-semibold hover:bg-accent-bright shadow-glow"
              >
                Add
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Reusable Components Section */}
      <div className="glass-panel rounded-2xl p-6 border border-white/[0.06] chamfer-top shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-accent" />
            <h3 className="font-extrabold text-sm text-white">Reusable Scaffolding Components</h3>
          </div>
          <button
            onClick={() => setShowCompInput(!showCompInput)}
            className="text-xs text-accent-light hover:underline flex items-center gap-1 font-semibold"
          >
            <Plus className="w-3 h-3" />
            <span>Add Component</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {project.reusableComponents.map((comp) => (
            <div
              key={comp}
              className="p-3.5 rounded-xl bg-[#131622] border border-white/[0.08] flex items-center gap-2.5 font-mono"
            >
              <div className="w-2 h-2 rounded-full bg-accent shrink-0 shadow-glow" />
              <span className="text-xs text-white font-medium">{comp}</span>
            </div>
          ))}
        </div>

        {showCompInput && (
          <form onSubmit={handleAddComponent} className="mt-4 flex gap-2 max-w-md">
            <input
              type="text"
              value={newComp}
              onChange={(e) => setNewComp(e.target.value)}
              placeholder="e.g. Multi-agent DAG Scheduler"
              className="flex-1 py-2 px-3 rounded-xl bg-[#131622] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-accent"
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-2 bg-accent text-white rounded-xl text-xs font-semibold hover:bg-accent-bright shadow-glow"
            >
              Add
            </button>
          </form>
        )}
      </div>

      {/* Connected Hackathons */}
      <div className="glass-panel rounded-2xl p-6 border border-white/[0.06] chamfer-top shadow-lg">
        <h3 className="font-extrabold text-sm text-white mb-1">Associated Hackathons</h3>
        <p className="text-xs text-secondary mb-4">Competitions powered by this codebase</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {state.hackathons.map((h) => (
            <div
              key={h.id}
              onClick={() => navigate(`/hackathons/${h.id}`)}
              className="p-4 rounded-xl glass-card border border-white/[0.06] hover:border-white/[0.15] transition-all cursor-pointer flex items-center justify-between group"
            >
              <div>
                <h4 className="font-semibold text-xs text-white group-hover:text-accent-light transition-colors">
                  {h.title}
                </h4>
                <p className="text-[11px] text-muted mt-1 font-mono">Max Score: {h.maxScore}/100</p>
              </div>
              <span className="text-xs text-accent-light font-medium flex items-center gap-1 font-mono">
                Workspace →
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}