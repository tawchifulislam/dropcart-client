'use client';

import { useRouter } from 'next/navigation';
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { HttpError, request } from '@/lib/browser-api';
import type { User } from '@/lib/types';
import { useToast } from './ToastProvider';

type AuthStatus = 'loading' | 'ready';

interface AuthValue {
  user: User | null;
  status: AuthStatus;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    let cancelled = false;
    request<{ user: User }>('/auth/me')
      .then((result) => {
        if (!cancelled) setUser(result.user);
      })
      .catch((error) => {
        if (!(error instanceof HttpError) || error.status !== 401)
          console.error(error);
      })
      .finally(() => {
        if (!cancelled) setStatus('ready');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const logout = useCallback(async () => {
    await request('/auth/logout', { method: 'POST' });
    setUser(null);
    toast({ tone: 'info', title: 'Signed out' });
    router.refresh();
  }, [router, toast]);

  const value = useMemo(
    () => ({ user, status, setUser, logout }),
    [user, status, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
