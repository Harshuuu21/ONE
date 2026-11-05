'use client';

import React from 'react';
import { Loader2, ShieldCheck, Lock, ArrowUpRight } from 'lucide-react';
import { OneOrb } from '@/components/common/one-mark';
import { AAProvider } from '../types';

interface AAConnectingScreenProps {
  provider?: AAProvider;
  redirectUrl?: string;
  onManualRedirect?: () => void;
}

export function AAConnectingScreen({
  provider,
  redirectUrl,
  onManualRedirect,
}: AAConnectingScreenProps) {
  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-3xl bg-card/60 backdrop-blur-xl border border-border/80 shadow-2xl text-center space-y-6">
      <div className="relative inline-flex items-center justify-center">
        <div className="absolute -inset-4 rounded-full bg-primary/20 blur-xl animate-pulse" />
        <OneOrb size={64} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2 text-primary font-medium text-xs font-mono">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>ESTABLISHING SECURE AA TUNNEL</span>
        </div>
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          Connecting to {provider?.name || 'Account Aggregator'}
        </h2>
        <p className="text-xs text-muted-foreground max-w-xs mx-auto">
          You are being redirected to the official hosted AA portal to verify your phone number and discover your bank accounts.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-background/60 border border-border/70 text-left space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-medium text-foreground">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>RBI Master Direction Compliant</span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          The Account Aggregator network uses 256-bit asymmetric cryptography. ONE receives only
          read-only consent-authorized data.
        </p>
      </div>

      {redirectUrl && (
        <button
          type="button"
          onClick={onManualRedirect || (() => (window.location.href = redirectUrl))}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-medium transition-all"
        >
          <span>Click here if not redirected automatically</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

