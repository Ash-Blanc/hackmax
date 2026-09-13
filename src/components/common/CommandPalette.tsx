import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import {
  LayoutDashboard,
  FlaskConical,
  FolderGit2,
  Scale,
  Target,
  TrendingUp,
  Github,
  Settings,
  Sparkles,
  ToggleLeft,
  Search,
  Scissors,
  Flame,
} from 'lucide-react';
import { useHackMaxStore } from '@/lib/store';
import { toast } from 'sonner';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenCopilot: () => void;
}

export default function CommandPalette({ open, onOpenChange, onOpenCopilot }: CommandPaletteProps) {
  const navigate = useNavigate();
  const { nextTask, completeTask, toggleDemo, state, primaryHackathon, cutTask } = useHackMaxStore();
  const lastKeyRef = useRef<string | null>(null);
  const keyTimerRef = useRef<number | null>(null);

  // Global keyboard shortcuts (⌘K + G-chords)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Command Palette with ⌘K or Ctrl+K
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
        return;
      }

      // If user is currently typing in an input or palette is open, ignore G-chords
      const activeEl = document.activeElement?.tagName;
      if (open || ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeEl || '')) {
        return;
      }

      // Check for two-key chords starting with 'g'
      if (lastKeyRef.current === 'g') {
        const key = e.key.toLowerCase();
        let navigated = false;

        if (key === 'd') {
          navigate('/dashboard');
          toast.info('Jumped to Command Center (G D)');
          navigated = true;
        } else if (key === 'h') {
          navigate('/hackathons');
          toast.info('Jumped to Hackathons (G H)');
          navigated = true;
        } else if (key === 'p') {
          navigate('/projects');
          toast.info('Jumped to Projects & DNA (G P)');
          navigated = true;
        } else if (key === 'j') {
          navigate('/judge');
          toast.info('Jumped to Judge Mode (G J)');
          navigated = true;
        } else if (key === 'o') {
          navigate('/opportunities');
          toast.info('Jumped to Opportunities (G O)');
          navigated = true;
        } else if (key === 'a') {
          navigate('/analytics');
          toast.info('Jumped to Analytics (G A)');
          navigated = true;
        } else if (key === 's') {
          navigate('/settings');
          toast.info('Jumped to Settings (G S)');
          navigated = true;
        }

        lastKeyRef.current = null;
        if (keyTimerRef.current) clearTimeout(keyTimerRef.current);
        if (navigated) e.preventDefault();
        return;
      }

      if (e.key.toLowerCase() === 'g' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        lastKeyRef.current = 'g';
        if (keyTimerRef.current) clearTimeout(keyTimerRef.current);
        keyTimerRef.current = window.setTimeout(() => {
          lastKeyRef.current = null;
        }, 1200);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange, navigate]);

  const runCommand = (command: () => void) => {
    onOpenChange(false);
    command();
  };

  const cuttableTasks = state.tasks.filter(
    (t) =>
      t.hackathonId === primaryHackathon?.id &&
      (t.stage === 'LATER' || t.impactLevel === 'LOW') &&
      t.status !== 'done' &&
      t.status !== 'cut'
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-24 bg-black/60 backdrop-blur-md animate-fade-up">
      <div className="fixed inset-0" onClick={() => onOpenChange(false)} />
      <div className="relative w-full max-w-lg bg-bg-raised/95 border border-white/[0.08] rounded-xl shadow-overlay overflow-hidden z-10 mx-4">
        <Command label="Global Command Palette" className="w-full flex flex-col">
          {/* Top Search Input (Raycast seamless style) */}
          <div className="flex items-center px-3.5 py-3 border-b border-white/[0.06] bg-bg/50">
            <Search className="w-4 h-4 text-ink-faint shrink-0 mr-2.5" />
            <Command.Input
              placeholder="Search actions, views, commands… (Esc to close)"
              className="w-full bg-transparent text-[13px] text-fg placeholder:text-ink-faint focus:outline-none"
              autoFocus
            />
            <span className="keycap">ESC</span>
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2 text-xs text-secondary space-y-1 no-scrollbar">
            <Command.Empty className="p-6 text-center text-2xs text-ink-faint">
              No matching commands found.
            </Command.Empty>

            {/* Quick AI & Task Actions */}
            <Command.Group
              heading="High-Impact Actions"
              className="px-2 py-1 text-2xs font-semibold text-ink-faint uppercase tracking-wider font-mono"
            >
              {nextTask && (
                <Command.Item
                  onSelect={() =>
                    runCommand(() => {
                      completeTask(nextTask.id);
                      toast.success(`Completed highest-impact action: ${nextTask.title}`);
                    })
                  }
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-fg hover:bg-white/[0.04] transition-colors group"
                >
                  <Flame className="w-3.5 h-3.5 text-accent-bright shrink-0" />
                  <div className="flex-1 truncate">
                    <span className="font-medium text-xs">Execute Next: </span>
                    <span className="text-ink-muted text-xs">{nextTask.title}</span>
                  </div>
                  <span className="text-2xs px-1.5 py-0.5 rounded-md bg-accent/15 text-accent-bright font-mono font-medium">
                    +6 Pts
                  </span>
                </Command.Item>
              )}

              <Command.Item
                onSelect={() =>
                  runCommand(() => {
                    onOpenCopilot();
                  })
                }
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-fg hover:bg-white/[0.04] transition-colors group"
              >
                <Sparkles className="w-3.5 h-3.5 text-accent-bright shrink-0" />
                <span className="font-medium text-xs flex-1">Ask Max (AI Copilot)</span>
                <span className="keycap">⌥M</span>
              </Command.Item>

              {cuttableTasks.length > 0 && (
                <Command.Item
                  onSelect={() =>
                    runCommand(() => {
                      cuttableTasks.forEach((t) => cutTask(t.id));
                      toast.warning(`Cut ${cuttableTasks.length} non-essential tasks!`);
                    })
                  }
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-fg hover:bg-red-500/10 transition-colors group"
                >
                  <Scissors className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span className="font-medium text-xs flex-1">
                    Trim {cuttableTasks.length} Non-Essential Tasks
                  </span>
                  <span className="text-2xs font-mono text-red-400">Save ~120m</span>
                </Command.Item>
              )}

              <Command.Item
                onSelect={() =>
                  runCommand(() => {
                    toggleDemo();
                    toast.info(`Demo Mode ${!state.demoMode ? 'enabled' : 'disabled'}`);
                  })
                }
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-fg hover:bg-white/[0.04] transition-colors"
              >
                <ToggleLeft className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-xs">Toggle Demo Mode ({state.demoMode ? 'ON' : 'OFF'})</span>
              </Command.Item>
            </Command.Group>

            <Command.Separator className="my-1 border-b border-white/[0.04]" />

            {/* Navigation Group */}
            <Command.Group
              heading="Jump to View (Chords)"
              className="px-2 py-1 text-2xs font-semibold text-ink-faint uppercase tracking-wider font-mono"
            >
              {[
                { to: '/dashboard', label: 'Command Center', icon: LayoutDashboard, chord: 'G D' },
                { to: '/hackathons', label: 'My Hackathons', icon: FlaskConical, chord: 'G H' },
                { to: '/projects', label: 'Projects & DNA', icon: FolderGit2, chord: 'G P' },
                { to: '/judge', label: 'Judge Mode', icon: Scale, chord: 'G J' },
                { to: '/opportunities', label: 'Opportunities & Reuse', icon: Target, chord: 'G O' },
                { to: '/analytics', label: 'Analytics & Trajectory', icon: TrendingUp, chord: 'G A' },
                { to: '/github', label: 'GitHub Telemetry', icon: Github, chord: 'G T' },
                { to: '/settings', label: 'Settings', icon: Settings, chord: 'G S' },
              ].map(({ to, label, icon: Icon, chord }) => (
                <Command.Item
                  key={to}
                  onSelect={() => runCommand(() => navigate(to))}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-ink-muted hover:text-fg hover:bg-white/[0.04] transition-colors"
                >
                  <Icon className="w-3.5 h-3.5 text-ink-faint shrink-0" />
                  <span className="text-xs font-normal flex-1">{label}</span>
                  <span className="keycap">{chord}</span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>

          <div className="px-3.5 py-2 border-t border-white/[0.05] bg-bg/50 flex items-center justify-between text-2xs text-ink-faint font-mono">
            <div className="flex items-center gap-2">
              <span className="keycap">↑↓</span>
              <span>Navigate</span>
              <span className="keycap">↵</span>
              <span>Select</span>
            </div>
            <span>HackMax</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
