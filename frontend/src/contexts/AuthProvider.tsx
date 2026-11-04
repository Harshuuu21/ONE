'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AuthUser } from '@/features/authentication/types';
import { AuthApi } from '@/features/authentication/services/authApi';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  setUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initial check of persisted session
    const stored = AuthApi.getStoredUser();
    setUser(stored);
    setLoading(false);

    // 2. Listen to custom auth events
    const handleAuthChange = () => {
      const updated = AuthApi.getStoredUser();
      setUser(updated);
    };

    window.addEventListener('one-auth-changed', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('one-auth-changed', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  const logout = async () => {
    await AuthApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
