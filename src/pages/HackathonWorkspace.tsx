import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHackMaxStore } from '@/lib/store';
import {
  Clock,
  ExternalLink,
  Check,
  X,
  Play,
  Plus,
  Scissors,
  LayoutGrid,
  ListOrdered,
  ArrowRight,
  ShieldCheck,
  Filter,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Task, TaskStage, TaskPriority, ImpactLevel } from '@/types';

const stageColors: Record<TaskStage, { badge: string; border: string; accent: string }> = {
  NOW: { badge: 'bg-red-500/10 text-red-400 border-red-500/20', border: 'border-t-2 border-t-red-500', accent: 'text-red-400' },
  NEXT: { badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20', border: 'border-t-2 border-t-amber-500', accent: 'text-amber-400' },
  LATER: { badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20', border: 'border-t-2 border-t-blue-500', accent: 'text-blue-400' },
  SUBMISSION: { badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20', border: 'border-t-2 border-t-purple-500', accent: 'text-purple-400' },
};

const priorityColors: Record<TaskPriority, string> = {
  CRITICAL: 'bg-red-500/10 text-red-400 border border-red-500/20 font-medium',
  HIGH: 'bg-orange-500/10 text-orange-400 border border-orange-500/20 font-medium',
  MEDIUM: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  LOW: 'bg-white/[0.03] text-ink-faint border border-white/[0.05]',
};

export default function HackathonWorkspace() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, liveMaxScore, startTask, completeTask, cutTask, dispatch } = useHackMaxStore();

  const hackathon = state.hackathons.find((h) => h.id === id) || state.hackathons[0];

  // View state: 'board' vs 'list'
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [filterStage, setFilterStage] = useState<string>('ALL');

  // Add task modal state
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskStage, setTaskStage] = useState<TaskStage>('NOW');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('HIGH');
  const [taskImpact, setTaskImpact] = useState<ImpactLevel>('HIGH');
  const [taskEst, setTaskEst] = useState(45);

  // Edit checklist value modal
  const [editingCheckId, setEditingCheckId] = useState<string | null>(null);
  const [checkValueInput, setCheckValueInput] = useState('');

  // Live countdown
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  useEffect(() => {
    if (!hackathon?.endDate) return;
    const calc = () => {
      const diff = Math.max(0, new Date(hackathon.endDate).getTime() - Date.now());
      setSecondsRemaining(Math.floor(diff / 1000));
    };
    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [hackathon?.endDate]);

  if (!hackathon) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="text-center p-8 glass-panel rounded-xl border border-white/[0.06] max-w-sm">
          <p className="text-sm font-semibold text-fg mb-2">Hackathon Not Found</p>
          <button
            onClick={() => navigate('/hackathons')}
            className="px-4 py-2 bg-accent hover:bg-accent-bright text-white rounded-lg text-xs font-medium transition-all active:scale-[0.97]"
          >
            ← Back to Hackathons
          </button>
        </div>
      </div>
    );
  }

  const dDays = Math.floor(secondsRemaining / 86400);
  const dHours = Math.floor((secondsRemaining % 86400) / 3600);
  const dMins = Math.floor((secondsRemaining % 3600) / 60);

  const stageKeys: TaskStage[] = ['NOW', 'NEXT', 'LATER', 'SUBMISSION'];
  const tasks = state.tasks.filter((t) => t.hackathonId === hackathon.id);
  const criteria = state.criteria.filter((c) => c.hackathonId === hackathon.id);
  const checklist = state.checklist.filter((c) => c.hackathonId === hackathon.id);
  const verifiedCount = checklist.filter((c) => c.completed).length;

  const cuttableTasks = tasks.filter(
    (t) => (t.stage === 'LATER' || t.impactLevel === 'LOW') && t.status !== 'done' && t.status !== 'cut'
  );

  const filteredTasks =
    filterStage === 'ALL' ? tasks : tasks.filter((t) => t.stage === filterStage);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      hackathonId: hackathon.id,
      title: taskTitle.trim(),
      stage: taskStage,
      priority: taskPriority,
      estimatedMinutes: taskEst,
      impactLevel: taskImpact,
      status: 'todo',
      sortOrder: 0,
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: 'add_task', task: newTask });
    toast.success(`Added task to ${taskStage}: ${newTask.title}`);
    setTaskTitle('');
    setIsAddTaskOpen(false);
  };

  const handleSaveCheckValue = (checkId: string) => {
    dispatch({ type: 'update_check_value', id: checkId, value: checkValueInput.trim() });
    toast.success('Updated deliverable URL');
    setEditingCheckId(null);
    setCheckValueInput('');
  };

  return (
    <div className="space-y-5 max-w-6xl mx-auto animate-fade-up">
      {/* Workspace Header */}
      <div className="glass-panel rounded-xl p-5 border border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-fenix text-fg tracking-normal">{hackathon.title}</h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-2xs font-mono font-medium">
              ● {hackathon.status.toUpperCase()}
            </span>
          </div>
          <p className="text-secondary text-xs mt-1 max-w-xl leading-relaxed">{hackathon.description}</p>
          <div className="flex items-center gap-3 mt-2 text-2xs text-ink-faint font-mono">
            <a
              href={hackathon.url}
              target="_blank"
              rel="noreferrer"
              className="text-accent-bright hover:underline flex items-center gap-1 font-medium"
            >
              <span>Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <span>Prize Pool: <span className="text-fg font-semibold">{hackathon.prizePool}</span></span>
          </div>
        </div>

        {/* Readiness telemetry box */}
        <div className="flex items-center gap-3 bg-white/[0.02] p-3 rounded-xl border border-white/[0.06] shrink-0">
          <div className="text-center pr-3 border-r border-white/[0.06]">
            <p className="text-2xs text-ink-faint uppercase tracking-wider font-mono flex items-center justify-center gap-1">
              <Clock className="w-3 h-3 text-red-400" /> Deadline Clock
            </p>
            <p className="text-sm font-bold font-mono text-red-400 mt-0.5">
              {dDays}d {dHours}h {dMins}m
            </p>
          </div>
          <div className="text-center pl-1">
            <p className="text-2xs text-ink-faint uppercase tracking-wider font-mono">Max Score</p>
            <p className="text-sm font-bold font-mono text-accent-bright mt-0.5">{liveMaxScore}/100</p>
          </div>
        </div>
      </div>

      {/* Judging Criteria Breakdown Strip */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-muted font-mono">
              Judging Criteria & Recommendations
            </h2>
            <p className="text-2xs text-secondary mt-0.5">Weighted analysis calibrating your live Max Score</p>
          </div>
          <button
            onClick={() => navigate('/judge')}
            className="text-2xs font-medium text-secondary hover:text-fg flex items-center gap-1 transition-colors"
          >
            <span>Simulate Judges</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {criteria.map((c) => (
            <div
              key={c.id}
              className="glass-card rounded-xl p-3.5 border border-white/[0.05] flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-fg truncate">{c.name}</span>
                  <span className="text-2xs text-accent-bright font-mono font-medium">{c.weight}x wt</span>
                </div>
                <div className="flex items-baseline gap-1 my-1">
                  <span className="text-xl font-bold font-mono text-fg">{c.score}</span>
                  <span className="text-2xs text-ink-faint font-mono">/ 10</span>
                  <span className="text-2xs text-ink-faint ml-auto font-mono">
                    {Math.round(c.confidence * 100)}%
                  </span>
                </div>
                <p className="text-2xs text-secondary line-clamp-2 mt-1 leading-snug">{c.explanation}</p>
              </div>

              {c.recommendedFix && (
                <div className="mt-2.5 pt-2 border-t border-white/[0.04]">
                  <span className="text-ink-faint block text-2xs uppercase font-mono">AI Recommended Fix</span>
                  <p className="text-2xs text-accent-bright line-clamp-2 mt-0.5 leading-tight">
                    {c.recommendedFix}
                  </p>
                  <button
                    onClick={() => {
                      const newTask: Task = {
                        id: `task-fix-${Date.now()}`,
                        hackathonId: hackathon.id,
                        title: `[AI Fix: ${c.name}] ${c.recommendedFix}`,
                        stage: 'NOW',
                        priority: 'CRITICAL',
                        estimatedMinutes: 45,
                        impactLevel: 'CRITICAL',
                        status: 'todo',
                        sortOrder: 0,
                        createdAt: new Date().toISOString(),
                      };
                      dispatch({ type: 'add_task', task: newTask });
                      toast.success(`Injected AI Fix into NOW stage!`);
                    }}
                    className="mt-1.5 text-2xs font-mono text-accent-bright hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>+ Inject into NOW</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Max Plan Execution Board / List View */}
      <div>
        {/* Student Execution Strategy Tip */}
        <div className="mb-3 px-3 py-2 rounded-lg bg-accent/5 border border-accent/15 flex items-center justify-between text-2xs text-secondary">
          <div className="flex items-center gap-2">
            <span className="text-accent-bright font-medium">💡 Student Hacker Rule:</span>
            <span>Keep your <strong className="text-fg">NOW</strong> column to 1–2 items at a time to avoid multitasking thrash. Tasks in <strong className="text-fg">LATER</strong> can be cut guilt-free if time runs out.</span>
          </div>
          <button
            onClick={() => navigate('/judge')}
            className="text-accent-bright hover:underline font-mono shrink-0 ml-3 hidden sm:inline"
          >
            Practice Judge →
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-muted font-mono">
              Execution Board
            </h2>
            <p className="text-2xs text-secondary">
              Organized by time urgency (NOW, NEXT, LATER, SUBMISSION) to maximize return per hour
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Cut Trigger if low impact tasks present */}
            {cuttableTasks.length > 0 && (
              <button
                onClick={() => {
                  cuttableTasks.forEach((t) => cutTask(t.id));
                  toast.warning(`Trimmed ${cuttableTasks.length} non-essential tasks!`);
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-2xs font-medium transition-colors active:scale-[0.97]"
                title="Trim non-essential tasks"
              >
                <Scissors className="w-3 h-3" />
                <span>Trim {cuttableTasks.length} Non-Essentials</span>
              </button>
            )}

            {/* View Mode Switcher (Board vs List) */}
            <div className="flex items-center p-0.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <button
                onClick={() => setViewMode('board')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-2xs font-medium transition-all ${
                  viewMode === 'board'
                    ? 'bg-accent text-white shadow-ambient'
                    : 'text-ink-faint hover:text-fg'
                }`}
              >
                <LayoutGrid className="w-3 h-3" />
                <span>Board</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-2xs font-medium transition-all ${
                  viewMode === 'list'
                    ? 'bg-accent text-white shadow-ambient'
                    : 'text-ink-faint hover:text-fg'
                }`}
              >
                <ListOrdered className="w-3 h-3" />
                <span>List</span>
              </button>
            </div>

            {/* Add Task Button */}
            <button
              onClick={() => setIsAddTaskOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-accent hover:bg-accent-bright text-white rounded-lg text-xs font-medium shadow-ambient transition-all active:scale-[0.97]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* Dual View Rendering */}
        {viewMode === 'board' ? (
          /* 4-Column Kanban Board */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {stageKeys.map((stage) => {
              const stageTasks = tasks.filter((t) => t.stage === stage);
              return (
                <div
                  key={stage}
                  className={`glass-panel rounded-xl p-3 border border-white/[0.05] flex flex-col ${stageColors[stage].border}`}
                >
                  {/* Stage Header */}
                  <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-white/[0.05]">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-2xs px-2 py-0.5 rounded-md font-medium font-mono uppercase tracking-wider ${stageColors[stage].badge}`}>
                        {stage}
                      </span>
                      <span className="text-2xs font-mono text-ink-faint">({stageTasks.length})</span>
                    </div>
                    <button
                      onClick={() => {
                        setTaskStage(stage);
                        setIsAddTaskOpen(true);
                      }}
                      className="p-1 rounded text-ink-faint hover:text-fg hover:bg-white/[0.04] transition-colors"
                      title={`Add task to ${stage}`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Tasks in this stage */}
                  <div className="space-y-2 flex-1">
                    {stageTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-3 rounded-lg transition-all border ${
                          task.status === 'done'
                            ? 'bg-white/[0.01] border-white/[0.03] opacity-50'
                            : task.status === 'cut'
                            ? 'bg-white/[0.01] border-white/[0.02] opacity-35 line-through'
                            : task.status === 'in_progress'
                            ? 'bg-accent/[0.08] border-accent/30 shadow-ambient'
                            : 'glass-card border-white/[0.05] hover:border-white/[0.10]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-2xs px-1.5 py-0.2 rounded font-mono ${priorityColors[task.priority]}`}>
                            {task.priority}
                          </span>
                          <span className="text-2xs font-mono text-ink-faint">~{task.estimatedMinutes}m</span>
                        </div>

                        <h4
                          className={`text-xs font-medium leading-snug ${
                            task.status === 'done' ? 'line-through text-ink-muted' : 'text-fg'
                          }`}
                        >
                          {task.title}
                        </h4>

                        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/[0.04] text-2xs">
                          <span className="text-ink-faint font-mono">Impact: {task.impactLevel}</span>

                          <div className="flex items-center gap-1">
                            {task.status !== 'done' && task.status !== 'cut' && (
                              <>
                                {task.status !== 'in_progress' && (
                                  <button
                                    onClick={() => {
                                      startTask(task.id);
                                      toast.info(`Started: ${task.title}`);
                                    }}
                                    className="p-1 rounded text-accent-bright hover:bg-accent/15 transition-colors"
                                    title="Start task"
                                  >
                                    <Play className="w-3 h-3 fill-accent" />
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    completeTask(task.id);
                                    toast.success(`Completed: ${task.title}`);
                                  }}
                                  className="p-1 rounded text-emerald-400 hover:bg-emerald-500/15 transition-colors"
                                  title="Mark as done"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    cutTask(task.id);
                                    toast.warning(`Cut: ${task.title}`);
                                  }}
                                  className="p-1 rounded text-ink-faint hover:text-red-400 hover:bg-red-500/15 transition-colors"
                                  title="Cut task"
                                >
                                  <Scissors className="w-3 h-3" />
                                </button>
                              </>
                            )}
                            {task.status === 'done' && (
                              <span className="text-emerald-400 flex items-center gap-0.5 font-mono text-2xs">
                                <Check className="w-3 h-3" /> Done
                              </span>
                            )}
                            {task.status === 'cut' && (
                              <span className="text-ink-faint font-mono text-2xs">Trimmed</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {stageTasks.length === 0 && (
                      <div className="p-4 rounded-lg border border-dashed border-white/[0.06] text-center text-2xs text-ink-faint">
                        No tasks in {stage}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* High-Density Compact List View (Linear style) */
          <div className="glass-panel rounded-xl border border-white/[0.06] overflow-hidden">
            <div className="p-2.5 border-b border-white/[0.05] flex items-center justify-between text-2xs text-ink-faint font-mono bg-white/[0.02]">
              <div className="flex items-center gap-1.5">
                <Filter className="w-3 h-3 text-accent-bright" />
                <span>Stage:</span>
                {['ALL', 'NOW', 'NEXT', 'LATER', 'SUBMISSION'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStage(s)}
                    className={`px-2 py-0.5 rounded text-2xs font-medium transition-colors ${
                      filterStage === s
                        ? 'bg-accent text-white'
                        : 'bg-white/[0.03] text-ink-faint hover:text-fg'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <span>{filteredTasks.length} Tasks</span>
            </div>

            <div className="divide-y divide-white/[0.04]">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="px-3.5 py-2.5 flex items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span className={`text-2xs px-1.5 py-0.2 rounded font-mono font-medium ${stageColors[task.stage].badge}`}>
                      {task.stage}
                    </span>
                    <span
                      className={`text-xs font-normal truncate ${
                        task.status === 'done' ? 'line-through text-ink-faint' : 'text-fg'
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 text-2xs font-mono">
                    <span className={`px-1.5 py-0.2 rounded ${priorityColors[task.priority]}`}>
                      {task.priority}
                    </span>
                    <span className="text-ink-faint">~{task.estimatedMinutes}m</span>
                    <span className="text-secondary">Impact: {task.impactLevel}</span>

                    <div className="flex items-center gap-1 ml-1">
                      {task.status !== 'done' && task.status !== 'cut' && (
                        <>
                          <button
                            onClick={() => {
                              completeTask(task.id);
                              toast.success(`Completed: ${task.title}`);
                            }}
                            className="p-1 rounded text-emerald-400 hover:bg-emerald-500/15"
                            title="Mark as done"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              cutTask(task.id);
                              toast.warning(`Cut: ${task.title}`);
                            }}
                            className="p-1 rounded text-ink-faint hover:text-red-400 hover:bg-red-500/15"
                            title="Cut task"
                          >
                            <Scissors className="w-3 h-3" />
                          </button>
                        </>
                      )}
                      {task.status === 'done' && (
                        <span className="text-emerald-400 text-2xs">✓ Done</span>
                      )}
                      {task.status === 'cut' && (
                        <span className="text-ink-faint text-2xs">Trimmed</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Submission Checklist Overhaul */}
      <div className="glass-panel rounded-xl p-5 border border-white/[0.06]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5 pb-2.5 border-b border-white/[0.05]">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-semibold text-fg tracking-snug">Submission Checklist</h2>
            </div>
            <p className="text-secondary text-2xs mt-0.5">
              Directly contributes 20% to your live Max Score. Verified before judging.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-32 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-500"
                style={{ width: `${(verifiedCount / Math.max(checklist.length, 1)) * 100}%` }}
              />
            </div>
            <span className="text-2xs font-mono font-medium text-accent-bright">
              {verifiedCount} of {checklist.length} Verified
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {checklist.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-lg border transition-all ${
                item.completed
                  ? 'bg-emerald-500/5 border-emerald-500/20'
                  : item.required
                  ? 'glass-card border-white/[0.05] hover:border-white/[0.10]'
                  : 'bg-white/[0.02] border-white/[0.04]'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <button
                  onClick={() => {
                    dispatch({ type: 'toggle_check', id: item.id });
                    toast.info(`Updated: ${item.label}`);
                  }}
                  className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border transition-all ${
                    item.completed
                      ? 'bg-emerald-500 border-emerald-400 text-white'
                      : 'border-white/[0.15] hover:border-accent bg-bg-raised'
                  }`}
                >
                  {item.completed && <Check className="w-3 h-3" />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-fg truncate">{item.label}</p>
                    {item.required ? (
                      <span className="text-2xs px-1.5 py-0.2 rounded bg-red-500/10 text-red-400 font-mono font-medium uppercase">
                        Required
                      </span>
                    ) : (
                      <span className="text-2xs text-ink-faint font-mono">Optional</span>
                    )}
                  </div>

                  {/* Value / Deliverable Link */}
                  <div className="mt-2 flex items-center justify-between text-xs">
                    {item.value ? (
                      <a
                        href={item.value}
                        target="_blank"
                        rel="noreferrer"
                        className="text-accent-bright hover:underline truncate max-w-xs text-2xs font-mono flex items-center gap-1"
                      >
                        <span className="truncate">{item.value}</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-ink-faint text-2xs font-mono italic">No URL configured</span>
                    )}

                    <button
                      onClick={() => {
                        setEditingCheckId(item.id);
                        setCheckValueInput(item.value || '');
                      }}
                      className="text-2xs text-secondary hover:text-fg font-medium hover:underline shrink-0 ml-2"
                    >
                      {item.value ? 'Edit' : '+ Add URL'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Task Modal */}
      {isAddTaskOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-up">
          <div className="glass-elevated border border-white/[0.08] rounded-xl p-5 w-full max-w-md shadow-overlay">
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-white/[0.06]">
              <h3 className="font-semibold text-fg text-xs">Add Plan Task</h3>
              <button
                onClick={() => setIsAddTaskOpen(false)}
                className="p-1 rounded-md text-secondary hover:text-fg hover:bg-white/[0.04] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="block text-secondary mb-1 text-2xs font-medium">Task Title</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Record 2-minute video walkthrough"
                  required
                  className="w-full py-2 px-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-fg placeholder:text-ink-faint focus:outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-secondary mb-1 text-2xs font-medium">Execution Stage</label>
                  <select
                    value={taskStage}
                    onChange={(e) => setTaskStage(e.target.value as TaskStage)}
                    className="w-full py-2 px-2.5 rounded-lg bg-bg-raised border border-white/[0.06] text-fg focus:outline-none focus:border-accent font-mono text-xs"
                  >
                    <option value="NOW">NOW (Immediate)</option>
                    <option value="NEXT">NEXT (Secondary)</option>
                    <option value="LATER">LATER (Buffer)</option>
                    <option value="SUBMISSION">SUBMISSION (Packaging)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-secondary mb-1 text-2xs font-medium">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
                    className="w-full py-2 px-2.5 rounded-lg bg-bg-raised border border-white/[0.06] text-fg focus:outline-none focus:border-accent font-mono text-xs"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-secondary mb-1 text-2xs font-medium">Estimated Time</label>
                  <select
                    value={taskEst}
                    onChange={(e) => setTaskEst(Number(e.target.value))}
                    className="w-full py-2 px-2.5 rounded-lg bg-bg-raised border border-white/[0.06] text-fg focus:outline-none focus:border-accent font-mono text-xs"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                  </select>
                </div>
                <div>
                  <label className="block text-secondary mb-1 text-2xs font-medium">Score Impact</label>
                  <select
                    value={taskImpact}
                    onChange={(e) => setTaskImpact(e.target.value as ImpactLevel)}
                    className="w-full py-2 px-2.5 rounded-lg bg-bg-raised border border-white/[0.06] text-fg focus:outline-none focus:border-accent font-mono text-xs"
                  >
                    <option value="CRITICAL">CRITICAL (+6-9 Pts)</option>
                    <option value="HIGH">HIGH (+3-5 Pts)</option>
                    <option value="MEDIUM">MEDIUM (+1-2 Pts)</option>
                    <option value="LOW">LOW (&lt;1 Pt)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2.5 flex justify-end gap-2 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setIsAddTaskOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-white/[0.03] text-secondary hover:text-fg font-medium text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-accent hover:bg-accent-bright text-white font-medium text-xs shadow-ambient transition-all active:scale-[0.97]"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Checklist Value Modal */}
      {editingCheckId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-up">
          <div className="glass-elevated border border-white/[0.08] rounded-xl p-5 w-full max-w-md shadow-overlay">
            <h3 className="font-semibold text-fg text-xs mb-2.5">Update Deliverable URL</h3>
            <input
              type="text"
              value={checkValueInput}
              onChange={(e) => setCheckValueInput(e.target.value)}
              placeholder="https://..."
              className="w-full py-2 px-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-fg focus:outline-none focus:border-accent mb-3.5 font-mono"
              autoFocus
            />
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setEditingCheckId(null)}
                className="px-3.5 py-1.5 rounded-lg bg-white/[0.03] text-secondary hover:text-fg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveCheckValue(editingCheckId)}
                className="px-4 py-1.5 rounded-lg bg-accent hover:bg-accent-bright text-white font-medium shadow-ambient transition-all active:scale-[0.97]"
              >
                Save URL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}