'use client';

import { useState, useEffect } from 'react';
import { PasskeyApi } from '../services/passkeyApi';
import type { AuthUser, AuthTokens } from '../types';

export function usePasskey() {
  const [isSupported, setIsSupported] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsSupported(PasskeyApi.isSupported());
  }, []);

  const registerPasskey = async (deviceName?: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await PasskeyApi.registerPasskey(deviceName);
      return result;
    } catch (err: any) {
      setError(err.message || 'Passkey registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithPasskey = async (mobileNumber?: string): Promise<{ user: AuthUser; tokens: AuthTokens }> => {
    setLoading(true);
    setError(null);
    try {
      const result = await PasskeyApi.loginWithPasskey(mobileNumber);
      return result;
    } catch (err: any) {
      setError(err.message || 'Passkey login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    isSupported,
    loading,
    error,
    registerPasskey,
    loginWithPasskey,
    clearError: () => setError(null),
  };
}
