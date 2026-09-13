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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={() => onOpenChange(false)} />
      <div className="relative w-full max-w-xl glass-elevated border border-white/[0.12] chamfer-top rounded-2xl shadow-2xl overflow-hidden z-10 mx-4 animate-in zoom-in-95 duration-150">
        <Command label="Global Command Palette" className="w-full flex flex-col">
          <div className="flex items-center px-4 py-3.5 border-b border-white/[0.08] bg-white/[0.02]">
            <Search className="w-4 h-4 text-accent shrink-0 mr-3" />
            <Command.Input
              placeholder="Type a command or jump to page... (Esc to close)"
              className="w-full bg-transparent text-sm text-white placeholder:text-muted focus:outline-none"
              autoFocus
            />
            <kbd className="px-2 py-0.5 rounded-lg bg-surface-3 border border-white/[0.08] text-[10px] font-mono text-muted">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-88 overflow-y-auto p-2.5 text-sm text-secondary space-y-1.5 no-scrollbar">
            <Command.Empty className="p-6 text-center text-xs text-muted">
              No matching commands or pages found.
            </Command.Empty>

            {/* Quick AI & Task Actions */}
            <Command.Group
              heading="High-Impact AI Actions"
              className="px-2 py-1 text-[10px] font-bold text-muted uppercase tracking-wider font-mono"
            >
              {nextTask && (
                <Command.Item
                  onSelect={() =>
                    runCommand(() => {
                      completeTask(nextTask.id);
                      toast.success(`Completed highest-impact action: ${nextTask.title}`);
                    })
                  }
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-white hover:bg-accent/15 hover:border-accent/30 border border-transparent transition-all group"
                >
                  <Flame className="w-4 h-4 text-accent shrink-0 group-hover:scale-110 transition-transform" />
                  <div className="flex-1 truncate">
                    <span className="font-semibold text-xs">Execute Next Action: </span>
                    <span className="text-secondary text-xs">{nextTask.title}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/20 text-accent-bright font-mono font-bold">
                    +6 Pts Lift
                  </span>
                </Command.Item>
              )}

              <Command.Item
                onSelect={() =>
                  runCommand(() => {
                    onOpenCopilot();
                  })
                }
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-white hover:bg-white/[0.06] border border-transparent transition-all group"
              >
                <Sparkles className="w-4 h-4 text-accent animate-pulse shrink-0" />
                <span className="font-semibold text-xs flex-1">Ask Max (AI Copilot Drawer)</span>
                <kbd className="text-[10px] font-mono text-muted px-1.5 py-0.5 rounded bg-surface-3">
                  Alt+M
                </kbd>
              </Command.Item>

              {cuttableTasks.length > 0 && (
                <Command.Item
                  onSelect={() =>
                    runCommand(() => {
                      cuttableTasks.forEach((t) => cutTask(t.id));
                      toast.warning(`Cut ${cuttableTasks.length} non-essential tasks! Freeing demo time.`);
                    })
                  }
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-white hover:bg-red-500/10 border border-transparent transition-all group"
                >
                  <Scissors className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="font-semibold text-xs flex-1">
                    Trim {cuttableTasks.length} Non-Essential Tasks
                  </span>
                  <span className="text-[10px] font-mono text-red-400">Save ~120m</span>
                </Command.Item>
              )}

              <Command.Item
                onSelect={() =>
                  runCommand(() => {
                    toggleDemo();
                    toast.info(`Demo Mode ${!state.demoMode ? 'enabled' : 'disabled'}`);
                  })
                }
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-white hover:bg-white/[0.06] border border-transparent transition-all"
              >
                <ToggleLeft className="w-4 h-4 text-yellow-400 shrink-0" />
                <span className="text-xs">Toggle Demo Mode (currently {state.demoMode ? 'ON' : 'OFF'})</span>
              </Command.Item>
            </Command.Group>

            <Command.Separator className="my-1.5 border-b border-white/[0.06]" />

            {/* Navigation Group */}
            <Command.Group
              heading="Jump to View (Chords: G + [Key])"
              className="px-2 py-1 text-[10px] font-bold text-muted uppercase tracking-wider font-mono"
            >
              {[
                { to: '/dashboard', label: 'Command Center', icon: LayoutDashboard, chord: 'G D' },
                { to: '/hackathons', label: 'My Hackathons', icon: FlaskConical, chord: 'G H' },
                { to: '/projects', label: 'Projects & DNA', icon: FolderGit2, chord: 'G P' },
                { to: '/judge', label: 'Judge Mode (AI Simulation)', icon: Scale, chord: 'G J' },
                { to: '/opportunities', label: 'Opportunities & Reuse', icon: Target, chord: 'G O' },
                { to: '/analytics', label: 'Analytics & Trajectory', icon: TrendingUp, chord: 'G A' },
                { to: '/github', label: 'GitHub Telemetry', icon: Github, chord: 'G T' },
                { to: '/settings', label: 'Settings', icon: Settings, chord: 'G S' },
              ].map(({ to, label, icon: Icon, chord }) => (
                <Command.Item
                  key={to}
                  onSelect={() => runCommand(() => navigate(to))}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer text-secondary hover:text-white hover:bg-white/[0.05] transition-colors"
                >
                  <Icon className="w-4 h-4 text-muted shrink-0" />
                  <span className="text-xs font-medium flex-1">{label}</span>
                  <kbd className="text-[10px] font-mono text-muted px-1.5 py-0.5 rounded bg-surface-3">
                    {chord}
                  </kbd>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>

          <div className="px-4 py-2.5 border-t border-white/[0.08] bg-white/[0.02] flex items-center justify-between text-[11px] text-muted font-mono">
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-surface-3 border border-white/[0.06]">↑↓</span>
              <span>Navigate</span>
              <span className="px-1.5 py-0.5 rounded bg-surface-3 border border-white/[0.06]">↵</span>
              <span>Select</span>
            </div>
            <span>HackMax Engine • 2026</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
