import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../lib/api';
import AuthTabs from '../components/auth/AuthTabs/AuthTabs';

const inputClass =
  'w-full px-4 py-3 rounded-[14px] border border-border-warm bg-page font-body text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-brand-primary transition-colors';

export default function LoginPage() {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = location.pathname === '/signup' ? 'signup' : 'login';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const switchTab = (tab: 'login' | 'signup') => {
    setError(null);
    setEmail('');
    setPassword('');
    setDisplayName('');
    navigate(tab === 'login' ? '/login' : '/signup');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'signup' && password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setError(null);
    setIsLoading(true);

    const authCall = activeTab === 'login'
      ? login({ email, password })
      : signup({ email, password, display_name: displayName || undefined });

    authCall
      .then(() => navigate('/'))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="min-h-screen bg-page flex items-start justify-center pt-32 px-4 pb-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-heading font-semibold text-4xl text-ink">Korum</h1>
          <p className="font-body text-ink-muted mt-1 text-sm">Every group, one answer.</p>
        </div>

        <div className="bg-white rounded-card border border-border p-6 shadow-sm">
          <AuthTabs activeTab={activeTab} onChange={switchTab} />

          <form onSubmit={handleSubmit} className="space-y-4 mt-5">
            {activeTab === 'signup' && (
              <div>
                <label className="block font-body text-sm font-medium text-ink mb-1.5">Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  className={inputClass}
                />
              </div>
            )}

            <div>
              <label className="block font-body text-sm font-medium text-ink mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block font-body text-sm font-medium text-ink mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={activeTab === 'login' ? 'current-password' : 'new-password'}
                placeholder={activeTab === 'login' ? '••••••••' : 'Min. 8 characters'}
                className={inputClass}
              />
            </div>

            {error && (
              <p className="font-body text-sm text-red-500 bg-red-50 rounded-[10px] px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-btn bg-brand-primary text-white font-heading font-semibold text-base hover:bg-brand-hover disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150"
            >
              {isLoading
                ? activeTab === 'login' ? 'Signing in…' : 'Creating account…'
                : activeTab === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
