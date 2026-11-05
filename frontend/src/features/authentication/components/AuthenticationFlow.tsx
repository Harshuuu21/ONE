'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { MobileNumberForm } from './MobileNumberForm';
import { OtpVerification } from './OtpVerification';
import { PasskeyLogin } from './PasskeyLogin';
import { PasskeyRegistration } from './PasskeyRegistration';
import { RecoveryScreen } from './RecoveryScreen';
import { useAuth } from '../hooks/useAuth';
import { usePasskey } from '../hooks/usePasskey';
import { AuthApi } from '../services/authApi';
import type { AuthFlowStep, OtpVerifyResponse } from '../types';

interface AuthenticationFlowProps {
  initialStep?: AuthFlowStep;
}

export function AuthenticationFlow({ initialStep = 'MOBILE_INPUT' }: AuthenticationFlowProps) {
  const router = useRouter();
  const { requestOtp, verifyOtp, loading: authLoading, error: authError, clearError } = useAuth();
  const {
    isSupported: passkeySupported,
    loginWithPasskey,
    registerPasskey,
    loading: passkeyLoading,
    error: passkeyError,
    clearError: clearPasskeyError,
  } = usePasskey();

  const [step, setStep] = useState<AuthFlowStep>(initialStep);
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [devMockOtp, setDevMockOtp] = useState<string | undefined>();
  const [verifiedResponse, setVerifiedResponse] = useState<OtpVerifyResponse | null>(null);

  // Check if browser has passkey capability
  const loading = authLoading || passkeyLoading;
  const activeError = authError || passkeyError;

  const handleMobileSubmit = async (mobile: string) => {
    clearError();
    clearPasskeyError();
    setMobileNumber(mobile);

    // 1. Identify user to see if returning user with passkey
    const idInfo = await AuthApi.identify(mobile);

    if (idInfo.exists && idInfo.hasPasskey && passkeySupported) {
      // Direct passkey flow for returning user!
      setStep('PASSKEY_PROMPT');
      return;
    }

    // 2. Otherwise request OTP
    const res = await requestOtp(mobile);
    setDevMockOtp(res.devMockOtp);
    setStep('OTP_INPUT');
  };

  const handleOtpVerify = async (otp: string) => {
    clearError();
    const result = await verifyOtp(mobileNumber, otp);
    setVerifiedResponse(result);

    if (result.isNewUser) {
      // New User Flow: Redirect to AA Provider Onboarding
      router.push('/setup');
      return;
    }

    if (!result.hasPasskey && passkeySupported) {
      // Returning user without passkey on this device &rarr; offer passkey setup
      setStep('PASSKEY_REGISTER');
      return;
    }

    // Returning user with passkey or unsupported browser &rarr; straight to Dashboard
    router.push('/dashboard');
  };

  const handlePasskeyLogin = async () => {
    clearPasskeyError();
    try {
      await loginWithPasskey(mobileNumber || undefined);
      router.push('/dashboard');
    } catch {
      // Error handled by usePasskey
    }
  };

  const handlePasskeyRegister = async (deviceName?: string) => {
    clearPasskeyError();
    try {
      await registerPasskey(deviceName);
      router.push('/dashboard');
    } catch {
      // Error handled by usePasskey
    }
  };

  const handleSkipPasskey = () => {
    router.push('/dashboard');
  };

  return (
    <div className="relative min-h-[90svh] flex flex-col justify-center items-center px-4 py-8">
      <AnimatePresence mode="wait">
        {step === 'MOBILE_INPUT' && (
          <motion.div
            key="mobile"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <MobileNumberForm
              onSubmit={handleMobileSubmit}
              onPasskeyDirectLogin={passkeySupported ? () => setStep('PASSKEY_PROMPT') : undefined}
              hasPasskeySupported={passkeySupported}
              loading={loading}
              error={activeError}
            />
          </motion.div>
        )}

        {step === 'OTP_INPUT' && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <OtpVerification
              mobileNumber={mobileNumber}
              devMockOtp={devMockOtp}
              onVerify={handleOtpVerify}
              onResend={() => requestOtp(mobileNumber).then((r) => setDevMockOtp(r.devMockOtp))}
              onChangeNumber={() => setStep('MOBILE_INPUT')}
              loading={loading}
              error={activeError}
            />
          </motion.div>
        )}

        {step === 'PASSKEY_PROMPT' && (
          <motion.div
            key="passkey_prompt"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <PasskeyLogin
              onAuthenticate={handlePasskeyLogin}
              onFallbackToOtp={async () => {
                if (mobileNumber) {
                  const res = await requestOtp(mobileNumber);
                  setDevMockOtp(res.devMockOtp);
                  setStep('OTP_INPUT');
                } else {
                  setStep('MOBILE_INPUT');
                }
              }}
              loading={loading}
              error={activeError}
            />
          </motion.div>
        )}

        {step === 'PASSKEY_REGISTER' && (
          <motion.div
            key="passkey_register"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <PasskeyRegistration
              onRegister={handlePasskeyRegister}
              onSkip={handleSkipPasskey}
              loading={loading}
              error={activeError}
            />
          </motion.div>
        )}

        {step === 'RECOVERY' && (
          <motion.div
            key="recovery"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <RecoveryScreen
              onStartRecovery={() => setStep('MOBILE_INPUT')}
              onCancel={() => setStep('MOBILE_INPUT')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

