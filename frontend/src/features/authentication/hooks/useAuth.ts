'use client';

import { useState } from 'react';
import { useAuthContext } from '@/contexts/AuthProvider';
import { AuthApi } from '../services/authApi';
import type { AuthUser, OtpRequestResponse, OtpVerifyResponse } from '../types';

export function useAuth() {
  const { user, loading, logout, setUser } = useAuthContext();
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestOtp = async (mobileNumber: string): Promise<OtpRequestResponse> => {
    setActionLoading(true);
    setError(null);
    try {
      return await AuthApi.requestOtp(mobileNumber);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const verifyOtp = async (mobileNumber: string, otp: string): Promise<OtpVerifyResponse> => {
    setActionLoading(true);
    setError(null);
    try {
      const response = await AuthApi.verifyOtp(mobileNumber, otp);
      setUser(response.user);
      return response;
    } catch (err: any) {
      setError(err.message || 'OTP verification failed');
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  return {
    user,
    loading: loading || actionLoading,
    isAuthenticated: !!user,
    error,
    clearError: () => setError(null),
    requestOtp,
    verifyOtp,
    logout,
  };
}
