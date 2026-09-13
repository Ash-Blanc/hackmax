import { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Scissors,
  ArrowRight,
  Lightbulb,
  Check,
  Flame,
  Copy,
  Plus,
  ShieldCheck,
  User,
  CornerDownLeft,
  Video,
  Award,
} from 'lucide-react';
import { useHackMaxStore } from '@/lib/store';
import { CubeLogo } from '@/components/common/CubeLogo';
import { toast } from 'sonner';

interface CopilotDrawerProps {
  open: boolean;
  onClose: () => void;
}

interface ActionCardData {
  type: 'cut_tasks' | 'next_action' | 'pitch_variants' | 'judge_fix' | 'video_script' | 'judging_rubric';
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
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-init',
      sender: 'max',
      text: `Hey Ash! I'm Max, your hackathon mentor and AI copilot. Whether this is your first hackathon or your tenth, I'm here to help you prioritize your core MVP, script a winning 2-minute demo video, and submit on time. You currently have ${Math.round(hoursRemaining)} hours remaining with a live Max Score of ${liveMaxScore}/100. Ask me what to prioritize, what tasks to cut, or how to win your prize track!`,
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (open) {
      scrollToBottom();
    }
  }, [messages, open]);

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
    setIsTyping(true);

    // Process Copilot intelligence with simulated streaming latency
    setTimeout(() => {
      setIsTyping(false);
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
      } else if (lower.includes('video') || lower.includes('script')) {
        reply = {
          id: `m-${Date.now()}`,
          sender: 'max',
          text: `Here is the proven 2-minute (120s) hackathon video formula used by podium winners. Judges watch dozens of submissions—following this structure guarantees maximum retention and points:`,
          actionCard: {
            type: 'video_script',
            title: 'Winning 2-Minute Demo Video Script',
            meta: {
              parts: [
                {
                  time: '0:00 - 0:20',
                  phase: '1. The Problem Hook',
                  script: 'Start directly with the human pain: "Have you ever tried to ... and spent 3 hours stuck? We faced this exact issue."',
                  tip: 'Do NOT show code or architecture yet. Establish empathy and problem urgency.',
                },
                {
                  time: '0:20 - 0:45',
                  phase: '2. The Solution & Value',
                  script: '"Introducing HackMax: the autonomous AI workspace that turns that 3-hour struggle into a 15-second 1-click workflow."',
                  tip: 'State your 1-sentence value proposition clearly without technical buzzwords.',
                },
                {
                  time: '0:45 - 1:40',
                  phase: '3. Live Working Software',
                  script: '"Let us show you how it works in real time. Watch what happens when I click here..." (Click through core workflow)',
                  tip: '80% of points come from this! Show the actual running software. Never use static slide decks.',
                },
                {
                  time: '1:40 - 2:00',
                  phase: '4. Tech Stack & What Next',
                  script: '"We built this using React, TypeScript, and FastAPI. In the future, we plan to expand with multi-agent orchestration. Thank you!"',
                  tip: 'Briefly mention sponsor APIs/models used (to win partner bounties) and keep it under 2 minutes.',
                },
              ],
              fullTemplate: `[0:00 - 0:20] THE HOOK\n"Have you ever tried to build something under extreme pressure, only to waste 3 hours on setup? We faced this exact issue."\n\n[0:20 - 0:45] THE SOLUTION\n"Meet HackMax: the autonomous AI copilot that optimizes your workflow and ensures you ship on time."\n\n[0:45 - 1:40] LIVE WORKING DEMO\n"Here is the live running software. Notice how clicking this action immediately calculates and executes the highest-impact task..."\n\n[1:40 - 2:00] TECH STACK & BOUNTIES\n"Built with React, Vite, and AI APIs. Thank you for watching!"`,
            },
          },
        };
      } else if (lower.includes('judge') || lower.includes('grade') || lower.includes('rubric')) {
        reply = {
          id: `m-${Date.now()}`,
          sender: 'max',
          text: `Hackathon judges typically evaluate your submission in just 2 to 3 minutes. Here is the standard 4-pillar rubric decoded for students:`,
          actionCard: {
            type: 'judging_rubric',
            title: 'How Hackathon Judges Grade (Rubric Breakdown)',
            meta: {
              criteria: [
                {
                  name: 'Technical Execution (30%)',
                  what: 'Does your demo actually work live without crashing?',
                  proTip: 'A live deployed URL (e.g. on Vercel/Render) beats localhost screenshots every single time.',
                },
                {
                  name: 'Innovation & Originality (25%)',
                  what: 'Is this a novel approach or an unexpected combination of APIs?',
                  proTip: 'Even if the problem is common, show a unique angle or novel multi-agent interaction.',
                },
                {
                  name: 'UI/UX & Product Polish (25%)',
                  what: 'Is the interface clear, intuitive, and beginner-friendly?',
                  proTip: 'Judges shouldn\'t need a tutorial. Clean spacing, working buttons, and zero dead links win points.',
                },
                {
                  name: 'Real-World Impact (20%)',
                  what: 'Would real users or students actually use this on Monday morning?',
                  proTip: 'Clearly show who benefits from this tool and why existing alternatives fall short.',
                },
              ],
            },
          },
        };
      } else if (lower.includes('pitch') || lower.includes('hook') || lower.includes('narrative')) {
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
          text: `Analyzing "${userText}" against your active project DNA and criteria weights... My recommendation is to focus 100% of remaining energy on end-to-end demo flow. Would you like me to generate pitch hooks, script your 2-minute demo video, or prune non-essential backlog tasks?`,
        };
      }

      setMessages((prev) => [...prev, reply]);
    }, 400);
  };

  const handleCopyVariant = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success('Copied pitch hook to clipboard!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-bg-raised/95 backdrop-blur-2xl border-l border-white/[0.08] shadow-overlay flex flex-col animate-slide-in">
      {/* Header (Claude/Linear Inspired) */}
      <div className="p-3.5 border-b border-white/[0.06] flex items-center justify-between bg-bg/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center shadow-[0_0_12px_rgba(59,130,246,0.3)]">
            <CubeLogo className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-fg text-xs tracking-snug">Ask Max</h3>
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-2xs font-mono">
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                Active
              </span>
            </div>
            <p className="text-2xs text-ink-muted font-mono mt-0.5">
              Score: <span className="text-accent-bright font-medium">{liveMaxScore}/100</span> •{' '}
              <span className="text-red-400">{Math.round(hoursRemaining)}h left</span>
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-md text-ink-faint hover:text-fg hover:bg-white/[0.04] transition-colors"
          title="Close Copilot (Esc)"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested chips (Cursor Context Pills) */}
      <div className="px-3 py-2 border-b border-white/[0.04] bg-bg/20 flex gap-1.5 overflow-x-auto no-scrollbar">
        {[
          { label: 'What to build next?', icon: ArrowRight },
          { label: 'Script 2-min video', icon: Video },
          { label: 'What tasks to cut?', icon: Scissors },
          { label: 'How do judges grade?', icon: Award },
        ].map((chip) => (
          <button
            key={chip.label}
            onClick={() => handleSend(chip.label)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.02] border border-white/[0.05] hover:border-accent/30 hover:bg-accent/10 text-2xs text-secondary hover:text-fg transition-all shrink-0 whitespace-nowrap active:scale-[0.97]"
          >
            <chip.icon className="w-3 h-3 text-accent-bright" />
            <span>{chip.label}</span>
          </button>
        ))}
      </div>

      {/* Messages list (Claude Clean Reading Style) */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 no-scrollbar">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 mb-1 px-1">
              {m.sender === 'user' ? (
                <>
                  <span className="text-2xs font-mono text-ink-faint">You</span>
                  <div className="w-4 h-4 rounded bg-white/[0.06] flex items-center justify-center">
                    <User className="w-2.5 h-2.5 text-ink-faint" />
                  </div>
                </>
              ) : (
                <>
                  <div className="w-4 h-4 rounded bg-accent/20 flex items-center justify-center shadow-[0_0_6px_rgba(59,130,246,0.4)]">
                    <CubeLogo className="w-3 h-3" />
                  </div>
                  <span className="text-2xs font-mono text-accent-bright font-medium">Max</span>
                </>
              )}
            </div>

            <div
              className={`max-w-[90%] p-3 rounded-xl text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-accent/15 border border-accent/30 text-fg rounded-tr-none'
                  : 'bg-white/[0.03] border border-white/[0.06] text-ink-body rounded-tl-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{m.text}</p>
            </div>

            {/* Rich Generative UI Action Cards (Cursor Composer Inspired) */}
            {m.actionCard && (
              <div className="w-[94%] mt-2 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] shadow-ambient animate-fade-up">
                {/* Variant 1: Triage Diff Widget */}
                {m.actionCard.type === 'cut_tasks' && (
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06]">
                      <div className="flex items-center gap-1.5">
                        <Scissors className="w-3.5 h-3.5 text-red-400" />
                        <h4 className="text-xs font-medium text-fg">{m.actionCard.title}</h4>
                      </div>
                      <span className="text-2xs font-mono text-emerald-400 font-medium">
                        ~{m.actionCard.meta.totalMinutesSaved}m Saved
                      </span>
                    </div>

                    <div className="space-y-1 max-h-36 overflow-y-auto no-scrollbar my-2">
                      {m.actionCard.meta.tasks?.map((t: any) => (
                        <div
                          key={t.id}
                          className="flex items-center justify-between text-xs p-2 rounded-md bg-red-500/5 border border-red-500/10"
                        >
                          <span className="text-red-300/90 text-2xs truncate">{t.title}</span>
                          <span className="text-2xs font-mono text-ink-faint shrink-0 ml-2">
                            ~{t.estimatedMinutes}m
                          </span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        m.actionCard?.meta.tasks?.forEach((t: any) => cutTask(t.id));
                        toast.success(
                          `Pruned ${m.actionCard?.meta.tasks?.length} tasks! Focus protected for demo.`
                        );
                      }}
                      className="w-full mt-2 py-2 px-3 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/20 text-xs font-medium transition-all flex items-center justify-center gap-1.5 active:scale-[0.97]"
                    >
                      <Scissors className="w-3.5 h-3.5" />
                      <span>Execute Plan Triage</span>
                    </button>
                  </div>
                )}

                {/* Variant 2: Pitch Variants Selector Widget */}
                {m.actionCard.type === 'pitch_variants' && (
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06]">
                      <div className="flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                        <h4 className="text-xs font-medium text-fg">{m.actionCard.title}</h4>
                      </div>
                      <span className="text-2xs font-mono text-secondary">3 Styles</span>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex items-center gap-1 p-0.5 rounded-lg bg-white/[0.03] mb-2.5">
                      {m.actionCard.meta.variants?.map((v: any, idx: number) => (
                        <button
                          key={v.label}
                          onClick={() => setSelectedHookTab(idx)}
                          className={`flex-1 py-1 px-2 rounded-md text-2xs font-mono font-medium transition-all ${
                            selectedHookTab === idx
                              ? 'bg-accent text-white shadow-ambient'
                              : 'text-ink-faint hover:text-fg'
                          }`}
                        >
                          {v.label}
                        </button>
                      ))}
                    </div>

                    {/* Selected Hook Details */}
                    {m.actionCard.meta.variants?.[selectedHookTab] && (
                      <div className="p-2.5 rounded-lg bg-black/30 border border-white/[0.04] text-xs">
                        <p className="text-fg font-fenix leading-relaxed italic mb-1.5 text-xs sm:text-[13px]">
                          {m.actionCard.meta.variants[selectedHookTab].hook}
                        </p>
                        <p className="text-2xs text-ink-faint font-mono">
                          Target: {m.actionCard.meta.variants[selectedHookTab].takeaway}
                        </p>

                        <button
                          onClick={() =>
                            handleCopyVariant(
                              m.actionCard?.meta.variants[selectedHookTab].hook,
                              selectedHookTab
                            )
                          }
                          className="w-full mt-2 py-1.5 px-2.5 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-secondary hover:text-fg border border-white/[0.06] text-2xs font-medium transition-all flex items-center justify-center gap-1.5 active:scale-[0.97]"
                        >
                          {copiedIndex === selectedHookTab ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied to Clipboard</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-accent-bright" />
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
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06]">
                      <div className="flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-accent-bright" />
                        <h4 className="text-xs font-medium text-fg">{m.actionCard.title}</h4>
                      </div>
                      <span className="text-2xs px-1.5 py-0.5 rounded-md bg-accent/15 text-accent-bright font-mono font-medium">
                        +6 Pts
                      </span>
                    </div>

                    <p className="text-2xs text-secondary leading-relaxed mb-2.5">
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
                      className="w-full py-2 px-3 rounded-lg bg-accent hover:bg-accent-bright text-white text-xs font-medium shadow-ambient transition-all flex items-center justify-center gap-1.5 active:scale-[0.97]"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>{m.actionCard.buttonText}</span>
                    </button>
                  </div>
                )}

                {/* Variant 4: Judge Fix Injector */}
                {m.actionCard.type === 'judge_fix' && (
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06]">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                        <h4 className="text-xs font-medium text-fg">{m.actionCard.title}</h4>
                      </div>
                      <span className="text-2xs font-mono text-red-400 font-medium">Blocker</span>
                    </div>

                    <p className="text-2xs text-secondary leading-relaxed mb-2.5">
                      {m.actionCard.description}
                    </p>

                    <button
                      onClick={() => {
                        dispatch({ type: 'add_task', task: m.actionCard?.meta.task });
                        toast.success('Added critical task to NOW execution stage!');
                      }}
                      className="w-full py-2 px-3 rounded-lg bg-accent hover:bg-accent-bright text-white text-xs font-medium shadow-ambient transition-all flex items-center justify-center gap-1.5 active:scale-[0.97]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{m.actionCard.buttonText}</span>
                    </button>
                  </div>
                )}

                {/* Variant 5: 2-Minute Video Script Generator */}
                {m.actionCard.type === 'video_script' && (
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06]">
                      <div className="flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5 text-accent-bright" />
                        <h4 className="text-xs font-medium text-fg">{m.actionCard.title}</h4>
                      </div>
                      <span className="text-2xs font-mono text-emerald-400 font-medium">120s Limit</span>
                    </div>

                    <div className="space-y-2 max-h-56 overflow-y-auto no-scrollbar my-2">
                      {m.actionCard.meta.parts?.map((p: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-fg text-2xs">{p.phase}</span>
                            <span className="font-mono text-2xs text-accent-bright px-1.5 py-0.2 rounded bg-accent/10 border border-accent/20">
                              {p.time}
                            </span>
                          </div>
                          <p className="text-2xs text-secondary italic leading-relaxed">
                            {p.script}
                          </p>
                          <p className="text-3xs text-ink-muted leading-tight">
                            💡 {p.tip}
                          </p>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(m.actionCard?.meta.fullTemplate);
                        toast.success('Copied full 2-minute video script to clipboard!');
                      }}
                      className="w-full mt-2 py-2 px-3 rounded-lg bg-accent hover:bg-accent-bright text-white text-xs font-medium shadow-ambient transition-all flex items-center justify-center gap-1.5 active:scale-[0.97]"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full Script Template</span>
                    </button>
                  </div>
                )}

                {/* Variant 6: Hackathon Judging Rubric Breakdown */}
                {m.actionCard.type === 'judging_rubric' && (
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06]">
                      <div className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        <h4 className="text-xs font-medium text-fg">{m.actionCard.title}</h4>
                      </div>
                      <span className="text-2xs font-mono text-amber-400 font-medium">4 Pillars</span>
                    </div>

                    <div className="space-y-2 max-h-56 overflow-y-auto no-scrollbar my-2">
                      {m.actionCard.meta.criteria?.map((c: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-fg text-2xs">{c.name}</span>
                          </div>
                          <p className="text-2xs text-secondary leading-relaxed">
                            {c.what}
                          </p>
                          <p className="text-3xs text-accent-bright leading-tight">
                            🏆 {c.proTip}
                          </p>
                        </div>
                      ))}
                    </div>

                    <p className="text-3xs text-ink-faint text-center mt-2 font-mono">
                      Tip: Use "AI Practice Judge" in the sidebar to simulate scoring anytime.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-2xs text-ink-faint font-mono animate-fade-up">
            <Sparkles className="w-3 h-3 text-accent-bright animate-pulse" />
            <span>Max is thinking…</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating Prompt Input Dock (ChatGPT / Gemini / Cursor Composer Inspired) */}
      <div className="p-3 border-t border-white/[0.06] bg-bg/80 backdrop-blur-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="relative flex items-center rounded-xl bg-white/[0.03] border border-white/[0.08] focus-within:border-accent/50 focus-within:bg-white/[0.05] transition-all"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Max about deadlines, triage, pitch hooks…"
            className="flex-1 py-2.5 pl-3 pr-10 bg-transparent text-xs text-fg placeholder:text-ink-faint focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="absolute right-1.5 p-1.5 rounded-lg bg-accent hover:bg-accent-bright text-white disabled:opacity-30 disabled:hover:bg-accent transition-all active:scale-[0.95]"
            title="Send (Enter)"
          >
            {input.trim() ? (
              <Send className="w-3.5 h-3.5" />
            ) : (
              <CornerDownLeft className="w-3.5 h-3.5 text-white/50" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
