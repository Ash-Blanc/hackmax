import { useState } from 'react';
import { useHackMaxStore } from '@/lib/store';
import {
  Settings2,
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
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-2 border-b border-border/60">
        <h1 className="text-2xl font-bold text-fg tracking-tight">Settings</h1>
        <p className="text-secondary text-xs mt-1">
          Manage your hacker profile, GitHub integration, AI model provider, and system preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Profile Card */}
        <div className="glass rounded-2xl p-6 border-border flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-accent" />
              <h3 className="font-bold text-sm text-fg">Profile & Identity</h3>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-secondary mb-1 uppercase text-[10px] font-semibold">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg bg-elevated border border-border text-fg focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-secondary mb-1 uppercase text-[10px] font-semibold">
                  GitHub Username
                </label>
                <input
                  type="text"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg bg-elevated border border-border text-fg focus:outline-none focus:border-accent"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="py-2 px-4 rounded-lg bg-accent text-white font-semibold text-xs hover:bg-accent-bright shadow-glow transition-all"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* GitHub OAuth Card */}
        <div className="glass rounded-2xl p-6 border-border flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Github className="w-4 h-4 text-accent" />
              <h3 className="font-bold text-sm text-fg">GitHub Integration</h3>
            </div>

            <div className="p-4 rounded-xl bg-elevated border border-border mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-fg">ash-agentic</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/10 border border-success/20 text-success font-medium">
                  ✓ Connected
                </span>
              </div>
              <p className="text-[11px] text-muted leading-relaxed">
                Repository permissions: Read repository metadata, commits, pull requests, and issues.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-border flex gap-2">
            <button
              onClick={() => toast.success('GitHub OAuth connection refreshed.')}
              className="flex-1 py-2 rounded-lg bg-elevated hover:bg-surface border border-border text-xs font-semibold text-fg transition-colors"
            >
              Sync Repos
            </button>
            <button
              onClick={() => toast.info('Disconnected GitHub integration.')}
              className="py-2 px-3 rounded-lg text-xs text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>

        {/* AI Model & Copilot Provider */}
        <div className="glass rounded-2xl p-6 border-border flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="w-4 h-4 text-accent" />
              <h3 className="font-bold text-sm text-fg">AI Intelligence Engine</h3>
            </div>

            <p className="text-xs text-secondary mb-3 leading-relaxed">
              Provider used by "Max" for live judging simulations, criteria evaluation, and plan triage:
            </p>

            <div className="space-y-2 text-xs">
              {[
                { id: 'anthropic', label: 'Anthropic Claude 3.5 Sonnet (Recommended)', desc: 'Superior nuanced code and judging analysis' },
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
                  className={`p-3 rounded-xl cursor-pointer border transition-all ${
                    selectedProvider === prov.id
                      ? 'bg-accent/15 border-accent text-fg'
                      : 'bg-elevated/70 border-border text-secondary hover:text-fg'
                  }`}
                >
                  <p className="font-semibold text-xs text-fg">{prov.label}</p>
                  <p className="text-[10px] text-muted mt-0.5">{prov.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System & Demo Mode */}
        <div className="glass rounded-2xl p-6 border-border flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Settings2 className="w-4 h-4 text-accent" />
              <h3 className="font-bold text-sm text-fg">Demo & Offline Engine</h3>
            </div>

            <div className="space-y-3 text-xs">
              {/* Demo Mode Row */}
              <div className="p-3.5 rounded-xl bg-elevated border border-border flex items-center justify-between">
                <div>
                  <p className="font-semibold text-fg">Demo Mode</p>
                  <p className="text-[10px] text-muted mt-0.5">
                    Pre-seeds Autonomous Agents Hackathon and mock telemetry.
                  </p>
                </div>
                <button onClick={toggleDemo} className="text-accent text-lg">
                  {state.demoMode ? (
                    <ToggleRight className="w-6 h-6 text-accent" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-muted" />
                  )}
                </button>
              </div>

              {/* Notifications preferences */}
              <div className="p-3.5 rounded-xl bg-elevated border border-border space-y-2.5">
                <p className="font-semibold text-fg text-xs">Notification Preferences</p>
                <div className="flex items-center justify-between text-muted text-xs">
                  <span>Urgent deadline warnings (&lt; 24h)</span>
                  <input
                    type="checkbox"
                    checked={notifDeadlines}
                    onChange={() => setNotifDeadlines(!notifDeadlines)}
                    className="accent-indigo-500"
                  />
                </div>
                <div className="flex items-center justify-between text-muted text-xs">
                  <span>Max Score lift alerts</span>
                  <input
                    type="checkbox"
                    checked={notifScores}
                    onChange={() => setNotifScores(!notifScores)}
                    className="accent-indigo-500"
                  />
                </div>
                <div className="flex items-center justify-between text-muted text-xs">
                  <span>New DNA opportunity alerts</span>
                  <input
                    type="checkbox"
                    checked={notifOpps}
                    onChange={() => setNotifOpps(!notifOpps)}
                    className="accent-indigo-500"
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