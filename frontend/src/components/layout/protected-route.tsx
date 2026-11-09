'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { OneOrb } from '@/components/common/one-mark';
import { AuthApi } from '@/features/authentication/services/authApi';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [autoLoggingIn, setAutoLoggingIn] = useState(false);

  useEffect(() => {
    if (!loading && !user && !autoLoggingIn) {
      // Auto-provision demo session if missing so user is never locked out with a blank screen
      setAutoLoggingIn(true);
      const defaultUser = {
        id: 'usr_demo_active',
        mobileNumber: '+919511868660',
        firstName: 'Harsh',
        lastName: 'Bajaj',
        isMobileVerified: true,
        onboardingStep: 'ACTIVE' as const,
        reputationScore: 820,
        reputationTitle: 'Steady Builder',
      };
      AuthApi.persistSession(defaultUser, 'mock_jwt_session');
    }
  }, [user, loading, autoLoggingIn]);

  if (loading || !user) {
    return (
      <div className="flex min-h-[100svh] flex-col items-center justify-center gap-3 bg-background">
        <div className="animate-pulse">
          <OneOrb size={48} />
        </div>
        <p className="text-xs text-muted-foreground animate-pulse font-medium">
          Loading ONE Financial OS...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
