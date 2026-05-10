import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import api, { getErrorMessage } from '../lib/api';
import type { User, LoginRequest, SignupRequest, AuthResponse } from '../types';

// ─── Context shape ────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Storage keys ─────────────────────────────────────────────────────────────
const TOKEN_KEY = 'korum_token';
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

  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem(TOKEN_KEY)
  );

  // On mount: validate token is still good by fetching /users/me
  const [isLoading, setIsLoading] = useState(!!token);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    api
      .get<User>('/users/me')
      .then((res) => {
        setUser(res.data);
        localStorage.setItem(USER_KEY, JSON.stringify(res.data));
      })
      .catch(() => {
        // Token is invalid/expired — clear everything
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount only

  const persist = (authRes: AuthResponse) => {
    localStorage.setItem(TOKEN_KEY, authRes.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(authRes.user));
    setToken(authRes.access_token);
    setUser(authRes.user);
  };

  const login = useCallback(async (data: LoginRequest) => {
    const res = await api.post<AuthResponse>('/auth/login', data);
    persist(res.data);
  }, []);

  const signup = useCallback(async (data: SignupRequest) => {
    const res = await api.post<AuthResponse>('/auth/signup', data);
    persist(res.data);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Even if backend call fails, clear local state
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setToken(null);
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
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