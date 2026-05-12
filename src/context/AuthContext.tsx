import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { flushSync } from 'react-dom';
import api, { getErrorMessage, TOKEN_KEY } from '../lib/api';
import type { User, LoginRequest, SignupRequest, AuthResponse } from '../types';

// ─── Context shape ────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const USER_KEY = 'korum_user';

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Always validate the cookie on mount
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get<User>('/users/me')
      .then((res) => {
        setUser(res.data);
        localStorage.setItem(USER_KEY, JSON.stringify(res.data));
      })
      .catch(() => {
        localStorage.removeItem(USER_KEY);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const persist = (user: User) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    flushSync(() => setUser(user));
  };

  const persistAuth = (res: AuthResponse) => {
    localStorage.setItem(TOKEN_KEY, res.access_token);
    persist({ id: res.user_id, email: res.email, display_name: res.display_name, avatar_url: null, created_at: '' });
  };

  const login = useCallback(async (data: LoginRequest) => {
    const res = await api.post<AuthResponse>('/auth/login', data);
    persistAuth(res.data);
  }, []);

  const signup = useCallback(async (data: SignupRequest) => {
    const res = await api.post<AuthResponse>('/auth/signup', data);
    persistAuth(res.data);
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

export { getErrorMessage };
