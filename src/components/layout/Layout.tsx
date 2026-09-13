import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useHackMaxStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FlaskConical,
  FolderGit2,
  Scale,
  Target,
  TrendingUp,
  Github,
  Settings,
  Menu,
  X,
  Zap,
  Clock,
  Search,
  Bell,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Cpu,
} from 'lucide-react';
import CommandPalette from '@/components/common/CommandPalette';
import CopilotDrawer from '@/components/copilot/CopilotDrawer';
import { toast } from 'sonner';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Command Center', shortcut: '⌘1' },
  { to: '/hackathons', icon: FlaskConical, label: 'Hackathons', shortcut: '⌘2' },
  { to: '/projects', icon: FolderGit2, label: 'Projects & DNA', shortcut: '⌘3' },
  { to: '/judge', icon: Scale, label: 'Judge Mode', shortcut: '⌘4' },
  { to: '/opportunities', icon: Target, label: 'Opportunities', shortcut: '⌘5' },
  { to: '/analytics', icon: TrendingUp, label: 'Analytics', shortcut: '⌘6' },
  { to: '/github', icon: Github, label: 'GitHub Telemetry', shortcut: '⌘7' },
  { to: '/settings', icon: Settings, label: 'Settings', shortcut: '⌘8' },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const { state, primaryHackathon, liveMaxScore, hoursRemaining, toggleDemo, dispatch } = useHackMaxStore();
  const navigate = useNavigate();
  const location = useLocation();

  const unreadNotifs = state.notifications.filter((n) => !n.read);

  // Global key combo listeners: Alt+M to open Copilot, ⌘1-8 for quick nav
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Alt+M or Ctrl+J
      if ((e.altKey && e.key.toLowerCase() === 'm') || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j')) {
        e.preventDefault();
        setCopilotOpen((prev) => !prev);
      }

      // Check for ⌘1 through ⌘8 when not inside an input/textarea
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes((document.activeElement?.tagName || ''));
      if (!isInput && (e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey) {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= navItems.length) {
          const targetItem = navItems[num - 1];
          if (targetItem) {
            e.preventDefault();
            navigate(targetItem.to);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <div className="flex h-screen w-screen overflow-hidden ambient-canvas text-fg selection:bg-accent/30 selection:text-white">
      {/* Sidebar */}
      <aside
        className={cn(
          'glass-panel border-r border-white/[0.06] flex flex-col transition-all duration-300 z-20 shrink-0 select-none backdrop-blur-2xl relative',
          sidebarOpen ? 'w-64' : 'w-[68px]'
        )}
      >
        {/* Sidebar Brand */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-white/[0.06]">
          {sidebarOpen ? (
            <div
              onClick={() => navigate('/')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent to-indigo-500 p-0.5 shadow-glow flex items-center justify-center group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#0d0f17] rounded-[10px] flex items-center justify-center">
                  <Zap className="w-4 h-4 text-accent fill-accent" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-white text-base tracking-tight block">HackMax</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-accent/20 border border-accent/30 text-accent-bright font-mono font-semibold">
                    v0.2
                  </span>
                </div>
                <span className="text-[10px] text-muted block -mt-0.5 font-mono tracking-wide uppercase">
                  Agentic Command
                </span>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate('/')}
              className="mx-auto w-9 h-9 rounded-xl bg-gradient-to-tr from-accent to-indigo-500 p-0.5 shadow-glow flex items-center justify-center"
              title="HackMax Home"
            >
              <div className="w-full h-full bg-[#0d0f17] rounded-[10px] flex items-center justify-center">
                <Zap className="w-4 h-4 text-accent fill-accent" />
              </div>
            </button>
          )}

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors text-secondary hover:text-white"
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
          {navItems.map(({ to, icon: Icon, label, shortcut }) => {
            const isActive = location.pathname === to || (to === '/dashboard' && location.pathname === '/');
            return (
              <NavLink
                key={to}
                to={to}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group relative',
                  isActive
                    ? 'bg-accent/15 text-accent-light border border-accent/30 shadow-glow font-semibold'
                    : 'text-secondary hover:text-white hover:bg-white/[0.04]'
                )}
                title={!sidebarOpen ? `${label} (${shortcut})` : undefined}
              >
                {/* Active left indicator glow */}
                {isActive && (
                  <span className="absolute left-1 w-1 h-5 rounded-full bg-accent shadow-glow" />
                )}
                <Icon
                  className={cn(
                    'w-4 h-4 shrink-0 transition-colors',
                    isActive ? 'text-accent-light' : 'text-secondary group-hover:text-white'
                  )}
                />
                {sidebarOpen && (
                  <div className="flex-1 flex items-center justify-between truncate">
                    <span className="truncate">{label}</span>
                    <span className="text-[10px] font-mono text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                      {shortcut}
                    </span>
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Active Hackathon Widget */}
        {sidebarOpen && primaryHackathon && (
          <div className="p-3 m-3 rounded-2xl bg-[#131622]/80 border border-white/[0.08] chamfer-top shadow-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[10px] text-muted uppercase tracking-wider font-semibold font-mono">
                  Active Sprint
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                Live
              </span>
            </div>

            <p className="text-xs text-white font-semibold truncate" title={primaryHackathon.title}>
              {primaryHackathon.title}
            </p>

            <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/[0.06]">
              <span className="text-[11px] font-mono text-red-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-red-400" />
                {Math.round(hoursRemaining)}h left
              </span>
              <div className="text-[11px] font-mono font-bold text-fg">
                <span className="text-accent-bright">{liveMaxScore}</span>
                <span className="text-muted text-[10px]">/100</span>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 border-b border-white/[0.06] flex items-center justify-between px-6 glass-panel shrink-0 z-10">
          {/* Left search & quick command trigger */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#131622]/80 border border-white/[0.08] text-xs text-secondary hover:text-white hover:border-accent/40 transition-all w-64 md:w-80 text-left shadow-sm group"
            >
              <Search className="w-3.5 h-3.5 text-muted group-hover:text-accent transition-colors" />
              <span className="flex-1 text-muted text-xs truncate">Search commands, pages, tasks...</span>
              <kbd className="px-2 py-0.5 rounded-lg bg-surface-3 border border-white/[0.08] text-[10px] font-mono text-secondary">
                ⌘K
              </kbd>
            </button>

            {/* Ambient Intelligence Indicator */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-mono">
              <Cpu className="w-3.5 h-3.5 animate-pulse" />
              <span>Max Engine: Synced</span>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Ask Max Copilot header trigger */}
            <button
              onClick={() => setCopilotOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-accent to-indigo-600 hover:from-accent-bright hover:to-indigo-500 text-white text-xs font-semibold shadow-glow transition-all active:scale-95 group"
            >
              <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
              <span>Ask Max</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.2 rounded bg-black/25 text-[10px] font-mono text-white/80">
                Alt+M
              </kbd>
            </button>

            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2.5 rounded-xl hover:bg-white/[0.06] text-secondary hover:text-white transition-colors border border-transparent hover:border-white/[0.06]"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent shadow-glow" />
                )}
              </button>

              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-3 w-88 glass-elevated rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-3">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">Notifications</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/20 text-accent-bright font-mono">
                        {unreadNotifs.length} new
                      </span>
                    </div>
                    {unreadNotifs.length > 0 && (
                      <button
                        onClick={() => {
                          unreadNotifs.forEach((n) =>
                            dispatch({ type: 'mark_notification_read', id: n.id })
                          );
                          toast.success('Marked all notifications as read');
                        }}
                        className="text-[10px] text-muted hover:text-accent-light"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="space-y-2.5 max-h-72 overflow-y-auto no-scrollbar">
                    {state.notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 rounded-xl text-xs transition-colors border ${
                          n.read
                            ? 'bg-white/[0.02] border-transparent text-muted'
                            : 'bg-accent/10 border-accent/25 text-white'
                        }`}
                      >
                        <p className="leading-relaxed">{n.text}</p>
                        {!n.read && (
                          <button
                            onClick={() => dispatch({ type: 'mark_notification_read', id: n.id })}
                            className="text-[10px] text-accent-light hover:underline mt-1.5 font-medium block"
                          >
                            Mark as read →
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Demo Mode Toggle */}
            <button
              onClick={() => {
                toggleDemo();
                toast.info(`Demo Mode is now ${!state.demoMode ? 'Active' : 'Disabled'}`);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#131622]/80 border border-white/[0.08] text-xs text-secondary hover:text-white transition-colors"
              title="Click to toggle Demo Mode"
            >
              <span className={`w-2 h-2 rounded-full ${state.demoMode ? 'bg-emerald-400 animate-pulse' : 'bg-muted'}`} />
              <span className="font-mono text-[11px]">Demo Mode</span>
              {state.demoMode ? (
                <ToggleRight className="w-4 h-4 text-emerald-400" />
              ) : (
                <ToggleLeft className="w-4 h-4 text-muted" />
              )}
            </button>

            {/* User Profile avatar */}
            <div
              onClick={() => navigate('/settings')}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent/30 to-indigo-500/20 border border-accent/40 flex items-center justify-center text-xs font-bold text-accent-light cursor-pointer hover:border-accent hover:shadow-glow transition-all"
              title="Profile & Settings"
            >
              {state.profile.fullName.charAt(0)}
            </div>
          </div>
        </header>

        {/* Dynamic Page Outlet */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 relative">
          <Outlet />

          {/* Floating Ask Max Capsule in bottom right */}
          <button
            onClick={() => setCopilotOpen(true)}
            className="fixed bottom-6 right-6 z-30 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-accent to-indigo-600 text-white shadow-glow hover:shadow-glow-lg border border-white/20 transition-all hover:scale-105 active:scale-95 group"
            title="Open AI Copilot (Alt+M)"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="text-xs font-bold tracking-wide">Ask Max</span>
            <span className="px-1.5 py-0.2 rounded bg-white/20 text-[10px] font-mono opacity-80 group-hover:opacity-100">
              Alt+M
            </span>
          </button>
        </div>
      </main>

      {/* Global Command Palette */}
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
        onOpenCopilot={() => setCopilotOpen(true)}
      />

      {/* Global Ask Max Copilot Drawer */}
      <CopilotDrawer open={copilotOpen} onClose={() => setCopilotOpen(false)} />
    </div>
  );
}