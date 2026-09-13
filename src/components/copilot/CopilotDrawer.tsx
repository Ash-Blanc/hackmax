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
} from 'lucide-react';
import { useHackMaxStore } from '@/lib/store';
import { toast } from 'sonner';

interface CopilotDrawerProps {
  open: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'max';
  text: string;
  actionCard?: {
    type: 'cut_tasks' | 'next_action' | 'pitch_review' | 'judge_fix';
    title: string;
    description: string;
    buttonText: string;
    meta?: any;
  };
}

export default function CopilotDrawer({ open, onClose }: CopilotDrawerProps) {
  const { state, primaryHackathon, liveMaxScore, hoursRemaining, nextTask, cutTask, startTask, completeTask, dispatch } =
    useHackMaxStore();

  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-init',
      sender: 'max',
      text: `Hey Ash! I'm Max, your hackathon AI copilot. You have ${Math.round(hoursRemaining)} hours remaining for "${primaryHackathon?.title}". Your current Max Score is ${liveMaxScore}/100. Ask me what to prioritize, what to cut, or how to boost your judging score.`,
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

      if (lower.includes('cut') || lower.includes('deadline') || lower.includes('drop')) {
        const cuttable = state.tasks.filter(
          (t) => t.hackathonId === primaryHackathon?.id && (t.stage === 'LATER' || t.impactLevel === 'LOW' || t.impactLevel === 'MEDIUM') && t.status !== 'done' && t.status !== 'cut'
        );
        reply = {
          id: `m-${Date.now()}`,
          sender: 'max',
          text: `With only ${Math.round(hoursRemaining)} hours remaining, judges will never notice incomplete backend documentation or custom theme animations. You should immediately cut low-impact tasks and protect demo polish time:`,
          actionCard: {
            type: 'cut_tasks',
            title: `Safe Cuts (${cuttable.length} tasks identified)`,
            description: cuttable.map((t) => `• ${t.title} (~${t.estimatedMinutes}m saved)`).join('\n') || 'All low-impact tasks already cut or done.',
            buttonText: `Cut ${cuttable.length} Non-Essential Tasks`,
            meta: { taskIds: cuttable.map((t) => t.id) },
          },
        };
      } else if (lower.includes('next') || lower.includes('do next') || lower.includes('highest impact') || lower.includes('prioritize')) {
        reply = {
          id: `m-${Date.now()}`,
          sender: 'max',
          text: `Your single highest score-per-hour action right now is "${nextTask?.title ?? 'Record demo video'}". Here is why:`,
          actionCard: {
            type: 'next_action',
            title: nextTask?.title ?? 'Record 2-minute demo video',
            description: `Impact: ${nextTask?.impactLevel ?? 'HIGH'} • Est: ${nextTask?.estimatedMinutes ?? 45} mins.\nCompleting this drives the Presentation & Technical criteria, lifting Max Score by ~+6 points.`,
            buttonText: nextTask?.status === 'in_progress' ? 'Mark Task as Done' : 'Start Task Now',
            meta: { taskId: nextTask?.id, status: nextTask?.status },
          },
        };
      } else if (lower.includes('pitch') || lower.includes('hook') || lower.includes('narrative')) {
        reply = {
          id: `m-${Date.now()}`,
          sender: 'max',
          text: `I analyzed past winning submissions in the Autonomous Agents track. The most common pitfall is spending 90 seconds explaining technical architecture before showing what the agent actually does.`,
          actionCard: {
            type: 'pitch_review',
            title: '15-Second Judge Hook',
            description: '"While ChatGPT makes you copy-paste between 5 tabs, Agentic Researcher autonomously cross-references arXiv, GitHub, and live APIs in 42 seconds with zero hallucinations."',
            buttonText: 'Copy Hook to Clipboard',
            meta: {
              text: 'While ChatGPT makes you copy-paste between 5 tabs, Agentic Researcher autonomously cross-references arXiv, GitHub, and live APIs in 42 seconds with zero hallucinations.',
            },
          },
        };
      } else if (lower.includes('track') || lower.includes('score') || lower.includes('ready')) {
        reply = {
          id: `m-${Date.now()}`,
          sender: 'max',
          text: `You are at ${liveMaxScore}/100. You are in the top 15% readiness bracket, but 2 submission checklist items are incomplete: Demo Video and Pitch Deck. If you submit without a video, your effective score drops by -18 points because judges rarely test local repos.`,
          actionCard: {
            type: 'judge_fix',
            title: 'Submission Readiness Blocker',
            description: 'Demo Video is unchecked. Judges give 40% of their evaluation to the video overview.',
            buttonText: 'Add "Record Video" to NOW Stage',
            meta: {
              task: {
                id: `task-video-${Date.now()}`,
                hackathonId: primaryHackathon?.id || 'hack-1',
                title: 'Record 2-Minute Screen Walkthrough',
                stage: 'NOW' as const,
                priority: 'CRITICAL' as const,
                estimatedMinutes: 60,
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
          text: `Analyzing "${userText}" against your current project DNA and judging criteria... My recommendation is to keep all focus on tangible demo execution. Would you like me to triage your plan or draft your DevPost submission copy?`,
        };
      }

      setMessages((prev) => [...prev, reply]);
    }, 450);
  };

  const executeAction = (actionCard: Message['actionCard']) => {
    if (!actionCard) return;

    if (actionCard.type === 'cut_tasks' && actionCard.meta?.taskIds) {
      actionCard.meta.taskIds.forEach((id: string) => cutTask(id));
      toast.success(`Cut ${actionCard.meta.taskIds.length} tasks! Focus shifted to core demo.`);
    } else if (actionCard.type === 'next_action' && actionCard.meta?.taskId) {
      if (actionCard.meta.status === 'in_progress') {
        completeTask(actionCard.meta.taskId);
        toast.success('Task marked as completed! Recalculating Max Score...');
      } else {
        startTask(actionCard.meta.taskId);
        toast.info('Started task! In-progress timer ticking.');
      }
    } else if (actionCard.type === 'pitch_review' && actionCard.meta?.text) {
      navigator.clipboard.writeText(actionCard.meta.text);
      setCopied(true);
      toast.success('Pitch hook copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } else if (actionCard.type === 'judge_fix' && actionCard.meta?.task) {
      dispatch({ type: 'add_task', task: actionCard.meta.task });
      toast.success('Added critical task to NOW execution stage!');
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-surface border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-elevated/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center text-accent">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-fg text-sm">Ask Max</h3>
              <span className="w-2 h-2 rounded-full bg-success" />
              <span className="text-[10px] text-muted">Copilot</span>
            </div>
            <p className="text-[11px] text-secondary">
              Score: <span className="text-accent-light font-bold font-mono">{liveMaxScore}/100</span> • {Math.round(hoursRemaining)}h remaining
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-secondary hover:text-fg hover:bg-elevated transition-colors"
          title="Close Copilot"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested chips */}
      <div className="p-3 border-b border-border/60 bg-surface/80 flex gap-1.5 overflow-x-auto no-scrollbar">
        {[
          { label: 'What should I cut?', icon: Scissors },
          { label: 'What should I do next?', icon: ArrowRight },
          { label: 'Am I on track?', icon: TrendingUp },
          { label: 'Review pitch hook', icon: Lightbulb },
        ].map((chip) => (
          <button
            key={chip.label}
            onClick={() => handleSend(chip.label)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-elevated border border-border/80 text-[11px] text-secondary hover:text-fg hover:border-accent/30 transition-all shrink-0 whitespace-nowrap"
          >
            <chip.icon className="w-3 h-3 text-accent" />
            <span>{chip.label}</span>
          </button>
        ))}
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-accent text-white rounded-br-none'
                  : 'glass border border-border text-fg rounded-bl-none shadow-sm'
              }`}
            >
              <p className="whitespace-pre-wrap">{m.text}</p>
            </div>

            {m.actionCard && (
              <div className="w-[92%] mt-2.5 p-3.5 rounded-xl bg-elevated border border-accent/20 shadow-md">
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  <h4 className="text-xs font-semibold text-accent-light">{m.actionCard.title}</h4>
                </div>
                <p className="text-[11px] text-secondary whitespace-pre-wrap mb-3 leading-relaxed">
                  {m.actionCard.description}
                </p>
                <button
                  onClick={() => executeAction(m.actionCard)}
                  className="w-full py-2 px-3 rounded-lg bg-accent/20 hover:bg-accent/30 border border-accent/30 text-accent-light text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-success" /> : null}
                  <span>{m.actionCard.buttonText}</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border bg-elevated/20">
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
            placeholder="Ask Max anything about your hackathon..."
            className="flex-1 py-2.5 px-3 bg-surface border border-border rounded-lg text-xs text-fg placeholder:text-muted focus:outline-none focus:border-accent/50"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2.5 rounded-lg bg-accent text-white hover:bg-accent-bright disabled:opacity-50 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
