import { useState } from 'react';
import { useHackMaxStore } from '@/lib/store';
import {
  SlidersHorizontal,
  Github,
  Cpu,
  ToggleLeft,
  ToggleRight,
  User,
} from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const { state, toggleDemo, dispatch } = useHackMaxStore();

  const [fullName, setFullName] = useState(state.profile.fullName);
  const [githubUsername, setGithubUsername] = useState(state.profile.githubUsername || '');
  const [selectedProvider, setSelectedProvider] = useState('anthropic');
  const [notifDeadlines, setNotifDeadlines] = useState(true);
  const [notifScores, setNotifScores] = useState(true);
  const [notifOpps, setNotifOpps] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: 'update_profile',
      profile: {
        fullName: fullName.trim(),
        githubUsername: githubUsername.trim(),
      },
    });
    toast.success('Profile settings updated!');
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto animate-fade-up">
      {/* Header */}
      <div className="pb-3 border-b border-white/[0.05]">
        <h1 className="text-xl font-fenix text-fg tracking-normal">Settings</h1>
        <p className="text-secondary text-xs mt-0.5">
          Manage your hacker profile, GitHub integration, AI model provider, and system preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Profile Card */}
        <div className="glass-panel rounded-xl p-5 border border-white/[0.05] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-accent-bright" />
              <h3 className="font-semibold text-xs text-fg">Profile & Identity</h3>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block text-secondary mb-1 uppercase text-2xs font-medium font-mono">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-fg focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-secondary mb-1 uppercase text-2xs font-medium font-mono">
                  GitHub Username
                </label>
                <input
                  type="text"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-fg focus:outline-none focus:border-accent font-mono"
                />
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  className="py-2 px-4 rounded-lg bg-accent hover:bg-accent-bright text-white font-medium text-xs shadow-ambient transition-all active:scale-[0.97]"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* GitHub OAuth Card */}
        <div className="glass-panel rounded-xl p-5 border border-white/[0.05] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Github className="w-4 h-4 text-accent-bright" />
              <h3 className="font-semibold text-xs text-fg">GitHub Integration</h3>
            </div>

            <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.05] mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-fg font-mono">ash-agentic</span>
                <span className="text-2xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-medium">
                  ✓ Connected
                </span>
              </div>
              <p className="text-2xs text-secondary leading-relaxed">
                Repository permissions: Read repository metadata, commits, pull requests, and telemetry.
              </p>
            </div>
          </div>

          <div className="pt-2.5 border-t border-white/[0.04] flex gap-2">
            <button
              onClick={() => toast.success('GitHub OAuth connection refreshed.')}
              className="flex-1 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-xs font-medium text-fg transition-colors"
            >
              Sync Repos
            </button>
            <button
              onClick={() => toast.info('Disconnected GitHub integration.')}
              className="py-1.5 px-3 rounded-lg text-xs text-ink-faint hover:text-red-400 hover:bg-red-500/10 transition-colors font-mono"
            >
              Disconnect
            </button>
          </div>
        </div>

        {/* AI Model & Copilot Provider */}
        <div className="glass-panel rounded-xl p-5 border border-white/[0.05] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="w-4 h-4 text-accent-bright" />
              <h3 className="font-semibold text-xs text-fg">AI Intelligence Engine</h3>
            </div>

            <p className="text-2xs text-secondary mb-2.5 leading-relaxed">
              Provider used by "Max" for live judging simulations, criteria evaluation, and plan triage:
            </p>

            <div className="space-y-1.5 text-xs">
              {[
                { id: 'anthropic', label: 'Anthropic Claude 3.5 Sonnet', desc: 'Superior nuanced code and judging analysis (Recommended)' },
                { id: 'openai', label: 'OpenAI GPT-4o', desc: 'Fast multimodal evaluation' },
                { id: 'edge', label: 'Supabase Edge Functions', desc: 'Secure backend proxy' },
                { id: 'mock', label: 'Local Deterministic Provider', desc: 'Offline zero-key demo simulation' },
              ].map((prov) => (
                <div
                  key={prov.id}
                  onClick={() => {
                    setSelectedProvider(prov.id);
                    toast.success(`Selected ${prov.label} as AI provider.`);
                  }}
                  className={`p-2.5 rounded-lg cursor-pointer border transition-all ${
                    selectedProvider === prov.id
                      ? 'bg-accent/10 border-accent/30 text-fg'
                      : 'bg-white/[0.02] border-white/[0.05] text-ink-muted hover:text-fg hover:border-white/[0.10]'
                  }`}
                >
                  <p className="font-medium text-xs text-fg">{prov.label}</p>
                  <p className="text-2xs text-ink-faint mt-0.5">{prov.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System & Demo Mode */}
        <div className="glass-panel rounded-xl p-5 border border-white/[0.05] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <SlidersHorizontal className="w-4 h-4 text-accent-bright" />
              <h3 className="font-semibold text-xs text-fg">Demo & Offline Engine</h3>
            </div>

            <div className="space-y-2.5 text-xs">
              {/* Demo Mode Row */}
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
                <div>
                  <p className="font-medium text-fg text-xs">Demo Mode</p>
                  <p className="text-2xs text-ink-faint mt-0.5">
                    Pre-seeds Autonomous Agents Hackathon and mock telemetry.
                  </p>
                </div>
                <button onClick={toggleDemo} className="text-accent-bright transition-transform active:scale-90">
                  {state.demoMode ? (
                    <ToggleRight className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-ink-faint" />
                  )}
                </button>
              </div>

              {/* Notifications preferences */}
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05] space-y-2 font-mono">
                <p className="font-medium text-fg text-xs font-sans">Notification Preferences</p>
                <div className="flex items-center justify-between text-secondary text-2xs">
                  <span>Urgent deadline warnings (&lt; 24h)</span>
                  <input
                    type="checkbox"
                    checked={notifDeadlines}
                    onChange={() => setNotifDeadlines(!notifDeadlines)}
                    className="accent-blue-500 rounded"
                  />
                </div>
                <div className="flex items-center justify-between text-secondary text-2xs">
                  <span>Max Score lift alerts</span>
                  <input
                    type="checkbox"
                    checked={notifScores}
                    onChange={() => setNotifScores(!notifScores)}
                    className="accent-blue-500 rounded"
                  />
                </div>
                <div className="flex items-center justify-between text-secondary text-2xs">
                  <span>New hackathon matches</span>
                  <input
                    type="checkbox"
                    checked={notifOpps}
                    onChange={() => setNotifOpps(!notifOpps)}
                    className="accent-blue-500 rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}