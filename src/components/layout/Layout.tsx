import { useState } from 'react';
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
} from 'lucide-react';
import CommandPalette from '@/components/common/CommandPalette';
import CopilotDrawer from '@/components/copilot/CopilotDrawer';
import { toast } from 'sonner';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Command Center' },
  { to: '/hackathons', icon: FlaskConical, label: 'Hackathons' },
  { to: '/projects', icon: FolderGit2, label: 'Projects & DNA' },
  { to: '/judge', icon: Scale, label: 'Judge Mode' },
  { to: '/opportunities', icon: Target, label: 'Opportunities' },
  { to: '/analytics', icon: TrendingUp, label: 'Analytics' },
  { to: '/github', icon: Github, label: 'GitHub Telemetry' },
  { to: '/settings', icon: Settings, label: 'Settings' },
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

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg text-fg">
      {/* Sidebar */}
      <aside
        className={cn(
          'glass border-r border-border flex flex-col transition-all duration-300 z-20 shrink-0 select-none',
          sidebarOpen ? 'w-60' : 'w-16'
        )}
      >
        {/* Sidebar Brand */}
        <div className="flex items-center justify-between p-4 border-b border-border h-14">
          {sidebarOpen ? (
            <div
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center text-accent group-hover:scale-105 transition-transform">
                <Zap className="w-4 h-4 fill-accent" />
              </div>
              <div>
                <span className="font-bold text-fg text-base tracking-tight block">HackMax</span>
                <span className="text-[10px] text-muted block -mt-1 font-mono">MVP • AI Command</span>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate('/')}
              className="mx-auto w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center text-accent"
            >
              <Zap className="w-4 h-4 fill-accent" />
            </button>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-elevated transition-colors text-secondary hover:text-fg"
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to || (to === '/dashboard' && location.pathname === '/');
            return (
              <NavLink
                key={to}
                to={to}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                  isActive
                    ? 'bg-accent/15 text-accent-light border border-accent/25 shadow-sm'
                    : 'text-secondary hover:text-fg hover:bg-elevated'
                )}
                title={!sidebarOpen ? label : undefined}
              >
                <Icon className={cn('w-4 h-4 shrink-0 transition-colors', isActive ? 'text-accent-light' : 'text-secondary group-hover:text-fg')} />
                {sidebarOpen && <span>{label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Active Hackathon Widget */}
        {sidebarOpen && primaryHackathon && (
          <div className="p-3 m-3 rounded-xl bg-elevated/60 border border-border/80">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-accent animate-pulse" />
                <span className="text-[10px] text-muted uppercase tracking-wider font-semibold">Active Hackathon</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
            </div>
            <p className="text-xs text-fg font-semibold truncate" title={primaryHackathon.title}>
              {primaryHackathon.title}
            </p>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/60">
              <span className="text-[11px] font-mono text-accent-light">
                {Math.round(hoursRemaining)}h left
              </span>
              <span className="text-[11px] font-mono font-bold text-fg">
                Score: <span className="text-accent-light">{liveMaxScore}</span>/100
              </span>
            </div>
          </div>
        )}
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-surface/70 backdrop-blur-md shrink-0 z-10">
          {/* Left search / command palette trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-elevated border border-border text-xs text-secondary hover:text-fg hover:border-accent/40 transition-all w-64 text-left"
            >
              <Search className="w-3.5 h-3.5 text-muted" />
              <span className="flex-1 text-muted truncate">Search or jump to...</span>
              <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px] font-mono text-muted">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Ask Max Copilot header trigger */}
            <button
              onClick={() => setCopilotOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/15 border border-accent/30 text-accent-light text-xs font-semibold hover:bg-accent/25 transition-all shadow-sm group"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
              <span>Ask Max</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-accent/20 text-accent-bright font-mono">
                AI
              </span>
            </button>

            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-lg hover:bg-elevated text-secondary hover:text-fg transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" />
                )}
              </button>

              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-surface border border-border rounded-xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-border mb-2">
                    <h4 className="text-xs font-bold text-fg">Notifications</h4>
                    <span className="text-[10px] text-muted">{unreadNotifs.length} new</span>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {state.notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-lg text-xs transition-colors ${
                          n.read ? 'bg-elevated/40 text-muted' : 'bg-accent/10 border border-accent/20 text-fg'
                        }`}
                      >
                        <p>{n.text}</p>
                        {!n.read && (
                          <button
                            onClick={() => dispatch({ type: 'mark_notification_read', id: n.id })}
                            className="text-[10px] text-accent-light hover:underline mt-1 block"
                          >
                            Mark as read
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
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent-light hover:bg-accent/20 transition-colors"
              title="Click to toggle Demo Mode"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span>Demo Mode</span>
              {state.demoMode ? (
                <ToggleRight className="w-3.5 h-3.5 text-accent" />
              ) : (
                <ToggleLeft className="w-3.5 h-3.5 text-muted" />
              )}
            </button>

            {/* User Profile avatar */}
            <div
              onClick={() => navigate('/settings')}
              className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-xs font-bold text-accent-light cursor-pointer hover:border-accent transition-colors"
              title="Profile & Settings"
            >
              {state.profile.fullName.charAt(0)}
            </div>
          </div>
        </header>

        {/* Dynamic Page Outlet */}
        <div className="flex-1 overflow-y-auto p-6 relative">
          <Outlet />

          {/* Floating Ask Max Button in bottom right */}
          <button
            onClick={() => setCopilotOpen(true)}
            className="fixed bottom-6 right-6 z-30 flex items-center gap-2 px-4 py-2.5 rounded-full bg-accent text-white shadow-glow hover:bg-accent-bright transition-all transform hover:scale-105"
          >
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            <span className="text-xs font-bold tracking-wide">Ask Max</span>
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