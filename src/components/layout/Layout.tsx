import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useHackMaxStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import {
  LayoutGrid,
  Layers,
  Boxes,
  Scale,
  Crosshair,
  SlidersHorizontal,
  Menu,
  X,
  Clock,
  Search,
  Bell,
  Sparkles,
  Trophy,
  ChevronDown,
  Plus,
} from 'lucide-react';
import CommandPalette from '@/components/common/CommandPalette';
import CopilotDrawer from '@/components/copilot/CopilotDrawer';
import { CubeLogo } from '@/components/common/CubeLogo';
import { toast } from 'sonner';

const navItems = [
  { to: '/dashboard', icon: LayoutGrid, label: 'Command Center', shortcut: '⌘1' },
  { to: '/workspace', icon: Layers, label: 'Sprint Workspace', shortcut: '⌘2' },
  { to: '/judge', icon: Scale, label: 'AI Practice Judge', shortcut: '⌘3' },
  { to: '/projects', icon: Boxes, label: 'Projects & Code', shortcut: '⌘4' },
  { to: '/opportunities', icon: Crosshair, label: 'Find Hackathons', shortcut: '⌘5' },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [hackathonDropdownOpen, setHackathonDropdownOpen] = useState(false);

  const {
    state,
    primaryHackathon,
    liveMaxScore,
    hoursRemaining,
    toggleDemo,
    setActiveHackathon,
    resetSampleData,
    dispatch,
  } = useHackMaxStore();
  const navigate = useNavigate();
  const location = useLocation();

  const unreadNotifs = state.notifications.filter((n) => !n.read);

  // Global key combo listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'm') || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j')) {
        e.preventDefault();
        setCopilotOpen((prev) => !prev);
      }
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
    <div className="flex h-screen w-screen overflow-hidden bg-bg text-fg selection:bg-accent/25">
      {/* ── Sidebar ── */}
      <aside
        className={cn(
          'flex flex-col border-r border-white/[0.05] bg-bg-raised/80 backdrop-blur-xl transition-all duration-300 ease-spring z-20 shrink-0 select-none',
          sidebarOpen ? 'w-56' : 'w-14'
        )}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-3 h-14 border-b border-white/[0.05]">
          {sidebarOpen ? (
            <div onClick={() => navigate('/')} className="flex items-center gap-2.5 cursor-pointer group">
              <div className="w-7 h-7 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center group-hover:bg-accent/25 transition-all shadow-[0_0_12px_rgba(59,130,246,0.25)]">
                <CubeLogo className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-base font-fenix text-fg tracking-normal block leading-tight">HackMax</span>
                <span className="text-2xs text-accent-cyan/80 font-mono">v0.2</span>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate('/')}
              className="mx-auto w-7 h-7 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center hover:bg-accent/25 transition-all shadow-[0_0_12px_rgba(59,130,246,0.25)]"
              title="HackMax Home"
            >
              <CubeLogo className="w-4.5 h-4.5" />
            </button>
          )}

          {sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded-md hover:bg-white/[0.04] transition-colors text-muted hover:text-secondary"
              title="Collapse sidebar"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto no-scrollbar">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-full flex items-center justify-center p-2 rounded-md hover:bg-white/[0.04] text-muted hover:text-secondary transition-colors mb-2"
              title="Expand sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}

          {navItems.map(({ to, icon: Icon, label, shortcut }) => {
            const isActive = location.pathname === to || (to === '/dashboard' && location.pathname === '/');
            return (
              <NavLink
                key={to}
                to={to}
                className={cn(
                  'flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] transition-all duration-hover group relative',
                  isActive
                    ? 'bg-white/[0.06] text-fg font-medium shadow-ambient'
                    : 'text-ink-muted hover:text-fg hover:bg-white/[0.03]'
                )}
                title={!sidebarOpen ? `${label} (${shortcut})` : undefined}
              >
                {/* Active glow indicator */}
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r-full bg-accent shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                )}
                {/* Icon micro-container */}
                <div
                  className={cn(
                    'w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-all duration-hover',
                    isActive
                      ? 'bg-accent/15 text-accent-bright border border-accent/25 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                      : 'text-ink-faint group-hover:text-ink-body group-hover:bg-white/[0.04]'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                {sidebarOpen && (
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <span className="truncate">{label}</span>
                    <span className="keycap opacity-0 group-hover:opacity-100 transition-opacity">
                      {shortcut}
                    </span>
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Active Sprint Widget */}
        {sidebarOpen && primaryHackathon && (
          <div
            onClick={() => navigate('/workspace')}
            className="mx-2 mb-2 p-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.05] cursor-pointer transition-colors group"
            title="Open Active Sprint Workspace"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                <span className="text-2xs text-ink-faint uppercase tracking-wider font-medium font-mono group-hover:text-accent-bright transition-colors">
                  Active Sprint →
                </span>
              </div>
            </div>

            <p className="text-[13px] text-fg font-medium truncate" title={primaryHackathon.title}>
              {primaryHackathon.title}
            </p>

            <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/[0.04]">
              <span className="text-2xs font-mono text-danger flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {Math.round(hoursRemaining)}h left
              </span>
              <span className="text-2xs font-mono font-semibold">
                <span className="text-accent-bright">{liveMaxScore}</span>
                <span className="text-ink-faint">/100</span>
              </span>
            </div>
          </div>
        )}

        {/* Settings Navigation Link */}
        <div className="px-2 pb-2">
          <NavLink
            to="/settings"
            className={cn(
              'flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] transition-all duration-hover group relative',
              location.pathname === '/settings'
                ? 'bg-white/[0.06] text-fg font-medium shadow-ambient'
                : 'text-ink-muted hover:text-fg hover:bg-white/[0.03]'
            )}
            title={!sidebarOpen ? 'Settings' : undefined}
          >
            <div
              className={cn(
                'w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-all duration-hover',
                location.pathname === '/settings'
                  ? 'bg-accent/15 text-accent-bright border border-accent/25'
                  : 'text-ink-faint group-hover:text-ink-body group-hover:bg-white/[0.04]'
              )}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </div>
            {sidebarOpen && <span className="truncate">Settings</span>}
          </NavLink>
        </div>
      </aside>

      {/* ── Main Container ── */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Bar */}
        <header className="h-14 border-b border-white/[0.05] flex items-center justify-between px-5 bg-bg-raised/50 backdrop-blur-xl shrink-0 z-10">
          {/* Left: Search & Competition Switcher */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-2 border border-white/[0.06] text-[13px] text-ink-faint hover:text-ink-body hover:border-white/[0.12] transition-all w-48 sm:w-56 text-left group shadow-ambient"
            >
              <Search className="w-3.5 h-3.5 text-ink-faint group-hover:text-accent-bright transition-colors" />
              <span className="flex-1 truncate">Search commands…</span>
              <span className="keycap">⌘K</span>
            </button>

            {/* Competition Quick Switcher */}
            <div className="relative">
              <button
                onClick={() => setHackathonDropdownOpen(!hackathonDropdownOpen)}
                className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-xs text-fg transition-all max-w-[220px] group"
                title="Switch Active Competition"
              >
                <Trophy className="w-3.5 h-3.5 text-accent-bright shrink-0" />
                <span className="truncate font-medium">{primaryHackathon?.title ?? 'Active Sprint'}</span>
                <ChevronDown className="w-3 h-3 text-ink-faint group-hover:text-fg shrink-0 transition-transform" />
              </button>

              {hackathonDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 glass-elevated rounded-xl p-2 z-50 animate-fade-up shadow-2xl border border-white/[0.08]">
                  <div className="px-2.5 py-1.5 text-2xs font-mono uppercase tracking-wider text-ink-faint border-b border-white/[0.06] mb-1 flex items-center justify-between">
                    <span>Active Competition</span>
                    <span className="text-accent-bright">{state.hackathons.length} Total</span>
                  </div>
                  <div className="space-y-1 max-h-56 overflow-y-auto no-scrollbar">
                    {state.hackathons.map((h) => {
                      const isSelected = h.id === primaryHackathon?.id;
                      return (
                        <button
                          key={h.id}
                          onClick={() => {
                            setActiveHackathon(h.id);
                            setHackathonDropdownOpen(false);
                            toast.success(`Active hackathon switched to ${h.title}`);
                          }}
                          className={cn(
                            'w-full text-left p-2 rounded-lg text-xs transition-colors flex items-center justify-between gap-2',
                            isSelected
                              ? 'bg-accent/15 text-accent-bright border border-accent/25 font-medium'
                              : 'text-ink-body hover:bg-white/[0.04] hover:text-fg'
                          )}
                        >
                          <div className="truncate">
                            <p className="truncate leading-snug">{h.title}</p>
                            <p className="text-2xs text-ink-faint font-mono mt-0.5">{h.prizePool} • {h.status}</p>
                          </div>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-1 pt-1 border-t border-white/[0.06]">
                    <button
                      onClick={() => {
                        setHackathonDropdownOpen(false);
                        navigate('/onboarding');
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-2xs text-accent-bright hover:bg-accent/10 transition-colors flex items-center gap-1.5 font-medium"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Connect New Competition</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Ask Max */}
            <button
              onClick={() => setCopilotOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-accent to-accent-cobalt hover:from-accent-bright hover:to-accent text-white text-[13px] font-medium transition-all duration-hover shadow-glow hover:shadow-glow-lg active:scale-[0.97]"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
              <span>Ask Max</span>
              <span className="keycap !border-white/20 !bg-white/10 !text-white/80">⌥M</span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-lg bg-surface-2 hover:bg-surface-3 border border-white/[0.06] hover:border-white/[0.12] text-ink-faint hover:text-fg transition-colors"
                title="Notifications"
              >
                <Bell className="w-3.5 h-3.5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent-cyan shadow-[0_0_6px_rgba(56,217,245,0.9)] animate-pulse" />
                )}
              </button>

              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 glass-elevated rounded-xl p-3 z-50 animate-fade-up">
                  <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.06] mb-2.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-[13px] font-medium text-fg">Notifications</h4>
                      <span className="text-2xs px-1.5 py-0.5 rounded-md bg-accent/15 text-accent-bright font-mono">
                        {unreadNotifs.length}
                      </span>
                    </div>
                    {unreadNotifs.length > 0 && (
                      <button
                        onClick={() => {
                          unreadNotifs.forEach((n) =>
                            dispatch({ type: 'mark_notification_read', id: n.id })
                          );
                          toast.success('Marked all as read');
                        }}
                        className="text-2xs text-ink-faint hover:text-accent-bright transition-colors"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="space-y-1.5 max-h-64 overflow-y-auto no-scrollbar">
                    {state.notifications.map((n) => (
                      <div
                        key={n.id}
                        className={cn(
                          'p-2.5 rounded-lg text-[13px] transition-colors',
                          n.read
                            ? 'text-ink-muted'
                            : 'bg-accent/8 border border-accent/15 text-fg'
                        )}
                      >
                        <p className="leading-relaxed">{n.text}</p>
                        {!n.read && (
                          <button
                            onClick={() => dispatch({ type: 'mark_notification_read', id: n.id })}
                            className="text-2xs text-accent-bright hover:underline mt-1 font-medium"
                          >
                            Mark read
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Demo Mode Pill & Reset */}
            <div className="flex items-center rounded-lg bg-surface-2 border border-white/[0.06] p-0.5">
              <button
                onClick={() => {
                  toggleDemo();
                  toast.info(`Demo Mode ${!state.demoMode ? 'enabled' : 'disabled'}`);
                }}
                className="flex items-center gap-1.5 px-2 py-1 text-2xs text-ink-muted hover:text-fg transition-colors"
                title="Toggle Demo Mode"
              >
                <span className={cn('w-1.5 h-1.5 rounded-full', state.demoMode ? 'bg-emerald-400' : 'bg-ink-faint')} />
                <span className="font-mono">{state.demoMode ? 'Demo' : 'Live'}</span>
              </button>
              {state.demoMode && (
                <button
                  onClick={() => {
                    resetSampleData();
                    toast.success('Sample demo data reset!');
                  }}
                  className="px-1.5 py-1 text-2xs font-mono text-ink-faint hover:text-amber-400 border-l border-white/[0.06] transition-colors"
                  title="Reset demo data to initial state"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Avatar */}
            <div
              onClick={() => navigate('/settings')}
              className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-xs font-medium text-accent-bright cursor-pointer hover:border-accent/40 transition-all"
              title="Settings"
            >
              {state.profile.fullName.charAt(0)}
            </div>
          </div>
        </header>

        {/* Page Outlet */}
        <div className="flex-1 overflow-y-auto p-6 relative">
          <Outlet />

          {/* Floating Ask Max FAB */}
          <button
            onClick={() => setCopilotOpen(true)}
            className="fixed bottom-5 right-5 z-30 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent hover:bg-accent-bright text-white shadow-glow hover:shadow-glow-lg transition-all duration-hover active:scale-[0.95] group"
            title="Open AI Copilot (Alt+M)"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-[13px] font-medium">Ask Max</span>
            <span className="keycap !border-white/20 !bg-white/10 !text-white/70">⌥M</span>
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