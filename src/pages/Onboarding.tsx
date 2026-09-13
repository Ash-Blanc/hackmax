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
      {/* Glow background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Container */}
      <div className="glass rounded-3xl p-8 w-full max-w-xl border border-border shadow-2xl relative">
        {/* Top bar with logo and progress dots */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center text-accent">
              <Zap className="w-4 h-4 fill-accent" />
            </div>
            <div>
              <span className="font-bold text-fg text-base">HackMax</span>
              <span className="text-[10px] text-muted block -mt-1">5-Step Setup</span>
            </div>
          </div>

          {/* Stepper dots */}
          <div className="flex items-center gap-1.5">
            {steps.map((s) => (
              <div
                key={s.num}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s.num === step
                    ? 'w-8 bg-accent'
                    : s.num < step
                    ? 'w-4 bg-accent/50'
                    : 'w-4 bg-border'
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: WELCOME */}
        {step === 1 && (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-6 text-accent shadow-glow">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-fg tracking-tight">
              Welcome to HackMax
            </h2>
            <p className="text-secondary text-sm sm:text-base mt-3 max-w-md mx-auto leading-relaxed">
              Your AI copilot engineered to maximize submission quality per hour remaining. Not a generic to-do list.
            </p>
            <div className="mt-6 p-4 rounded-xl bg-elevated/70 border border-border text-xs text-left space-y-2">
              <div className="flex items-center gap-2 text-fg">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span>Transparent 0–100 Max Score readiness gauge</span>
              </div>
              <div className="flex items-center gap-2 text-fg">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span>Multi-perspective AI judge simulation</span>
              </div>
              <div className="flex items-center gap-2 text-fg">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span>Time-sliced NOW / NEXT / LATER execution plan</span>
              </div>
            </div>
            <button
              onClick={() => setStep(2)}
              className="mt-8 w-full py-3.5 px-4 bg-accent hover:bg-accent-bright text-white rounded-xl font-bold text-sm shadow-glow transition-all flex items-center justify-center gap-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: GOAL SELECTION */}
        {step === 2 && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-fg tracking-tight mb-2">
              What are you trying to maximize?
            </h2>
            <p className="text-secondary text-xs mb-6">
              Max adapts its triage suggestions and scoring weights based on your primary objective.
            </p>

            <div className="space-y-3">
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
                  className={`p-4 rounded-xl cursor-pointer border transition-all ${
                    selectedGoal === option.id
                      ? 'bg-accent/15 border-accent text-fg shadow-sm'
                      : 'bg-elevated/60 border-border text-secondary hover:border-border/80 hover:text-fg'
                  }`}
                >
                  <p className="font-semibold text-sm text-fg">{option.title}</p>
                  <p className="text-xs text-secondary mt-1">{option.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-8 pt-4 border-t border-border">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-medium text-secondary hover:text-fg"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2.5 bg-accent hover:bg-accent-bright text-white rounded-xl font-semibold text-xs shadow-glow transition-all flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CONNECT GITHUB */}
        {step === 3 && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-fg tracking-tight mb-2">
              Connect Your GitHub
            </h2>
            <p className="text-secondary text-xs mb-6">
              Link your repository to extract project DNA, analyze commit velocity, and index reusable components.
            </p>

            {/* Simulated connected repo card */}
            <div className="p-4 rounded-xl bg-elevated border border-border space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center text-fg">
                    <Github className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-fg">ash-agentic</p>
                    <p className="text-xs text-muted">Connected via GitHub App</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-success/10 border border-success/20 text-success text-[11px] font-medium">
                  ✓ Active
                </span>
              </div>

              <div className="p-3 rounded-lg bg-surface/80 border border-border/80 text-xs">
                <div className="flex items-center justify-between mb-1 text-muted">
                  <span>Detected primary repository:</span>
                  <span className="font-mono text-accent-light">agentic-researcher</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="px-2 py-0.5 rounded bg-elevated text-[10px] text-secondary">React 18</span>
                  <span className="px-2 py-0.5 rounded bg-elevated text-[10px] text-secondary">TypeScript</span>
                  <span className="px-2 py-0.5 rounded bg-elevated text-[10px] text-secondary">FastAPI</span>
                  <span className="px-2 py-0.5 rounded bg-elevated text-[10px] text-secondary">Anthropic</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  toast.success('GitHub repository synced with Project DNA catalog!');
                  setStep(4);
                }}
                className="w-full py-3 px-4 bg-accent hover:bg-accent-bright text-white rounded-xl font-bold text-xs shadow-glow transition-all flex items-center justify-center gap-2"
              >
                <span>Import Repository DNA</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleComplete}
                className="w-full py-2.5 text-xs text-muted hover:text-secondary transition-colors"
              >
                Skip configuration with Pre-seeded Demo Mode →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: ADD HACKATHON */}
        {step === 4 && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-fg tracking-tight mb-2">
              Add Your Active Hackathon
            </h2>
            <p className="text-secondary text-xs mb-6">
              Paste a DevPost URL to auto-extract judging criteria, weights, and deadlines.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-secondary uppercase tracking-wider block mb-1.5">
                  Hackathon / DevPost URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={hackathonUrl}
                    onChange={(e) => setHackathonUrl(e.target.value)}
                    placeholder="https://devpost.com/..."
                    className="flex-1 py-2.5 px-3 rounded-xl bg-elevated border border-border text-xs text-fg placeholder:text-muted focus:outline-none focus:border-accent"
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
                    className="px-4 py-2.5 rounded-xl bg-elevated hover:bg-surface border border-border text-xs font-semibold text-fg flex items-center gap-1.5 transition-colors"
                  >
                    {isParsing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-accent" />}
                    <span>AI Parse</span>
                  </button>
                </div>
              </div>

              {/* Extracted preview */}
              {parseComplete && (
                <div className="p-4 rounded-xl bg-elevated/70 border border-border/80 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-fg">Autonomous Agents Hackathon</span>
                    <span className="text-xs font-mono text-accent-light font-bold">19h 42m remaining</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                    <div className="p-2 rounded bg-surface border border-border">
                      <span className="text-muted block text-[10px]">Prize Pool</span>
                      <strong className="text-fg font-mono">$50,000</strong>
                    </div>
                    <div className="p-2 rounded bg-surface border border-border">
                      <span className="text-muted block text-[10px]">Criteria</span>
                      <strong className="text-fg">5 Categories</strong>
                    </div>
                    <div className="p-2 rounded bg-surface border border-border">
                      <span className="text-muted block text-[10px]">Est. Readiness</span>
                      <strong className="text-accent font-mono">74/100</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mt-8 pt-4 border-t border-border">
              <button
                onClick={() => setStep(3)}
                className="px-4 py-2 text-xs font-medium text-secondary hover:text-fg"
              >
                ← Back
              </button>
              <button
                onClick={startPlanGeneration}
                className="px-6 py-2.5 bg-accent hover:bg-accent-bright text-white rounded-xl font-semibold text-xs shadow-glow transition-all flex items-center gap-1.5"
              >
                <span>Synthesize Max Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: INITIAL MAX PLAN & CELEBRATION */}
        {step === 5 && (
          <div className="text-center py-4">
            <div className="w-20 h-20 rounded-full bg-success/15 border border-success/30 flex items-center justify-center mx-auto mb-6 text-success shadow-emerald">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-fg tracking-tight">
              Your Max Plan is Live!
            </h2>
            <p className="text-secondary text-sm mt-3 max-w-md mx-auto leading-relaxed">
              We synthesized your Project DNA against the Autonomous Agents criteria. Your execution schedule is time-sliced into NOW, NEXT, and LATER.
            </p>

            <div className="mt-6 p-4 rounded-xl bg-elevated/70 border border-border text-left space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-border">
                <span className="text-muted">Initial Max Score</span>
                <span className="font-mono font-bold text-accent-light text-sm">74 / 100</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Highest-Impact Action</span>
                <span className="font-semibold text-fg">Finish core agent workflow</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Anti-Slop Protection</span>
                <span className="text-success font-medium">Active (Demo video priority)</span>
              </div>
            </div>

            <button
              onClick={handleComplete}
              className="mt-8 w-full py-3.5 px-4 bg-accent hover:bg-accent-bright text-white rounded-xl font-bold text-sm shadow-glow transition-all flex items-center justify-center gap-2"
            >
              <span>Launch Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Loading overlay while generating plan */}
        {generatingPlan && (
          <div className="absolute inset-0 bg-surface/95 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-8 z-20">
            <div className="w-12 h-12 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent mb-4">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <h3 className="font-bold text-fg text-base">Synthesizing Your Max Plan</h3>
            <p className="text-secondary text-xs mt-1">
              Analyzing judging criteria, computing score weights, and scheduling tasks...
            </p>
            <div className="w-full max-w-xs mt-6 h-2 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${generationProgress}%` }}
              />
            </div>
            <span className="text-[11px] font-mono text-muted mt-2">{generationProgress}%</span>
          </div>
        )}
      </div>
    </div>
  );
}