'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, RefreshCw, ShieldCheck, Loader2 } from 'lucide-react';
import { OneOrb } from '@/components/common/one-mark';

interface OtpVerificationProps {
  mobileNumber: string;
  cooldownSeconds?: number;
  devMockOtp?: string;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  onChangeNumber: () => void;
  loading?: boolean;
  error?: string | null;
}

export function OtpVerification({
  mobileNumber,
  cooldownSeconds = 45,
  devMockOtp,
  onVerify,
  onResend,
  onChangeNumber,
  loading = false,
  error = null,
}: OtpVerificationProps) {
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState<number>(cooldownSeconds);
  const [isResending, setIsResending] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleDigitChange = (index: number, value: string) => {
    setLocalError(null);
    const cleaned = value.replace(/\D/g, '');

    // Handle multi-character paste into one input
    if (cleaned.length > 1) {
      const pasted = cleaned.slice(0, 6).split('');
      const newOtp = [...otpDigits];
      pasted.forEach((char, i) => {
        if (index + i < 6) newOtp[index + i] = char;
      });
      setOtpDigits(newOtp);
      const nextIndex = Math.min(index + pasted.length, 5);
      inputRefs.current[nextIndex]?.focus();

      // If full 6 digits, auto submit
      if (newOtp.every((d) => d !== '')) {
        onVerify(newOtp.join(''));
      }
      return;
    }

    const newOtp = [...otpDigits];
    newOtp[index] = cleaned;
    setOtpDigits(newOtp);

    // Auto advance focus
    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit on last digit
    if (cleaned && index === 5 && newOtp.every((d) => d !== '')) {
      onVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (timer > 0 || isResending) return;
    setIsResending(true);
    setLocalError(null);
    try {
      await onResend();
      setTimer(cooldownSeconds);
      setOtpDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setLocalError(err.message || 'Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join('');
    if (code.length !== 6) {
      setLocalError('Please enter all 6 digits of the code');
      return;
    }
    onVerify(code);
  };

  const isComplete = otpDigits.every((d) => d !== '');

  return (
    <div className="w-full max-w-md mx-auto p-6 md:p-8 rounded-3xl bg-card/60 backdrop-blur-xl border border-border/80 shadow-2xl space-y-6">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onChangeNumber}
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Change Number</span>
        </button>

        <div className="flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>256-bit Encrypted</span>
        </div>
      </div>

      {/* Brand & Heading */}
      <div className="flex flex-col items-center text-center space-y-2">
        <OneOrb size={40} />
        <h1 className="text-2xl font-serif font-semibold text-foreground">
          Enter Verification Code
        </h1>
        <p className="text-sm text-muted-foreground">
          Sent to <span className="font-mono text-foreground font-semibold">{mobileNumber}</span>
        </p>
      </div>

      {/* Dev helper indicator if devMockOtp is supplied */}
      {devMockOtp && (
        <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-center">
          <p className="text-xs text-primary font-mono font-medium">
            Development Mode OTP: <span className="underline font-bold">{devMockOtp}</span>
          </p>
        </div>
      )}

      {/* 6-Cell OTP Inputs */}
      <form noValidate onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between gap-2 md:gap-3">
          {otpDigits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              disabled={loading}
              className={`w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-mono font-bold rounded-2xl bg-background/80 border transition-all outline-none ${
                digit
                  ? 'border-primary shadow-sm shadow-primary/20 text-primary'
                  : 'border-border text-foreground'
              } focus:border-primary focus:ring-2 focus:ring-primary/20`}
            />
          ))}
        </div>

        {(localError || error) && (
          <p className="text-xs text-center text-destructive font-medium animate-in fade-in">
            {localError || error}
          </p>
        )}

        {/* Verify CTA */}
        <button
          type="submit"
          disabled={!isComplete || loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-primary text-primary-foreground font-medium text-sm transition-all hover:opacity-95 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying Code...</span>
            </>
          ) : (
            <span>Verify & Continue</span>
          )}
        </button>

        {/* Resend Cooldown */}
        <div className="flex items-center justify-center text-xs text-muted-foreground pt-1">
          {timer > 0 ? (
            <p>
              Resend code in <span className="font-mono text-foreground font-medium">{timer}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="flex items-center gap-1.5 text-primary hover:underline font-medium transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
              <span>Resend Verification Code</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

