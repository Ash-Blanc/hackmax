import { useEffect } from 'react';
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
  Zap,
  CheckCircle2,
  Sparkles,
  ToggleLeft,
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
  const { nextTask, completeTask, toggleDemo, state } = useHackMaxStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  const runCommand = (command: () => void) => {
    onOpenChange(false);
    command();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={() => onOpenChange(false)} />
      <div className="relative w-full max-w-xl bg-surface border border-border rounded-xl shadow-2xl overflow-hidden z-10 mx-4">
        <Command label="Global Command Palette" className="w-full flex flex-col">
          <div className="flex items-center px-4 border-b border-border">
            <Zap className="w-4 h-4 text-accent shrink-0 mr-2" />
            <Command.Input
              placeholder="Type a command or jump to page... (Esc to close)"
              className="w-full py-3.5 bg-transparent text-sm text-fg placeholder:text-muted focus:outline-none"
              autoFocus
            />
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2 text-sm text-secondary space-y-1">
            <Command.Empty className="p-4 text-center text-xs text-muted">
              No results found.
            </Command.Empty>

            <Command.Group heading="Quick Actions" className="px-2 py-1 text-[11px] font-semibold text-muted uppercase tracking-wider">
              {nextTask && (
                <Command.Item
                  onSelect={() =>
                    runCommand(() => {
                      completeTask(nextTask.id);
                      toast.success(`Completed highest-impact task: ${nextTask.title}`);
                    })
                  }
                  className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-fg hover:bg-elevated hover:text-accent-light transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <div className="flex-1 truncate">
                    <span className="font-medium">Complete Next Action: </span>
                    <span className="text-muted">{nextTask.title}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-accent/10 text-accent-light">Impact</span>
                </Command.Item>
              )}

              <Command.Item
                onSelect={() =>
                  runCommand(() => {
                    onOpenCopilot();
                  })
                }
                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-fg hover:bg-elevated hover:text-accent-light transition-colors"
              >
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="font-medium">Ask Max (AI Copilot Drawer)</span>
                <span className="text-[10px] text-muted ml-auto">Alt+M</span>
              </Command.Item>

              <Command.Item
                onSelect={() =>
                  runCommand(() => {
                    toggleDemo();
                    toast.info(`Demo Mode ${!state.demoMode ? 'enabled' : 'disabled'}`);
                  })
                }
                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-fg hover:bg-elevated hover:text-accent-light transition-colors"
              >
                <ToggleLeft className="w-4 h-4 text-warn" />
                <span>Toggle Demo Mode (currently {state.demoMode ? 'ON' : 'OFF'})</span>
              </Command.Item>
            </Command.Group>

            <Command.Separator className="my-1 border-b border-border/60" />

            <Command.Group heading="Navigation" className="px-2 py-1 text-[11px] font-semibold text-muted uppercase tracking-wider">
              <Command.Item
                onSelect={() => runCommand(() => navigate('/dashboard'))}
                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-fg hover:bg-elevated hover:text-accent-light transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-secondary" />
                <span>Command Center (Dashboard)</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/hackathons'))}
                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-fg hover:bg-elevated hover:text-accent-light transition-colors"
              >
                <FlaskConical className="w-4 h-4 text-secondary" />
                <span>My Hackathons</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/projects'))}
                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-fg hover:bg-elevated hover:text-accent-light transition-colors"
              >
                <FolderGit2 className="w-4 h-4 text-secondary" />
                <span>Projects & DNA</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/judge'))}
                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-fg hover:bg-elevated hover:text-accent-light transition-colors"
              >
                <Scale className="w-4 h-4 text-secondary" />
                <span>Judge Mode (AI Simulation)</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/opportunities'))}
                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-fg hover:bg-elevated hover:text-accent-light transition-colors"
              >
                <Target className="w-4 h-4 text-secondary" />
                <span>Opportunities & Reuse</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/analytics'))}
                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-fg hover:bg-elevated hover:text-accent-light transition-colors"
              >
                <TrendingUp className="w-4 h-4 text-secondary" />
                <span>Analytics & Trajectory</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/github'))}
                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-fg hover:bg-elevated hover:text-accent-light transition-colors"
              >
                <Github className="w-4 h-4 text-secondary" />
                <span>GitHub Telemetry</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/settings'))}
                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-fg hover:bg-elevated hover:text-accent-light transition-colors"
              >
                <Settings className="w-4 h-4 text-secondary" />
                <span>Settings</span>
              </Command.Item>
            </Command.Group>
          </Command.List>

          <div className="px-4 py-2 border-t border-border bg-elevated/40 flex items-center justify-between text-[11px] text-muted">
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-surface border border-border">↑↓</span>
              <span>to navigate</span>
              <span className="px-1.5 py-0.5 rounded bg-surface border border-border">↵</span>
              <span>to select</span>
            </div>
            <span>HackMax Command Center</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
