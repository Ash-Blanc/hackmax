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
  NOW: { badge: 'bg-red-500/15 text-red-400 border-red-500/30', border: 'border-t-2 border-t-red-500', accent: 'text-red-400' },
  NEXT: { badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30', border: 'border-t-2 border-t-amber-500', accent: 'text-amber-400' },
  LATER: { badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30', border: 'border-t-2 border-t-blue-500', accent: 'text-blue-400' },
  SUBMISSION: { badge: 'bg-purple-500/15 text-purple-400 border-purple-500/30', border: 'border-t-2 border-t-purple-500', accent: 'text-purple-400' },
};

const priorityColors: Record<TaskPriority, string> = {
  CRITICAL: 'bg-red-500/15 text-red-400 border border-red-500/30 font-bold',
  HIGH: 'bg-orange-500/15 text-orange-400 border border-orange-500/30 font-medium',
  MEDIUM: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  LOW: 'bg-white/[0.04] text-muted border border-white/[0.06]',
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
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8 glass-panel rounded-2xl border border-white/[0.08] chamfer-top">
          <p className="text-xl font-bold text-white mb-2">Hackathon Not Found</p>
          <button
            onClick={() => navigate('/hackathons')}
            className="px-4 py-2 bg-accent text-white rounded-xl text-xs font-semibold"
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
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Workspace Header */}
      <div className="glass-panel rounded-2xl p-6 border-white/[0.06] chamfer-top flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">{hackathon.title}</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-semibold">
              ● {hackathon.status.toUpperCase()}
            </span>
          </div>
          <p className="text-secondary text-xs mt-2 max-w-2xl leading-relaxed">{hackathon.description}</p>
          <div className="flex items-center gap-4 mt-3 text-xs text-muted">
            <a
              href={hackathon.url}
              target="_blank"
              rel="noreferrer"
              className="text-accent-light hover:underline flex items-center gap-1 font-medium font-mono"
            >
              <span>DevPost Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <span>Prize Pool: <strong className="text-white font-mono">{hackathon.prizePool}</strong></span>
          </div>
        </div>

        {/* Readiness telemetry box */}
        <div className="flex items-center gap-4 bg-[#131622]/90 p-4 rounded-2xl border border-white/[0.08] shrink-0 chamfer-top shadow-lg">
          <div className="text-center pr-4 border-r border-white/[0.08]">
            <p className="text-[10px] text-muted uppercase tracking-wider font-semibold font-mono flex items-center justify-center gap-1.5">
              <Clock className="w-3 h-3 text-red-400" /> Deadline Clock
            </p>
            <p className="text-xl font-bold font-mono text-red-400 mt-1">
              {dDays}d {dHours}h {dMins}m
            </p>
          </div>
          <div className="text-center pl-2">
            <p className="text-[10px] text-muted uppercase tracking-wider font-semibold font-mono">Max Score</p>
            <p className="text-xl font-bold font-mono text-accent-bright mt-1">{liveMaxScore}/100</p>
          </div>
        </div>
      </div>

      {/* Judging Criteria Breakdown Strip */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-extrabold text-white tracking-tight">Judging Criteria & AI Fixes</h2>
            <p className="text-secondary text-xs">Weighted analysis directly calibrating your Max Score readiness</p>
          </div>
          <button
            onClick={() => navigate('/judge')}
            className="text-xs font-semibold text-accent-light hover:underline flex items-center gap-1 font-mono"
          >
            <span>Simulate AI Judges</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {criteria.map((c) => (
            <div
              key={c.id}
              className="glass-card rounded-2xl p-4 border border-white/[0.06] chamfer-top flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white truncate">{c.name}</span>
                  <span className="text-[10px] text-accent-bright font-mono font-semibold">{c.weight}x wt</span>
                </div>
                <div className="flex items-baseline gap-1 my-1">
                  <span className="text-2xl font-extrabold font-mono text-white">{c.score}</span>
                  <span className="text-xs text-muted font-mono">/ 10</span>
                  <span className="text-[10px] text-muted ml-auto font-mono">
                    {Math.round(c.confidence * 100)}% conf
                  </span>
                </div>
                <p className="text-[11px] text-secondary line-clamp-2 mt-1 leading-snug">{c.explanation}</p>
              </div>

              {c.recommendedFix && (
                <div className="mt-3 pt-2 border-t border-white/[0.06]">
                  <span className="text-muted block text-[9px] uppercase font-bold font-mono">AI Recommended Fix</span>
                  <p className="text-[10px] text-accent-light line-clamp-2 mt-0.5 leading-tight">
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
                    className="mt-2 text-[10px] font-mono text-accent-bright hover:underline flex items-center gap-1 font-semibold"
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h2 className="text-base font-extrabold text-white tracking-tight">Execution Board</h2>
            <p className="text-secondary text-xs">
              Organized by time urgency (NOW, NEXT, LATER, SUBMISSION) to maximize return per hour
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Cut Trigger if low impact tasks present */}
            {cuttableTasks.length > 0 && (
              <button
                onClick={() => {
                  cuttableTasks.forEach((t) => cutTask(t.id));
                  toast.warning(`Trimmed ${cuttableTasks.length} non-essential tasks!`);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold transition-colors"
                title="Trim non-essential low-impact tasks to protect submission time"
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>Trim {cuttableTasks.length} Non-Essentials</span>
              </button>
            )}

            {/* View Mode Switcher (Board vs List) */}
            <div className="flex items-center p-1 rounded-xl bg-[#131622] border border-white/[0.08]">
              <button
                onClick={() => setViewMode('board')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'board'
                    ? 'bg-accent text-white shadow-glow'
                    : 'text-secondary hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Board</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'list'
                    ? 'bg-accent text-white shadow-glow'
                    : 'text-secondary hover:text-white'
                }`}
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span>Compact List</span>
              </button>
            </div>

            {/* Add Task Button */}
            <button
              onClick={() => setIsAddTaskOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-accent to-indigo-600 hover:from-accent-bright hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-glow transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* Dual View Rendering */}
        {viewMode === 'board' ? (
          /* 4-Column Kanban Board */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stageKeys.map((stage) => {
              const stageTasks = tasks.filter((t) => t.stage === stage);
              return (
                <div
                  key={stage}
                  className={`glass-panel rounded-2xl p-3.5 border border-white/[0.06] flex flex-col ${stageColors[stage].border}`}
                >
                  {/* Stage Header */}
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold font-mono uppercase tracking-wider ${stageColors[stage].badge}`}>
                        {stage}
                      </span>
                      <span className="text-xs font-mono text-muted">({stageTasks.length})</span>
                    </div>
                    <button
                      onClick={() => {
                        setTaskStage(stage);
                        setIsAddTaskOpen(true);
                      }}
                      className="p-1 rounded-lg text-muted hover:text-white hover:bg-white/[0.06] transition-colors"
                      title={`Add task to ${stage}`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Tasks in this stage */}
                  <div className="space-y-2.5 flex-1">
                    {stageTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-3.5 rounded-xl transition-all border chamfer-top ${
                          task.status === 'done'
                            ? 'bg-white/[0.02] border-white/[0.04] opacity-50'
                            : task.status === 'cut'
                            ? 'bg-white/[0.01] border-white/[0.03] opacity-40 line-through'
                            : task.status === 'in_progress'
                            ? 'bg-accent/10 border-accent/40 shadow-glow'
                            : 'glass-card border-white/[0.06] hover:border-white/[0.12]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono ${priorityColors[task.priority]}`}>
                            {task.priority}
                          </span>
                          <span className="text-[10px] font-mono text-muted">~{task.estimatedMinutes}m</span>
                        </div>

                        <h4
                          className={`text-xs font-semibold leading-snug ${
                            task.status === 'done' ? 'line-through text-muted' : 'text-white'
                          }`}
                        >
                          {task.title}
                        </h4>

                        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/[0.06] text-[10px]">
                          <span className="text-muted font-mono">Impact: {task.impactLevel}</span>

                          <div className="flex items-center gap-1.5">
                            {task.status !== 'done' && task.status !== 'cut' && (
                              <>
                                {task.status !== 'in_progress' && (
                                  <button
                                    onClick={() => {
                                      startTask(task.id);
                                      toast.info(`Started: ${task.title}`);
                                    }}
                                    className="p-1 rounded-lg text-accent hover:bg-accent/15 transition-colors"
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
                                  className="p-1 rounded-lg text-emerald-400 hover:bg-emerald-500/15 transition-colors"
                                  title="Mark as done"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    cutTask(task.id);
                                    toast.warning(`Cut: ${task.title}`);
                                  }}
                                  className="p-1 rounded-lg text-muted hover:text-red-400 hover:bg-red-500/15 transition-colors"
                                  title="Cut task from plan"
                                >
                                  <Scissors className="w-3 h-3" />
                                </button>
                              </>
                            )}
                            {task.status === 'done' && (
                              <span className="text-emerald-400 flex items-center gap-1 font-mono font-medium">
                                <Check className="w-3 h-3" /> Done
                              </span>
                            )}
                            {task.status === 'cut' && (
                              <span className="text-muted font-mono text-[10px]">Trimmed</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {stageTasks.length === 0 && (
                      <div className="p-5 rounded-xl border border-dashed border-white/[0.08] text-center text-xs text-muted">
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
          <div className="glass-panel rounded-2xl border border-white/[0.06] overflow-hidden chamfer-top">
            <div className="p-3 border-b border-white/[0.06] flex items-center justify-between text-xs text-muted font-mono bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-accent" />
                <span>Filter by Stage:</span>
                {['ALL', 'NOW', 'NEXT', 'LATER', 'SUBMISSION'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStage(s)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors ${
                      filterStage === s
                        ? 'bg-accent text-white'
                        : 'bg-white/[0.04] text-muted hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <span>{filteredTasks.length} Tasks Listed</span>
            </div>

            <div className="divide-y divide-white/[0.06]">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="px-4 py-3 flex items-center justify-between gap-4 hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold ${stageColors[task.stage].badge}`}>
                      {task.stage}
                    </span>
                    <span
                      className={`text-xs font-medium truncate ${
                        task.status === 'done' ? 'line-through text-muted' : 'text-white'
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-xs font-mono">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>
                      {task.priority}
                    </span>
                    <span className="text-muted text-[11px]">~{task.estimatedMinutes}m</span>
                    <span className="text-accent-light text-[11px]">Impact: {task.impactLevel}</span>

                    <div className="flex items-center gap-1.5 ml-2">
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
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              cutTask(task.id);
                              toast.warning(`Cut: ${task.title}`);
                            }}
                            className="p-1 rounded text-muted hover:text-red-400 hover:bg-red-500/15"
                            title="Cut task"
                          >
                            <Scissors className="w-3 h-3" />
                          </button>
                        </>
                      )}
                      {task.status === 'done' && (
                        <span className="text-emerald-400 text-xs">✓ Done</span>
                      )}
                      {task.status === 'cut' && (
                        <span className="text-muted text-xs">Trimmed</span>
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
      <div className="glass-panel rounded-2xl p-6 border border-white/[0.06] chamfer-top">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-extrabold text-white tracking-tight">Submission Checklist</h2>
            </div>
            <p className="text-secondary text-xs mt-1">
              Directly contributes 20% to your live Max Score. Every link is verified before judging.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-36 h-2 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent to-emerald-400 transition-all duration-500"
                style={{ width: `${(verifiedCount / Math.max(checklist.length, 1)) * 100}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-accent-bright">
              {verifiedCount} of {checklist.length} Verified
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {checklist.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all chamfer-top ${
                item.completed
                  ? 'bg-emerald-500/5 border-emerald-500/20'
                  : item.required
                  ? 'glass-card border-white/[0.06] hover:border-accent/30'
                  : 'bg-white/[0.02] border-white/[0.04]'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => {
                    dispatch({ type: 'toggle_check', id: item.id });
                    toast.info(`Updated: ${item.label}`);
                  }}
                  className={`w-5 h-5 rounded-lg mt-0.5 flex items-center justify-center border transition-all ${
                    item.completed
                      ? 'bg-emerald-500 border-emerald-400 text-white shadow-emerald'
                      : 'border-white/[0.15] hover:border-accent bg-[#131622]'
                  }`}
                >
                  {item.completed && <Check className="w-3.5 h-3.5" />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-white truncate">{item.label}</p>
                    {item.required ? (
                      <span className="text-[9px] px-2 py-0.2 rounded-full bg-red-500/15 text-red-400 font-mono font-bold uppercase">
                        Required
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted font-mono">Optional</span>
                    )}
                  </div>

                  {/* Value / Deliverable Link */}
                  <div className="mt-2.5 flex items-center justify-between text-xs">
                    {item.value ? (
                      <a
                        href={item.value}
                        target="_blank"
                        rel="noreferrer"
                        className="text-accent-light hover:underline truncate max-w-xs text-[11px] font-mono flex items-center gap-1.5"
                      >
                        <span className="truncate">{item.value}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-muted text-[11px] font-mono italic">No URL configured</span>
                    )}

                    <button
                      onClick={() => {
                        setEditingCheckId(item.id);
                        setCheckValueInput(item.value || '');
                      }}
                      className="text-[11px] text-secondary hover:text-white font-medium hover:underline shrink-0 ml-2"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="glass-elevated border border-white/[0.12] rounded-2xl p-6 w-full max-w-md shadow-2xl chamfer-top animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.08]">
              <h3 className="font-extrabold text-white text-sm">Add New Max Plan Task</h3>
              <button
                onClick={() => setIsAddTaskOpen(false)}
                className="p-1.5 rounded-lg text-secondary hover:text-white hover:bg-white/[0.06]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block text-secondary mb-1.5 font-medium">Task Title</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Record 2-minute video walkthrough"
                  required
                  className="w-full py-2.5 px-3 rounded-xl bg-[#131622] border border-white/[0.08] text-white placeholder:text-muted focus:outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-secondary mb-1.5 font-medium">Execution Stage</label>
                  <select
                    value={taskStage}
                    onChange={(e) => setTaskStage(e.target.value as TaskStage)}
                    className="w-full py-2.5 px-2.5 rounded-xl bg-[#131622] border border-white/[0.08] text-white focus:outline-none focus:border-accent font-mono text-xs"
                  >
                    <option value="NOW">NOW (Immediate)</option>
                    <option value="NEXT">NEXT (Secondary)</option>
                    <option value="LATER">LATER (Buffer)</option>
                    <option value="SUBMISSION">SUBMISSION (Packaging)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-secondary mb-1.5 font-medium">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
                    className="w-full py-2.5 px-2.5 rounded-xl bg-[#131622] border border-white/[0.08] text-white focus:outline-none focus:border-accent font-mono text-xs"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-secondary mb-1.5 font-medium">Estimated Time</label>
                  <select
                    value={taskEst}
                    onChange={(e) => setTaskEst(Number(e.target.value))}
                    className="w-full py-2.5 px-2.5 rounded-xl bg-[#131622] border border-white/[0.08] text-white focus:outline-none focus:border-accent font-mono text-xs"
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
                  <label className="block text-secondary mb-1.5 font-medium">Score Impact</label>
                  <select
                    value={taskImpact}
                    onChange={(e) => setTaskImpact(e.target.value as ImpactLevel)}
                    className="w-full py-2.5 px-2.5 rounded-xl bg-[#131622] border border-white/[0.08] text-white focus:outline-none focus:border-accent font-mono text-xs"
                  >
                    <option value="CRITICAL">CRITICAL (+6-9 Pts)</option>
                    <option value="HIGH">HIGH (+3-5 Pts)</option>
                    <option value="MEDIUM">MEDIUM (+1-2 Pts)</option>
                    <option value="LOW">LOW (&lt;1 Pt)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2.5 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsAddTaskOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.04] text-secondary hover:text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-accent to-indigo-600 text-white font-bold hover:from-accent-bright hover:to-indigo-500 shadow-glow"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="glass-elevated border border-white/[0.12] rounded-2xl p-6 w-full max-w-md shadow-2xl chamfer-top animate-in zoom-in-95 duration-150">
            <h3 className="font-bold text-white text-sm mb-3">Update Deliverable URL</h3>
            <input
              type="text"
              value={checkValueInput}
              onChange={(e) => setCheckValueInput(e.target.value)}
              placeholder="https://..."
              className="w-full py-2.5 px-3 rounded-xl bg-[#131622] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-accent mb-4 font-mono"
              autoFocus
            />
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setEditingCheckId(null)}
                className="px-4 py-2 rounded-xl bg-white/[0.04] text-secondary hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveCheckValue(editingCheckId)}
                className="px-5 py-2 rounded-xl bg-accent text-white font-bold hover:bg-accent-bright shadow-glow"
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