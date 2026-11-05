'use client';

import React, { useState } from 'react';
import { KeyRound, Shield, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { OneOrb } from '@/components/common/one-mark';

interface PasskeyRegistrationProps {
  onRegister: (deviceName?: string) => Promise<void>;
  onSkip: () => void;
  loading?: boolean;
  error?: string | null;
}

export function PasskeyRegistration({
  onRegister,
  onSkip,
  loading = false,
  error = null,
}: PasskeyRegistrationProps) {
  const [deviceName, setDeviceName] = useState('');

  const handleRegister = () => {
    onRegister(deviceName.trim() || undefined);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 md:p-8 rounded-3xl bg-card/60 backdrop-blur-xl border border-border/80 shadow-2xl space-y-6">
      {/* Icon & Heading */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
          <KeyRound className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-semibold text-foreground">
            Activate Passkey Sign In
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in instantly next time with your device PIN, Touch ID, Face ID, or Windows Hello
          </p>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="space-y-3 py-2">
        <div className="flex items-start gap-3 p-3 rounded-2xl bg-background/50 border border-border/60">
          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold text-foreground">Phishing-Resistant Security</p>
            <p className="text-muted-foreground mt-0.5">
              Cryptographically bound to ONE domain. Immune to SMS intercept and SIM swap attacks.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-2xl bg-background/50 border border-border/60">
          <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold text-foreground">Private & On-Device</p>
            <p className="text-muted-foreground mt-0.5">
              Biometrics and PINs never leave your local device hardware chip.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive font-medium text-center">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={handleRegister}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-primary text-primary-foreground font-medium text-sm transition-all hover:opacity-95 active:scale-[0.99] disabled:opacity-50 shadow-lg shadow-primary/20"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Registering Device...</span>
            </>
          ) : (
            <>
              <span>Register Device Passkey</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onSkip}
          disabled={loading}
          className="w-full py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip for now, go to Dashboard
        </button>
      </div>
    </div>
  );
}

