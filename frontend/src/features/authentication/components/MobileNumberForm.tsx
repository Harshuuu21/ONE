'use client';

import React, { useState } from 'react';
import { Smartphone, ArrowRight, ShieldCheck, KeyRound, Loader2 } from 'lucide-react';
import { OneOrb } from '@/components/common/one-mark';
import { validateIndianMobile, formatMobileDisplay } from '../utils/phone';

interface MobileNumberFormProps {
  onSubmit: (mobileNumber: string) => Promise<void>;
  onPasskeyDirectLogin?: () => void;
  hasPasskeySupported?: boolean;
  loading?: boolean;
  error?: string | null;
}

export function MobileNumberForm({
  onSubmit,
  onPasskeyDirectLogin,
  hasPasskeySupported = false,
  loading = false,
  error = null,
}: MobileNumberFormProps) {
  const [rawInput, setRawInput] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalError(null);
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setRawInput(digits);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const validation = validateIndianMobile(rawInput);
    if (!validation.isValid) {
      setLocalError(validation.error || 'Please enter a valid mobile number');
      return;
    }

    try {
      await onSubmit(validation.normalized);
    } catch (err: any) {
      setLocalError(err.message || 'Failed to send OTP. Please try again.');
    }
  };

  const isComplete = rawInput.length === 10;

  return (
    <div className="w-full max-w-md mx-auto p-6 md:p-8 rounded-3xl bg-card/60 backdrop-blur-xl border border-border/80 shadow-2xl space-y-6">
      {/* Brand & Heading */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
          <OneOrb size={44} />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-semibold tracking-tight text-foreground">
            Sign In to ONE
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter your mobile number to access your financial OS
          </p>
        </div>
      </div>

      {/* Passkey Fast-Track Option */}
      {hasPasskeySupported && onPasskeyDirectLogin && (
        <button
          type="button"
          onClick={onPasskeyDirectLogin}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-primary/5 hover:bg-primary/10 border border-primary/20 transition-all text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Fast Passkey Sign In</p>
              <p className="text-xs text-muted-foreground">Use Face ID, fingerprint, or device PIN</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}

      {/* Mobile Form */}
      <form noValidate onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Mobile Number
          </label>
          <div className="flex items-center rounded-2xl bg-background/80 border border-border focus-within:border-primary/80 focus-within:ring-2 focus-within:ring-primary/20 transition-all px-3 py-1.5">
            {/* Country Code Badge */}
            <div className="flex items-center gap-1.5 pr-3 border-r border-border text-foreground font-mono text-sm select-none">
              <span className="text-base">🇮🇳</span>
              <span className="font-semibold">+91</span>
            </div>

            {/* 10-Digit Input */}
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="98765 43210"
              value={formatMobileDisplay(rawInput)}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full bg-transparent px-3 py-2.5 font-mono text-lg tracking-wider text-foreground placeholder:text-muted-foreground/40 outline-none"
              autoFocus
            />

            {isComplete && (
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mr-1 animate-in fade-in" />
            )}
          </div>

          {(localError || error) && (
            <p className="text-xs text-destructive font-medium mt-1 animate-in fade-in">
              {localError || error}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isComplete || loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-primary text-primary-foreground font-medium text-sm transition-all hover:opacity-95 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Sending Code...</span>
            </>
          ) : (
            <>
              <span>Get Verification Code</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Security Assurance */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span>Encrypted bank-grade privacy & data sovereignty</span>
        </div>
      </form>
    </div>
  );
}

