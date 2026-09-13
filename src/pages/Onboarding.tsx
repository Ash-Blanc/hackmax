import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHackMaxStore } from '@/lib/store';
import { MOCK_DATA } from '@/lib/mock-data';
import {
  Zap,
  ArrowRight,
  CheckCircle2,
  Github,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

export default function Onboarding() {
  const navigate = useNavigate();
  const { dispatch } = useHackMaxStore();

  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState('all_of_above');
  const [hackathonUrl, setHackathonUrl] = useState(
    'https://devpost.com/software/autonomous-agents-hackathon'
  );
  const [isParsing, setIsParsing] = useState(false);
  const [parseComplete, setParseComplete] = useState(true);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const steps = [
    { num: 1, label: 'Welcome' },
    { num: 2, label: 'Goal' },
    { num: 3, label: 'GitHub' },
    { num: 4, label: 'Hackathon' },
    { num: 5, label: 'Max Plan' },
  ];

  const handleComplete = () => {
    dispatch({ type: 'hydrate', state: MOCK_DATA });
    toast.success('Max Plan generated! Welcome to your Command Center.');
    navigate('/dashboard');
  };

  const startPlanGeneration = () => {
    setGeneratingPlan(true);
    setGenerationProgress(15);

    const timer1 = setTimeout(() => setGenerationProgress(45), 400);
    const timer2 = setTimeout(() => setGenerationProgress(80), 800);
    const timer3 = setTimeout(() => {
      setGenerationProgress(100);
      setGeneratingPlan(false);
      setStep(5);
    }, 1200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  return (
    <div className="min-h-screen bg-bg text-fg flex flex-col items-center justify-center p-6 select-none relative overflow-hidden">
      {/* Container */}
      <div className="glass-panel rounded-2xl p-7 w-full max-w-lg border border-white/[0.06] shadow-overlay relative">
        {/* Top bar with logo and progress dots */}
        <div className="flex items-center justify-between pb-5 mb-6 border-b border-white/[0.05]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-accent/15 border border-accent/25 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-accent-bright" />
            </div>
            <div>
              <span className="font-semibold text-fg text-sm tracking-snug">HackMax</span>
              <span className="text-2xs text-ink-faint block -mt-0.5 font-mono">5-Step Calibration</span>
            </div>
          </div>

          {/* Stepper dots */}
          <div className="flex items-center gap-1.5">
            {steps.map((s) => (
              <div
                key={s.num}
                className={`h-1 rounded-full transition-all duration-300 ${
                  s.num === step
                    ? 'w-6 bg-accent'
                    : s.num < step
                    ? 'w-3 bg-accent/40'
                    : 'w-3 bg-white/[0.08]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: WELCOME */}
        {step === 1 && (
          <div className="text-center py-2">
            <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4 text-accent-bright">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-fg tracking-snug">
              Welcome to HackMax
            </h2>
            <p className="text-secondary text-xs mt-2 max-w-sm mx-auto leading-relaxed">
              Your AI copilot engineered to maximize submission quality per hour remaining. Not a generic to-do list.
            </p>
            <div className="mt-5 p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-xs text-left space-y-2">
              <div className="flex items-center gap-2 text-fg">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-2xs">Transparent 0–100 Max Score readiness gauge</span>
              </div>
              <div className="flex items-center gap-2 text-fg">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-2xs">Multi-perspective AI judge simulation</span>
              </div>
              <div className="flex items-center gap-2 text-fg">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-2xs">Time-sliced NOW / NEXT / LATER execution plan</span>
              </div>
            </div>
            <button
              onClick={() => setStep(2)}
              className="mt-6 w-full py-2.5 px-4 bg-accent hover:bg-accent-bright text-white rounded-lg font-medium text-xs shadow-ambient transition-all flex items-center justify-center gap-2 active:scale-[0.97]"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* STEP 2: GOAL SELECTION */}
        {step === 2 && (
          <div>
            <h2 className="text-lg font-semibold text-fg tracking-snug mb-1">
              What are you trying to maximize?
            </h2>
            <p className="text-secondary text-2xs mb-4">
              Max adapts its triage suggestions and scoring weights based on your primary objective.
            </p>

            <div className="space-y-2">
              {[
                {
                  id: 'win_more',
                  title: '🏆 Win Track & Grand Prizes',
                  desc: 'Heavy weighting on novel innovation, presentation narrative, and judging alignment.',
                },
                {
                  id: 'ship_faster',
                  title: '⚡ Ship Fast & Clean Code',
                  desc: 'Focus on code reuse, robust scaffolding, and zero breaking bugs.',
                },
                {
                  id: 'portfolio',
                  title: '🎯 Portfolio & Technical Credibility',
                  desc: 'Emphasize architectural depth, clean README documentation, and open source stars.',
                },
                {
                  id: 'all_of_above',
                  title: '🚀 All of the Above (Recommended)',
                  desc: 'Balanced scoring tuned for podium finishes with production-ready software.',
                },
              ].map((option) => (
                <div
                  key={option.id}
                  onClick={() => setSelectedGoal(option.id)}
                  className={`p-3 rounded-lg cursor-pointer border transition-all ${
                    selectedGoal === option.id
                      ? 'bg-accent/10 border-accent/30 text-fg'
                      : 'bg-white/[0.02] border-white/[0.05] text-ink-muted hover:border-white/[0.10] hover:text-fg'
                  }`}
                >
                  <p className="font-medium text-xs text-fg">{option.title}</p>
                  <p className="text-2xs text-secondary mt-0.5">{option.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-6 pt-3 border-t border-white/[0.05]">
              <button
                onClick={() => setStep(1)}
                className="px-3 py-1.5 text-2xs font-medium text-secondary hover:text-fg"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-4 py-2 bg-accent hover:bg-accent-bright text-white rounded-lg font-medium text-xs shadow-ambient transition-all flex items-center gap-1.5 active:scale-[0.97]"
              >
                <span>Continue</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CONNECT GITHUB */}
        {step === 3 && (
          <div>
            <h2 className="text-lg font-semibold text-fg tracking-snug mb-1">
              Connect Your GitHub
            </h2>
            <p className="text-secondary text-2xs mb-4">
              Link your repository to extract project DNA, analyze commit velocity, and index reusable components.
            </p>

            {/* Simulated connected repo card */}
            <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.05] space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-fg">
                    <Github className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-xs text-fg">ash-agentic</p>
                    <p className="text-2xs text-ink-faint">Connected via GitHub App</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-2xs font-mono font-medium">
                  ✓ Active
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] text-xs">
                <div className="flex items-center justify-between mb-1 text-ink-faint text-2xs font-mono">
                  <span>Detected repo:</span>
                  <span className="text-accent-bright">agentic-researcher</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  <span className="px-2 py-0.5 rounded bg-white/[0.03] text-2xs text-secondary font-mono">React 18</span>
                  <span className="px-2 py-0.5 rounded bg-white/[0.03] text-2xs text-secondary font-mono">TypeScript</span>
                  <span className="px-2 py-0.5 rounded bg-white/[0.03] text-2xs text-secondary font-mono">FastAPI</span>
                  <span className="px-2 py-0.5 rounded bg-white/[0.03] text-2xs text-secondary font-mono">Anthropic</span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2">
              <button
                onClick={() => {
                  toast.success('GitHub repository synced with Project DNA catalog!');
                  setStep(4);
                }}
                className="w-full py-2.5 px-4 bg-accent hover:bg-accent-bright text-white rounded-lg font-medium text-xs shadow-ambient transition-all flex items-center justify-center gap-2 active:scale-[0.97]"
              >
                <span>Import Repository DNA</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleComplete}
                className="w-full py-2 text-2xs text-ink-faint hover:text-secondary transition-colors"
              >
                Skip configuration with Pre-seeded Demo Mode →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: ADD HACKATHON */}
        {step === 4 && (
          <div>
            <h2 className="text-lg font-semibold text-fg tracking-snug mb-1">
              Add Your Active Hackathon
            </h2>
            <p className="text-secondary text-2xs mb-4">
              Paste a DevPost URL to auto-extract judging criteria, weights, and deadlines.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-2xs font-medium text-secondary uppercase tracking-wider block mb-1">
                  Hackathon / DevPost URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={hackathonUrl}
                    onChange={(e) => setHackathonUrl(e.target.value)}
                    placeholder="https://devpost.com/..."
                    className="flex-1 py-2 px-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-fg placeholder:text-ink-faint focus:outline-none focus:border-accent"
                  />
                  <button
                    onClick={() => {
                      setIsParsing(true);
                      setTimeout(() => {
                        setIsParsing(false);
                        setParseComplete(true);
                        toast.success('Extracted 5 judging criteria & deadline: 19h remaining!');
                      }, 600);
                    }}
                    className="px-3 py-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-xs font-medium text-fg flex items-center gap-1.5 transition-colors"
                  >
                    {isParsing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-accent-bright" />}
                    <span>Parse</span>
                  </button>
                </div>
              </div>

              {/* Extracted preview */}
              {parseComplete && (
                <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.05] space-y-2.5 animate-fade-up">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-fg">Autonomous Agents Hackathon</span>
                    <span className="text-2xs font-mono text-accent-bright">19h 42m remaining</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-2xs">
                    <div className="p-2 rounded bg-white/[0.02] border border-white/[0.04]">
                      <span className="text-ink-faint block">Prize Pool</span>
                      <strong className="text-fg font-mono">$50,000</strong>
                    </div>
                    <div className="p-2 rounded bg-white/[0.02] border border-white/[0.04]">
                      <span className="text-ink-faint block">Criteria</span>
                      <strong className="text-fg">5 Categories</strong>
                    </div>
                    <div className="p-2 rounded bg-white/[0.02] border border-white/[0.04]">
                      <span className="text-ink-faint block">Est. Readiness</span>
                      <strong className="text-accent-bright font-mono">74/100</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mt-6 pt-3 border-t border-white/[0.05]">
              <button
                onClick={() => setStep(3)}
                className="px-3 py-1.5 text-2xs font-medium text-secondary hover:text-fg"
              >
                ← Back
              </button>
              <button
                onClick={startPlanGeneration}
                className="px-4 py-2 bg-accent hover:bg-accent-bright text-white rounded-lg font-medium text-xs shadow-ambient transition-all flex items-center gap-1.5 active:scale-[0.97]"
              >
                <span>Synthesize Max Plan</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: INITIAL MAX PLAN & CELEBRATION */}
        {step === 5 && (
          <div className="text-center py-2">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mx-auto mb-4 text-emerald-400">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <h2 className="text-xl font-bold text-fg tracking-snug">
              Your Max Plan is Live!
            </h2>
            <p className="text-secondary text-xs mt-2 max-w-sm mx-auto leading-relaxed">
              We synthesized your Project DNA against the Autonomous Agents criteria. Your execution schedule is time-sliced into NOW, NEXT, and LATER.
            </p>

            <div className="mt-5 p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-left space-y-2">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-white/[0.04]">
                <span className="text-ink-faint text-2xs">Initial Max Score</span>
                <span className="font-mono font-bold text-accent-bright text-xs">74 / 100</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-faint text-2xs">Highest-Impact Action</span>
                <span className="font-medium text-fg text-2xs">Finish core agent workflow</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-faint text-2xs">Anti-Slop Protection</span>
                <span className="text-emerald-400 font-medium text-2xs">Active (Demo video priority)</span>
              </div>
            </div>

            <button
              onClick={handleComplete}
              className="mt-6 w-full py-2.5 px-4 bg-accent hover:bg-accent-bright text-white rounded-lg font-medium text-xs shadow-ambient transition-all flex items-center justify-center gap-2 active:scale-[0.97]"
            >
              <span>Launch Command Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Loading overlay while generating plan */}
        {generatingPlan && (
          <div className="absolute inset-0 bg-bg-raised/95 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-8 z-20">
            <div className="w-10 h-10 rounded-lg bg-accent/15 border border-accent/25 flex items-center justify-center text-accent-bright mb-3">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
            <h3 className="font-semibold text-fg text-xs">Synthesizing Your Max Plan</h3>
            <p className="text-secondary text-2xs mt-1">
              Analyzing criteria, computing weights, and scheduling tasks…
            </p>
            <div className="w-full max-w-xs mt-4 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${generationProgress}%` }}
              />
            </div>
            <span className="text-2xs font-mono text-ink-faint mt-1.5">{generationProgress}%</span>
          </div>
        )}
      </div>
    </div>
  );
}