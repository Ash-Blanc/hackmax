import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import { createSeedState } from '@/lib/mock-data';
import { computeMaxScore } from '@/lib/max-score';
import { pickNextAction } from '@/lib/ai/provider';
import { remainingFrom } from '@/lib/time';
import { isSupabaseConfigured } from '@/lib/supabase';
import type { AppState, ChecklistItem, Task, TaskStatus, Hackathon } from '@/types';

type Action =
  | { type: 'hydrate'; state: AppState }
  | { type: 'toggle_task'; id: string; status: TaskStatus }
  | { type: 'delete_task'; id: string }
  | { type: 'toggle_check'; id: string }
  | { type: 'update_check_value'; id: string; value: string }
  | { type: 'add_task'; task: Task }
  | { type: 'add_hackathon'; hackathon: Hackathon; tasks: Task[]; checklist: ChecklistItem[] }
  | { type: 'set_demo'; demo: boolean }
  | { type: 'toggle_demo' }
  | { type: 'update_profile'; profile: Partial<AppState['profile']> }
  | { type: 'mark_notification_read'; id: string }
  | { type: 'dismiss_notification'; id: string }
  | { type: 'add_capability'; projectId: string; capability: string }
  | { type: 'add_component'; projectId: string; component: string };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'hydrate':
      return action.state;
    case 'toggle_task':
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.id ? { ...t, status: action.status } : t)),
      };
    case 'delete_task':
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.id),
      };
    case 'toggle_check': {
      const checklist = state.checklist.map((c) => (c.id === action.id ? { ...c, completed: !c.completed } : c));
      return { ...state, checklist };
    }
    case 'update_check_value': {
      const checklist = state.checklist.map((c) => (c.id === action.id ? { ...c, value: action.value, completed: Boolean(action.value) } : c));
      return { ...state, checklist };
    }
    case 'add_task':
      return { ...state, tasks: [action.task, ...state.tasks] };
    case 'add_hackathon':
      return {
        ...state,
        hackathons: [action.hackathon, ...state.hackathons],
        tasks: [...action.tasks, ...state.tasks],
        checklist: [...action.checklist, ...state.checklist],
      };
    case 'set_demo':
      return { ...state, demoMode: action.demo };
    case 'toggle_demo':
      return { ...state, demoMode: !state.demoMode };
    case 'update_profile':
      return { ...state, profile: { ...state.profile, ...action.profile } };
    case 'mark_notification_read':
      return {
        ...state,
        notifications: state.notifications.map((n) => (n.id === action.id ? { ...n, read: true } : n)),
      };
    case 'dismiss_notification':
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.id),
      };
    case 'add_capability':
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.projectId && !p.capabilities.includes(action.capability)
            ? { ...p, capabilities: [...p.capabilities, action.capability] }
            : p
        ),
      };
    case 'add_component':
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.projectId && !p.reusableComponents.includes(action.component)
            ? { ...p, reusableComponents: [...p.reusableComponents, action.component] }
            : p
        ),
      };
    default:
      return state;
  }
}

interface StoreValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  primaryHackathon: Hackathon | undefined;
  nextTask: Task | undefined;
  liveMaxScore: number;
  hoursRemaining: number;
  startTask: (id: string) => void;
  completeTask: (id: string) => void;
  cutTask: (id: string) => void;
  toggleDemo: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function HackMaxStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    const seeded = createSeedState();
    return { ...seeded, demoMode: !isSupabaseConfigured };
  });

  const primaryHackathon = useMemo(
    () => state.hackathons.find((h) => h.status === 'active') ?? state.hackathons[0],
    [state.hackathons]
  );

  const hoursRemaining = primaryHackathon
    ? remainingFrom(primaryHackathon.endDate).totalMs / 3_600_000
    : 0;

  const scopedTasks = useMemo(
    () => state.tasks.filter((t) => t.hackathonId === primaryHackathon?.id),
    [state.tasks, primaryHackathon?.id]
  );
  const scopedCriteria = useMemo(
    () => state.criteria.filter((c) => c.hackathonId === primaryHackathon?.id),
    [state.criteria, primaryHackathon?.id]
  );
  const scopedChecklist = useMemo(
    () => state.checklist.filter((c) => c.hackathonId === primaryHackathon?.id),
    [state.checklist, primaryHackathon?.id]
  );

  const liveMaxScore = useMemo(
    () => computeMaxScore({ criteria: scopedCriteria, tasks: scopedTasks, checklist: scopedChecklist, hoursRemaining }),
    [scopedCriteria, scopedTasks, scopedChecklist, hoursRemaining]
  );

  const nextTask = useMemo(() => pickNextAction(scopedTasks), [scopedTasks]);

  const startTask = useCallback((id: string) => dispatch({ type: 'toggle_task', id, status: 'in_progress' }), []);
  const completeTask = useCallback((id: string) => dispatch({ type: 'toggle_task', id, status: 'done' }), []);
  const cutTask = useCallback((id: string) => dispatch({ type: 'toggle_task', id, status: 'cut' }), []);
  const toggleDemo = useCallback(() => dispatch({ type: 'toggle_demo' }), []);

  const value = useMemo(() => ({
    state, dispatch, primaryHackathon, nextTask, liveMaxScore, hoursRemaining, startTask, completeTask, cutTask, toggleDemo,
  }), [state, primaryHackathon, nextTask, liveMaxScore, hoursRemaining, startTask, completeTask, cutTask, toggleDemo]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useHackMaxStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useHackMaxStore must be used within HackMaxStoreProvider');
  return ctx;
}

export function useCopilotMemory() {
  return useReducer(
    (msgs: { id: string; role: 'user' | 'assistant'; content: string }[], action: { type: 'push'; msg: { id: string; role: 'user' | 'assistant'; content: string } } | { type: 'clear' }) => {
      if (action.type === 'clear') return [];
      return [...msgs, action.msg];
    },
    [] as { id: string; role: 'user' | 'assistant'; content: string }[]
  );
}