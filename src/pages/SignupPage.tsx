import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../lib/api';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await signup({ email, password, display_name: displayName || undefined });
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-[14px] border border-[#EAD8CE] bg-[#FFF8F5] font-body text-sm text-[#2A1200] placeholder:text-[#9A7060] focus:outline-none focus:border-brand-primary transition-colors';

  return (
    <div className="min-h-screen bg-[#FFF8F5] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-heading font-semibold text-4xl text-[#2A1200]">
            Korum
          </h1>
          <p className="font-body text-[#9A7060] mt-1 text-sm">
            Every group, one answer.
          </p>
        </div>

        <div className="bg-white rounded-card border border-[#E4E2DC] p-6 shadow-sm">
          <h2 className="font-heading font-semibold text-xl text-[#2A1200] mb-5">
            Create your account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-body text-sm font-medium text-[#2A1200] mb-1.5">
                Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block font-body text-sm font-medium text-[#2A1200] mb-1.5">
                Email
              </label>
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
              <label className="block font-body text-sm font-medium text-[#2A1200] mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Min. 8 characters"
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
              className="w-full py-3 rounded-btn bg-brand-primary text-white font-heading font-semibold text-base hover:bg-[#FF7A45] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150"
            >
              {isLoading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center font-body text-sm text-[#9A7060] mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}