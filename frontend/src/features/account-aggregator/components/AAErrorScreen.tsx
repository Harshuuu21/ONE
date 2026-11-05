'use client';

import React from 'react';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';

interface AAErrorScreenProps {
  errorTitle?: string;
  errorMessage?: string;
  onRetry: () => void;
  onBack: () => void;
}

export function AAErrorScreen({
  errorTitle = 'Connection Incomplete',
  errorMessage = 'The Account Aggregator connection was interrupted or cancelled. No credentials or data were stored.',
  onRetry,
  onBack,
}: AAErrorScreenProps) {
  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-3xl bg-card/60 backdrop-blur-xl border border-destructive/20 shadow-2xl text-center space-y-6">
      <div className="w-14 h-14 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-center mx-auto">
        <AlertCircle className="w-7 h-7" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          {errorTitle}
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
          {errorMessage}
        </p>
      </div>

      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={onRetry}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-primary text-primary-foreground font-medium text-sm transition-all hover:opacity-95 shadow-lg shadow-primary/20"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>

        <button
          type="button"
          onClick={onBack}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-background/60 hover:bg-background border border-border text-xs font-medium text-muted-foreground hover:text-foreground transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Choose Different Provider</span>
        </button>
      </div>
    </div>
  );
}
