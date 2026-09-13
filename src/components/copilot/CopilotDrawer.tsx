import { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  Scissors,
  ArrowRight,
  TrendingUp,
  Lightbulb,
  Check,
  Flame,
  Copy,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import { useHackMaxStore } from '@/lib/store';
import { toast } from 'sonner';

interface CopilotDrawerProps {
  open: boolean;
  onClose: () => void;
}

interface ActionCardData {
  type: 'cut_tasks' | 'next_action' | 'pitch_variants' | 'judge_fix';
  title: string;
  description?: string;
  buttonText?: string;
  meta?: any;
}

interface Message {
  id: string;
  sender: 'user' | 'max';
  text: string;
  actionCard?: ActionCardData;
}

export default function CopilotDrawer({ open, onClose }: CopilotDrawerProps) {
  const { state, primaryHackathon, liveMaxScore, hoursRemaining, nextTask, cutTask, startTask, completeTask, dispatch } =
    useHackMaxStore();

  const [input, setInput] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedHookTab, setSelectedHookTab] = useState<number>(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-init',
      sender: 'max',
      text: `Hey Ash! I'm Max, your hackathon AI copilot. I'm actively analyzing your repo telemetry, criteria weights, and deadline clock for "${primaryHackathon?.title}". You have ${Math.round(hoursRemaining)} hours remaining with a live Max Score of ${liveMaxScore}/100. Ask me what to prioritize, what to cut, or how to boost your judging score.`,
    },
  ]);

  if (!open) return null;

  const handleSend = (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: userText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Process Copilot intelligence
    setTimeout(() => {
      const lower = userText.toLowerCase();
      let reply: Message;

      if (lower.includes('cut') || lower.includes('deadline') || lower.includes('drop') || lower.includes('triage')) {
        const cuttable = state.tasks.filter(
          (t) =>
            t.hackathonId === primaryHackathon?.id &&
            (t.stage === 'LATER' || t.impactLevel === 'LOW' || t.impactLevel === 'MEDIUM') &&
            t.status !== 'done' &&
            t.status !== 'cut'
        );
        reply = {
          id: `m-${Date.now()}`,
          sender: 'max',
          text: `With only ${Math.round(hoursRemaining)} hours remaining, spending time on low-leverage tasks will penalize your demo quality. I've prepared a triage plan to protect your final polish:`,
          actionCard: {
            type: 'cut_tasks',
            title: `Plan Triage Diff (${cuttable.length} non-essential tasks)`,
            meta: {
              tasks: cuttable,
              totalMinutesSaved: cuttable.reduce((acc, curr) => acc + curr.estimatedMinutes, 0),
            },
          },
        };
      } else if (lower.includes('next') || lower.includes('do next') || lower.includes('highest impact') || lower.includes('prioritize')) {
        reply = {
          id: `m-${Date.now()}`,
          sender: 'max',
          text: `Your single highest score-per-hour action right now is "${nextTask?.title ?? 'Record 2-minute demo video'}". Here is the calculated return:`,
          actionCard: {
            type: 'next_action',
            title: nextTask?.title ?? 'Record 2-minute demo video',
            description: `Impact: ${nextTask?.impactLevel ?? 'CRITICAL'} • Est: ${nextTask?.estimatedMinutes ?? 45} mins.\nDirectly drives Innovation & Technical criteria, lifting Max Score by ~+6 points.`,
            buttonText: nextTask?.status === 'in_progress' ? 'Mark Task as Done' : 'Start Task Now',
            meta: { taskId: nextTask?.id, status: nextTask?.status },
          },
        };
      } else if (lower.includes('pitch') || lower.includes('hook') || lower.includes('narrative') || lower.includes('script')) {
        reply = {
          id: `m-${Date.now()}`,
          sender: 'max',
          text: `I analyzed winning hackathon submissions across DevPost. Judges decide in the first 15 seconds. Here are 3 calibrated pitch hooks for your project:`,
          actionCard: {
            type: 'pitch_variants',
            title: '15-Second High-Conversion Pitch Hooks',
            meta: {
              variants: [
                {
                  label: 'Bold Founder',
                  hook: '"While ChatGPT makes you copy-paste between 5 tabs, HackMax autonomously cross-references arXiv, GitHub, and live APIs in 42 seconds with zero hallucinations."',
                  takeaway: 'Emphasizes autonomous execution vs manual copy-paste.',
                },
                {
                  label: 'Technical Edge',
                  hook: '"We built a sub-second multi-agent DAG engine running on WebAssembly that verifies code syntax and runtime safety before returning results."',
                  takeaway: 'Highlights architectural speed and technical rigor.',
                },
                {
                  label: 'Metric-Driven',
                  hook: '"In benchmark testing against 12 competitive models, our agentic workflow cut research latency by 73% while raising precision from 81% to 99.4%."',
                  takeaway: 'Immediate numeric proof for data-driven judges.',
                },
              ],
            },
          },
        };
      } else if (lower.includes('track') || lower.includes('score') || lower.includes('ready') || lower.includes('blocker')) {
        reply = {
          id: `m-${Date.now()}`,
          sender: 'max',
          text: `You are currently at ${liveMaxScore}/100. You are in the top tier of readiness, but your demo walkthrough video is missing. Submitting without a video carries an automatic penalty because judges rarely run code locally:`,
          actionCard: {
            type: 'judge_fix',
            title: 'Critical Submission Blocker: Demo Video',
            description: 'Judges allocate 40% of presentation marks to the walkthrough. Recording a crisp 2-minute video adds +18 projected points.',
            buttonText: 'Add "Record Video" to NOW Stage',
            meta: {
              task: {
                id: `task-video-${Date.now()}`,
                hackathonId: primaryHackathon?.id || 'hack-1',
                title: 'Record 2-Minute Screen Walkthrough',
                stage: 'NOW' as const,
                priority: 'CRITICAL' as const,
                estimatedMinutes: 45,
                impactLevel: 'CRITICAL' as const,
                status: 'todo' as const,
                sortOrder: 0,
                createdAt: new Date().toISOString(),
              },
            },
          },
        };
      } else {
        reply = {
          id: `m-${Date.now()}`,
          sender: 'max',
          text: `Analyzing "${userText}" against your active project DNA and criteria weights... My recommendation is to focus 100% of remaining energy on end-to-end demo flow. Would you like me to generate pitch hooks or prune non-essential backlog tasks?`,
        };
      }

      setMessages((prev) => [...prev, reply]);
    }, 450);
  };

  const handleCopyVariant = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success('Copied pitch hook to clipboard!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg glass-elevated border-l border-white/[0.1] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent to-indigo-500 p-0.5 shadow-glow flex items-center justify-center">
            <div className="w-full h-full bg-[#0d0f17] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-accent animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-white text-sm">Ask Max</h3>
              <span className="flex items-center gap-1 px-2 py-0.2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active AX
              </span>
            </div>
            <p className="text-[11px] text-secondary font-mono mt-0.5">
              Score: <span className="text-accent-bright font-bold">{liveMaxScore}/100</span> •{' '}
              <span className="text-red-400">{Math.round(hoursRemaining)}h left</span>
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl text-secondary hover:text-white hover:bg-white/[0.06] transition-colors"
          title="Close Copilot (Esc)"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested chips */}
      <div className="p-3 border-b border-white/[0.06] bg-[#0d0f17]/80 flex gap-2 overflow-x-auto no-scrollbar">
        {[
          { label: 'What should I cut?', icon: Scissors },
          { label: 'What should I do next?', icon: ArrowRight },
          { label: 'Review pitch hook', icon: Lightbulb },
          { label: 'Am I on track?', icon: TrendingUp },
        ].map((chip) => (
          <button
            key={chip.label}
            onClick={() => handleSend(chip.label)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-pill text-[11px] text-secondary hover:text-white hover:border-accent/40 transition-all shrink-0 whitespace-nowrap"
          >
            <chip.icon className="w-3 h-3 text-accent" />
            <span>{chip.label}</span>
          </button>
        ))}
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-gradient-to-r from-accent to-indigo-600 text-white rounded-br-none shadow-glow font-medium'
                  : 'glass-card border-white/[0.08] text-white rounded-bl-none shadow-sm chamfer-top'
              }`}
            >
              <p className="whitespace-pre-wrap">{m.text}</p>
            </div>

            {/* Rich Generative UI Action Cards */}
            {m.actionCard && (
              <div className="w-[94%] mt-3 p-4 rounded-2xl glass-elevated border border-accent/30 shadow-xl chamfer-top animate-in zoom-in-95 duration-200">
                {/* Variant 1: Triage Diff Widget */}
                {m.actionCard.type === 'cut_tasks' && (
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.08]">
                      <div className="flex items-center gap-2">
                        <Scissors className="w-4 h-4 text-red-400" />
                        <h4 className="text-xs font-bold text-white">{m.actionCard.title}</h4>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                        ~{m.actionCard.meta.totalMinutesSaved}m Saved
                      </span>
                    </div>

                    <div className="space-y-1.5 max-h-40 overflow-y-auto no-scrollbar my-2">
                      {m.actionCard.meta.tasks?.map((t: any) => (
                        <div
                          key={t.id}
                          className="flex items-center justify-between text-xs p-2 rounded-lg bg-red-500/5 border border-red-500/15"
                        >
                          <span className="text-red-300 truncate">{t.title}</span>
                          <span className="text-[10px] font-mono text-muted shrink-0 ml-2">
                            ~{t.estimatedMinutes}m
                          </span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        m.actionCard?.meta.tasks?.forEach((t: any) => cutTask(t.id));
                        toast.success(
                          `Pruned ${m.actionCard?.meta.tasks?.length} tasks! Focus protected for demo recording.`
                        );
                      }}
                      className="w-full mt-2 py-2.5 px-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Scissors className="w-3.5 h-3.5" />
                      <span>Execute 1-Click Plan Triage</span>
                    </button>
                  </div>
                )}

                {/* Variant 2: Pitch Variants Selector Widget */}
                {m.actionCard.type === 'pitch_variants' && (
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.08]">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-400" />
                        <h4 className="text-xs font-bold text-white">{m.actionCard.title}</h4>
                      </div>
                      <span className="text-[10px] font-mono text-accent-light">3 Styles</span>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] mb-3">
                      {m.actionCard.meta.variants?.map((v: any, idx: number) => (
                        <button
                          key={v.label}
                          onClick={() => setSelectedHookTab(idx)}
                          className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-mono font-medium transition-all ${
                            selectedHookTab === idx
                              ? 'bg-accent text-white shadow-glow'
                              : 'text-muted hover:text-white'
                          }`}
                        >
                          {v.label}
                        </button>
                      ))}
                    </div>

                    {/* Selected Hook Details */}
                    {m.actionCard.meta.variants?.[selectedHookTab] && (
                      <div className="p-3 rounded-xl bg-[#131622] border border-white/[0.06] text-xs">
                        <p className="text-white font-medium leading-relaxed italic mb-2">
                          {m.actionCard.meta.variants[selectedHookTab].hook}
                        </p>
                        <p className="text-[10px] text-muted font-mono">
                          Target: {m.actionCard.meta.variants[selectedHookTab].takeaway}
                        </p>

                        <button
                          onClick={() =>
                            handleCopyVariant(
                              m.actionCard?.meta.variants[selectedHookTab].hook,
                              selectedHookTab
                            )
                          }
                          className="w-full mt-3 py-2 px-3 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.08] text-xs font-semibold transition-all flex items-center justify-center gap-2"
                        >
                          {copiedIndex === selectedHookTab ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied to Clipboard!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-accent" />
                              <span>Copy Pitch Hook</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Variant 3: Highest-Impact Next Action Widget */}
                {m.actionCard.type === 'next_action' && (
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.08]">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-accent" />
                        <h4 className="text-xs font-bold text-white">{m.actionCard.title}</h4>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/20 text-accent-bright font-mono font-bold">
                        +6 Pts
                      </span>
                    </div>

                    <p className="text-xs text-secondary leading-relaxed mb-3">
                      {m.actionCard.description}
                    </p>

                    <button
                      onClick={() => {
                        if (m.actionCard?.meta.status === 'in_progress') {
                          completeTask(m.actionCard.meta.taskId);
                          toast.success('Task marked as completed! Max Score updated.');
                        } else {
                          startTask(m.actionCard?.meta.taskId);
                          toast.info('Started task! In-progress timer ticking.');
                        }
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-accent to-indigo-600 hover:from-accent-bright hover:to-indigo-500 text-white text-xs font-bold shadow-glow transition-all flex items-center justify-center gap-2"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>{m.actionCard.buttonText}</span>
                    </button>
                  </div>
                )}

                {/* Variant 4: Judge Fix Injector */}
                {m.actionCard.type === 'judge_fix' && (
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.08]">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-red-400" />
                        <h4 className="text-xs font-bold text-white">{m.actionCard.title}</h4>
                      </div>
                      <span className="text-[10px] font-mono text-red-400 font-bold">Blocker</span>
                    </div>

                    <p className="text-xs text-secondary leading-relaxed mb-3">
                      {m.actionCard.description}
                    </p>

                    <button
                      onClick={() => {
                        dispatch({ type: 'add_task', task: m.actionCard?.meta.task });
                        toast.success('Added critical task to NOW execution stage!');
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-accent to-indigo-600 hover:from-accent-bright hover:to-indigo-500 text-white text-xs font-bold shadow-glow transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{m.actionCard.buttonText}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-3.5 border-t border-white/[0.08] bg-[#0d0f17]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Max about deadlines, triage, pitch hooks..."
            className="flex-1 py-2.5 px-3.5 bg-[#131622] border border-white/[0.08] rounded-xl text-xs text-white placeholder:text-muted focus:outline-none focus:border-accent"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2.5 rounded-xl bg-gradient-to-r from-accent to-indigo-600 text-white hover:from-accent-bright hover:to-indigo-500 disabled:opacity-40 transition-all shadow-glow"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
