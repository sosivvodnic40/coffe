import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api, type ApiUser } from '../api/client';

type AuthContextValue = {
  user: ApiUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
  }) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const TOKEN_KEY = 'cappuccino_user_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

  const refreshProfile = useCallback(async () => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) {
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.getProfile(stored);
      setUser(response.user);
      setToken(stored);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await api.userLogin(email, password);
    localStorage.setItem(TOKEN_KEY, response.token);
    setToken(response.token);
    setUser(response.user);
  }, []);

  const register = useCallback(
    async (payload: { email: string; password: string; fullName: string; phone: string }) => {
      const response = await api.userRegister(payload);
      localStorage.setItem(TOKEN_KEY, response.token);
      setToken(response.token);
      setUser(response.user);
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout, refreshProfile }),
    [user, token, loading, login, register, logout, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
