import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Github, Sparkles, Mail, Lock } from 'lucide-react';
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="glass rounded-3xl p-8 w-full max-w-md border border-border shadow-2xl">
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 mb-6 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center text-accent">
            <Zap className="w-4 h-4 fill-accent" />
          </div>
          <span className="text-xl font-bold text-fg tracking-tight">HackMax</span>
        </div>

        <h2 className="text-xl font-bold text-fg">Sign in to your account</h2>
        <p className="text-xs text-secondary mt-1 mb-6">
          Maximize your hackathon submission quality per hour remaining.
        </p>

        {/* GitHub OAuth Button */}
        <button
          onClick={handleDemoBypass}
          className="w-full py-2.5 px-4 rounded-xl bg-elevated hover:bg-surface border border-border text-fg font-semibold text-xs flex items-center justify-center gap-2 transition-colors mb-4"
        >
          <Github className="w-4 h-4" />
          <span>Continue with GitHub</span>
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] text-muted uppercase">or with email</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-secondary mb-1 uppercase text-[10px] font-semibold">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ash@hackmax.dev"
                required
                className="w-full py-2 pl-8 pr-3 rounded-lg bg-elevated border border-border text-fg placeholder:text-muted focus:outline-none focus:border-accent"
              />
              <Mail className="w-3.5 h-3.5 text-muted absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-secondary mb-1 uppercase text-[10px] font-semibold">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full py-2 pl-8 pr-3 rounded-lg bg-elevated border border-border text-fg placeholder:text-muted focus:outline-none focus:border-accent"
              />
              <Lock className="w-3.5 h-3.5 text-muted absolute left-2.5 top-2.5" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-2.5 px-4 bg-accent hover:bg-accent-bright text-white rounded-xl font-bold text-xs shadow-glow transition-all"
          >
            Sign In
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-border/80 text-center">
          <p className="text-xs text-muted mb-3">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-accent-light font-semibold hover:underline"
            >
              Sign up
            </button>
          </p>

          {/* Demo Bypass */}
          <button
            onClick={handleDemoBypass}
            className="w-full py-2 px-3 rounded-xl bg-accent/10 border border-accent/20 text-accent-light hover:bg-accent/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Instant Demo Mode Bypass →</span>
          </button>
        </div>
      </div>
    </div>
  );
}