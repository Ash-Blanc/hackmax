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
} from 'lucide-react';
import { toast } from 'sonner';
import type { Task, TaskStage, TaskPriority, ImpactLevel } from '@/types';

const stageColors: Record<TaskStage, { badge: string; border: string }> = {
  NOW: { badge: 'bg-red-500/10 text-red-400 border-red-500/20', border: 'border-t-2 border-t-red-500' },
  NEXT: { badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', border: 'border-t-2 border-t-yellow-500' },
  LATER: { badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20', border: 'border-t-2 border-t-blue-500' },
  SUBMISSION: { badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20', border: 'border-t-2 border-t-purple-500' },
};

const priorityColors: Record<TaskPriority, string> = {
  CRITICAL: 'bg-red-500/10 text-red-400 border border-red-500/20 font-bold',
  HIGH: 'bg-orange-500/10 text-orange-400 border border-orange-500/20 font-medium',
  MEDIUM: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  LOW: 'bg-muted/10 text-muted border border-border',
};

export default function HackathonWorkspace() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, liveMaxScore, startTask, completeTask, cutTask, dispatch } = useHackMaxStore();

  const hackathon = state.hackathons.find((h) => h.id === id) || state.hackathons[0];

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
        <div className="text-center p-8 glass rounded-2xl border border-border">
          <p className="text-xl font-bold text-fg mb-2">Hackathon Not Found</p>
          <button
            onClick={() => navigate('/hackathons')}
            className="px-4 py-2 bg-accent text-white rounded-lg text-xs font-semibold"
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
    toast.success('Updated checklist item link!');
    setEditingCheckId(null);
    setCheckValueInput('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Workspace Header */}
      <div className="glass rounded-2xl p-6 border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-fg tracking-tight">{hackathon.title}</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-success/10 border border-success/20 text-success text-[11px] font-semibold">
              ● {hackathon.status.toUpperCase()}
            </span>
          </div>
          <p className="text-secondary text-xs mt-1.5 max-w-2xl leading-relaxed">{hackathon.description}</p>
          <div className="flex items-center gap-4 mt-3 text-xs text-muted">
            <a
              href={hackathon.url}
              target="_blank"
              rel="noreferrer"
              className="text-accent-light hover:underline flex items-center gap-1 font-medium"
            >
              <span>DevPost Brief</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <span>Prize Pool: <strong className="text-fg font-mono">{hackathon.prizePool}</strong></span>
          </div>
        </div>

        {/* Readiness telemetry box */}
        <div className="flex items-center gap-4 bg-elevated/80 p-4 rounded-xl border border-border shrink-0">
          <div className="text-center pr-4 border-r border-border">
            <p className="text-[10px] text-muted uppercase tracking-wider font-semibold flex items-center justify-center gap-1">
              <Clock className="w-3 h-3 text-red-400" /> Time Remaining
            </p>
            <p className="text-xl font-bold font-mono text-red-400 mt-0.5">
              {dDays}d {dHours}h {dMins}m
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-muted uppercase tracking-wider font-semibold">Max Score</p>
            <p className="text-xl font-bold font-mono text-accent-light mt-0.5">{liveMaxScore}/100</p>
          </div>
        </div>
      </div>

      {/* Judging Criteria Breakdown */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-bold text-fg">Judging Criteria Breakdown</h2>
            <p className="text-secondary text-xs">Weighted analysis and instant AI fixes</p>
          </div>
          <button
            onClick={() => navigate('/judge')}
            className="text-xs font-semibold text-accent-light hover:underline flex items-center gap-1"
          >
            <span>Simulate AI Judges</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {criteria.map((c) => (
            <div
              key={c.id}
              className="glass rounded-xl p-4 border border-border hover:border-accent/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-fg truncate">{c.name}</span>
                  <span className="text-[10px] text-muted font-mono">{c.weight}x wt</span>
                </div>
                <div className="flex items-baseline gap-1 my-1">
                  <span className="text-2xl font-bold font-mono text-fg">{c.score}</span>
                  <span className="text-xs text-muted font-mono">/ 10</span>
                  <span className="text-[10px] text-muted ml-auto font-mono">
                    {Math.round(c.confidence * 100)}% conf.
                  </span>
                </div>
                <p className="text-[11px] text-secondary line-clamp-2 mt-1 leading-snug">{c.explanation}</p>
              </div>

              {c.recommendedFix && (
                <div className="mt-3 pt-2 border-t border-border/60 text-[10px] text-accent-light">
                  <span className="text-muted block text-[9px] uppercase font-semibold">AI Fix:</span>
                  <span className="line-clamp-2">{c.recommendedFix}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Max Plan 4-Column Execution Board */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-bold text-fg">Max Plan Board</h2>
            <p className="text-secondary text-xs">
              Time-partitioned tasks organized by execution urgency and impact
            </p>
          </div>
          <button
            onClick={() => setIsAddTaskOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-accent hover:bg-accent-bright text-white rounded-lg text-xs font-semibold shadow-glow transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stageKeys.map((stage) => {
            const stageTasks = tasks.filter((t) => t.stage === stage);
            return (
              <div
                key={stage}
                className={`glass rounded-xl p-3 border border-border flex flex-col ${stageColors[stage].border}`}
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${stageColors[stage].badge}`}>
                      {stage}
                    </span>
                    <span className="text-xs font-mono text-muted">({stageTasks.length})</span>
                  </div>
                  <button
                    onClick={() => {
                      setTaskStage(stage);
                      setIsAddTaskOpen(true);
                    }}
                    className="p-1 rounded text-muted hover:text-fg hover:bg-elevated"
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
                      className={`p-3 rounded-xl bg-surface border transition-all ${
                        task.status === 'done'
                          ? 'border-border/40 opacity-50 bg-surface/40'
                          : task.status === 'cut'
                          ? 'border-border/30 opacity-40 line-through'
                          : task.status === 'in_progress'
                          ? 'border-accent/40 shadow-sm bg-accent/5'
                          : 'border-border hover:border-border/80'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded ${priorityColors[task.priority]}`}>
                          {task.priority}
                        </span>
                        <span className="text-[10px] font-mono text-muted">~{task.estimatedMinutes}m</span>
                      </div>

                      <h4
                        className={`text-xs font-medium leading-snug ${
                          task.status === 'done' ? 'line-through text-muted' : 'text-fg'
                        }`}
                      >
                        {task.title}
                      </h4>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50 text-[10px]">
                        <span className="text-muted">Impact: {task.impactLevel}</span>

                        <div className="flex items-center gap-1.5">
                          {task.status !== 'done' && task.status !== 'cut' && (
                            <>
                              {task.status !== 'in_progress' && (
                                <button
                                  onClick={() => {
                                    startTask(task.id);
                                    toast.info(`Started: ${task.title}`);
                                  }}
                                  className="p-1 rounded text-accent hover:bg-accent/10"
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
                                className="p-1 rounded text-success hover:bg-success/10"
                                title="Mark as done"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  cutTask(task.id);
                                  toast.warning(`Cut: ${task.title}`);
                                }}
                                className="p-1 rounded text-muted hover:text-red-400 hover:bg-red-500/10"
                                title="Cut task from plan"
                              >
                                <Scissors className="w-3 h-3" />
                              </button>
                            </>
                          )}
                          {task.status === 'done' && (
                            <span className="text-success flex items-center gap-1 font-medium">
                              <Check className="w-3 h-3" /> Done
                            </span>
                          )}
                          {task.status === 'cut' && (
                            <span className="text-muted text-[10px]">Cut</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {stageTasks.length === 0 && (
                    <div className="p-4 rounded-xl border border-dashed border-border text-center text-xs text-muted">
                      No tasks in {stage}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Submission Checklist */}
      <div className="glass rounded-2xl p-6 border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-fg">Submission Checklist</h2>
            <p className="text-secondary text-xs">
              Directly contributes 20% to your live Max Score readiness. Every link is verified.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-accent-light">
            {checklist.filter((c) => c.completed).length} of {checklist.length} Verified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {checklist.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all ${
                item.completed
                  ? 'bg-success/5 border-success/20'
                  : item.required
                  ? 'bg-surface border-border hover:border-accent/30'
                  : 'bg-surface/50 border-border'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => {
                    dispatch({ type: 'toggle_check', id: item.id });
                    toast.info(`Updated: ${item.label}`);
                  }}
                  className={`w-5 h-5 rounded mt-0.5 flex items-center justify-center border transition-all ${
                    item.completed
                      ? 'bg-success border-success text-white'
                      : 'border-border hover:border-accent bg-elevated'
                  }`}
                >
                  {item.completed && <Check className="w-3.5 h-3.5" />}
                </button>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className={`text-xs font-semibold ${item.completed ? 'text-fg' : 'text-fg'}`}>
                      {item.label}
                    </p>
                    {item.required ? (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-500/10 text-red-400 font-semibold uppercase">
                        Required
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted">Optional</span>
                    )}
                  </div>

                  {/* Value / Link Display */}
                  <div className="mt-2 flex items-center justify-between text-xs">
                    {item.value ? (
                      <a
                        href={item.value}
                        target="_blank"
                        rel="noreferrer"
                        className="text-accent-light hover:underline truncate max-w-xs text-[11px] font-mono flex items-center gap-1"
                      >
                        <span>{item.value}</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-muted text-[11px] italic">No URL configured</span>
                    )}

                    <button
                      onClick={() => {
                        setEditingCheckId(item.id);
                        setCheckValueInput(item.value || '');
                      }}
                      className="text-[11px] text-secondary hover:text-fg font-medium hover:underline shrink-0 ml-2"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
              <h3 className="font-bold text-fg text-sm">Add New Max Plan Task</h3>
              <button
                onClick={() => setIsAddTaskOpen(false)}
                className="p-1 rounded text-secondary hover:text-fg"
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
                  placeholder="e.g. Record 2-minute demo walkthrough"
                  required
                  className="w-full py-2.5 px-3 rounded-lg bg-elevated border border-border text-fg placeholder:text-muted focus:outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-secondary mb-1.5 font-medium">Execution Stage</label>
                  <select
                    value={taskStage}
                    onChange={(e) => setTaskStage(e.target.value as TaskStage)}
                    className="w-full py-2 px-2.5 rounded-lg bg-elevated border border-border text-fg focus:outline-none focus:border-accent"
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
                    className="w-full py-2 px-2.5 rounded-lg bg-elevated border border-border text-fg focus:outline-none focus:border-accent"
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
                    className="w-full py-2 px-2.5 rounded-lg bg-elevated border border-border text-fg focus:outline-none focus:border-accent"
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
                    className="w-full py-2 px-2.5 rounded-lg bg-elevated border border-border text-fg focus:outline-none focus:border-accent"
                  >
                    <option value="CRITICAL">CRITICAL (+6-9 Pts)</option>
                    <option value="HIGH">HIGH (+3-5 Pts)</option>
                    <option value="MEDIUM">MEDIUM (+1-2 Pts)</option>
                    <option value="LOW">LOW (&lt;1 Pt)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAddTaskOpen(false)}
                  className="px-4 py-2 rounded-lg bg-elevated text-secondary hover:text-fg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-accent text-white font-bold hover:bg-accent-bright shadow-glow"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="font-bold text-fg text-sm mb-3">Update Deliverable URL</h3>
            <input
              type="text"
              value={checkValueInput}
              onChange={(e) => setCheckValueInput(e.target.value)}
              placeholder="https://..."
              className="w-full py-2.5 px-3 rounded-lg bg-elevated border border-border text-xs text-fg focus:outline-none focus:border-accent mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setEditingCheckId(null)}
                className="px-4 py-2 rounded-lg bg-elevated text-secondary hover:text-fg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveCheckValue(editingCheckId)}
                className="px-5 py-2 rounded-lg bg-accent text-white font-bold hover:bg-accent-bright"
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