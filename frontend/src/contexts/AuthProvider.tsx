'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { getStoredUser, subscribeToAuthUpdates } from '@/services/auth.service';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check local session first
    const stored = getStoredUser();
    if (stored) {
      setUser(stored);
      setLoading(false);
    } else {
      setLoading(false);
    }

    // 2. Subscribe to local auth changes
    const unsubLocal = subscribeToAuthUpdates((updatedUser) => {
      setUser(updatedUser);
      setLoading(false);
    });

    // 3. Listen to Firebase auth state if available
    let unsubFirebase = () => {};
    try {
      unsubFirebase = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
        }
      });
    } catch {
      // Ignore in frontend standalone mode
    }

    return () => {
      unsubLocal();
      unsubFirebase();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
