'use client';

import React from 'react';
import { KeyRound, Smartphone, ShieldCheck, Loader2 } from 'lucide-react';
import { OneOrb } from '@/components/common/one-mark';

interface PasskeyLoginProps {
  onAuthenticate: () => Promise<void>;
  onFallbackToOtp: () => void;
  loading?: boolean;
  error?: string | null;
  userName?: string | null;
}

export function PasskeyLogin({
  onAuthenticate,
  onFallbackToOtp,
  loading = false,
  error = null,
  userName,
}: PasskeyLoginProps) {
  return (
    <div className="w-full max-w-md mx-auto p-6 md:p-8 rounded-3xl bg-card/60 backdrop-blur-xl border border-border/80 shadow-2xl space-y-6 text-center">
      {/* Brand Icon */}
      <div className="flex flex-col items-center space-y-3">
        <div className="relative">
          <div className="absolute -inset-2 rounded-full bg-primary/20 blur-lg animate-pulse" />
          <div className="relative p-3.5 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
            <KeyRound className="w-8 h-8" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-semibold text-foreground">
            {userName ? `Welcome back, ${userName}` : 'Authenticate with Device'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-xs mx-auto">
            Use your registered device PIN, Touch ID, Face ID, or Windows Hello security key
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive font-medium">
          {error}
        </div>
      )}

      {/* Main Authenticate CTA */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={onAuthenticate}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2.5 py-4 px-5 rounded-2xl bg-primary text-primary-foreground font-medium text-base transition-all hover:opacity-95 active:scale-[0.99] disabled:opacity-50 shadow-xl shadow-primary/20"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Verifying Device...</span>
            </>
          ) : (
            <>
              <KeyRound className="w-5 h-5" />
              <span>Verify Passkey / Device PIN</span>
            </>
          )}
        </button>

        {/* Fallback to Mobile OTP */}
        <button
          type="button"
          onClick={onFallbackToOtp}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-background/60 hover:bg-background border border-border text-xs font-medium text-muted-foreground hover:text-foreground transition-all"
        >
          <Smartphone className="w-4 h-4" />
          <span>Verify with Mobile Number instead</span>
        </button>
      </div>

      {/* Security notice */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>FIDO2 / WebAuthn standard &bull; Zero biometric storage</span>
      </div>
    </div>
  );
}
