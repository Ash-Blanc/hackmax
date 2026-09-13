import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, Sparkles, Mail, Lock } from 'lucide-react';
import { CubeLogo } from '@/components/common/CubeLogo';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Signed in successfully!');
    navigate('/dashboard');
  };

  const handleDemoBypass = () => {
    toast.info('Bypassing authentication in Demo Mode...');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6 select-none relative overflow-hidden">
      <div className="glass-panel rounded-2xl p-7 w-full max-w-sm border border-white/[0.06] shadow-overlay animate-fade-up">
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mb-5 cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center shadow-[0_0_12px_rgba(59,130,246,0.25)]">
            <CubeLogo className="w-4.5 h-4.5" />
          </div>
          <span className="text-base font-fenix text-fg tracking-normal">HackMax</span>
        </div>

        <h2 className="text-base font-fenix text-fg">Sign in to your account</h2>
        <p className="text-2xs text-secondary mt-0.5 mb-4">
          Maximize your hackathon submission quality per hour remaining.
        </p>

        {/* GitHub OAuth Button */}
        <button
          onClick={handleDemoBypass}
          className="w-full py-2 px-3.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-fg font-medium text-xs flex items-center justify-center gap-2 transition-colors mb-3 active:scale-[0.97]"
        >
          <Github className="w-4 h-4" />
          <span>Continue with GitHub</span>
        </button>

        <div className="flex items-center gap-2.5 my-3">
          <div className="flex-1 h-px bg-white/[0.05]" />
          <span className="text-2xs text-ink-faint uppercase font-mono">or email</span>
          <div className="flex-1 h-px bg-white/[0.05]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-2.5 text-xs">
          <div>
            <label className="block text-secondary mb-1 uppercase text-2xs font-medium font-mono">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ash@hackmax.dev"
                required
                className="w-full py-1.5 pl-7 pr-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-fg placeholder:text-ink-faint focus:outline-none focus:border-accent"
              />
              <Mail className="w-3 h-3 text-ink-faint absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-secondary mb-1 uppercase text-2xs font-medium font-mono">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full py-1.5 pl-7 pr-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-fg placeholder:text-ink-faint focus:outline-none focus:border-accent"
              />
              <Lock className="w-3 h-3 text-ink-faint absolute left-2.5 top-2.5" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-1.5 py-2 px-3 bg-accent hover:bg-accent-bright text-white rounded-lg font-medium text-xs shadow-ambient transition-all active:scale-[0.97]"
          >
            Sign In
          </button>
        </form>

        <div className="mt-4 pt-3.5 border-t border-white/[0.05] text-center">
          <p className="text-2xs text-ink-faint mb-2.5">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-accent-bright font-medium hover:underline"
            >
              Sign up
            </button>
          </p>

          {/* Demo Bypass */}
          <button
            onClick={handleDemoBypass}
            className="w-full py-1.5 px-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-secondary hover:text-fg text-2xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3 h-3 text-accent-bright" />
            <span>Instant Demo Mode Bypass →</span>
          </button>
        </div>
      </div>
    </div>
  );
}