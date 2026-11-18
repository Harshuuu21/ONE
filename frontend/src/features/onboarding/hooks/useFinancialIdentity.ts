import { useState, useEffect, useCallback } from 'react';
import { FinancialProfile, OnboardingCompletionResponse } from '../types';
import { FinancialIdentityApi } from '../services/financialIdentityApi';

export function useFinancialIdentity() {
  const [profile, setProfile] = useState<FinancialProfile>({
    occupation: 'WORKING_PROFESSIONAL',
    onboardingStep: 1,
    onboardingComplete: false,
    interests: [],
    financialGoals: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing profile to enable instant resume
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const data = await FinancialIdentityApi.getProfile();
        if (mounted) {
          setProfile(data);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Failed to load financial profile');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const saveStepProgress = useCallback(
    async (partial: Partial<FinancialProfile>, nextStep?: number) => {
      setSaving(true);
      setError(null);
      try {
        const payload: Partial<FinancialProfile> = {
          ...partial,
          ...(nextStep !== undefined ? { onboardingStep: nextStep } : {}),
        };
        const updated = await FinancialIdentityApi.updateProfile(payload);
        setProfile((prev) => ({ ...prev, ...updated }));
        return updated;
      } catch (err: any) {
        setError(err.message || 'Failed to save progress');
        throw err;
      } finally {
        setSaving(false);
      }
    },
    []
  );

  const completeOnboardingWizard = useCallback(
    async (finalProfile: FinancialProfile): Promise<OnboardingCompletionResponse> => {
      setSaving(true);
      setError(null);
      try {
        const response = await FinancialIdentityApi.completeOnboarding(finalProfile);
        setProfile((prev) => ({
          ...prev,
          ...response.profile,
          onboardingComplete: true,
          onboardingStep: 5,
        }));
        return response;
      } catch (err: any) {
        setError(err.message || 'Failed to complete onboarding');
        throw err;
      } finally {
        setSaving(false);
      }
    },
    []
  );

  return {
    profile,
    setProfile,
    loading,
    saving,
    error,
    saveStepProgress,
    completeOnboardingWizard,
  };
}

