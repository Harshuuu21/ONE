'use client';

import React from 'react';
import { ShieldAlert, ArrowLeft, Smartphone, RefreshCcw } from 'lucide-react';

interface RecoveryScreenProps {
  onStartRecovery: () => void;
  onCancel: () => void;
}

export function RecoveryScreen({ onStartRecovery, onCancel }: RecoveryScreenProps) {
  return (
    <div className="w-full max-w-md mx-auto p-6 md:p-8 rounded-3xl bg-card/60 backdrop-blur-xl border border-border/80 shadow-2xl space-y-6">
      <button
        type="button"
        onClick={onCancel}
        className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>Back to Login</span>
      </button>

      <div className="flex flex-col items-center text-center space-y-3">
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-semibold text-foreground">
            Account Recovery
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Lost your passkey device or switched to a new browser?
          </p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-background/50 border border-border/60 text-xs text-muted-foreground space-y-2">
        <p className="font-medium text-foreground">Recovery Verification</p>
        <p>
          We will send a one-time security code to your registered mobile number. Once verified,
          you will be able to register this new device and access your account securely.
        </p>
      </div>

      <button
        type="button"
        onClick={onStartRecovery}
        className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-primary text-primary-foreground font-medium text-sm transition-all hover:opacity-95 shadow-lg shadow-primary/20"
      >
        <Smartphone className="w-4 h-4" />
        <span>Verify with Mobile Number</span>
      </button>
    </div>
  );
}
