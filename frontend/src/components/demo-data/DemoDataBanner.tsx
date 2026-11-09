'use client';

import React, { useState } from 'react';
import { Sparkles, RefreshCw, ChevronRight, X } from 'lucide-react';
import { UserPersona } from '@/services/demoDataService';
import { ResetDemoDataDialog } from './ResetDemoDataDialog';

interface DemoDataBannerProps {
  persona?: UserPersona;
  onReset: (persona: UserPersona) => Promise<void>;
  isResetting?: boolean;
}

const PERSONA_LABELS: Record<UserPersona, string> = {
  WORKING_PROFESSIONAL: 'Working Professional',
  STUDENT: 'Student',
  FREELANCER: 'Freelancer / Creator',
  BUSINESS_OWNER: 'Business Owner',
};

export function DemoDataBanner({
  persona = 'WORKING_PROFESSIONAL',
  onReset,
  isResetting = false,
}: DemoDataBannerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return (
      <button
        onClick={() => setIsDialogOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-emerald-500/30 bg-card/90 px-4 py-2 text-xs font-medium text-emerald-800 dark:text-emerald-300 shadow-lg backdrop-blur-md hover:border-emerald-500/50 transition-all"
      >
        <Sparkles className="size-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>Demo Mode: {PERSONA_LABELS[persona]}</span>
      </button>
    );
  }

  return (
    <>
      <div className="relative mb-6 overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent p-4 sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
            <Sparkles className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                Demo Environment Active
              </span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-800 dark:text-emerald-300">
                {PERSONA_LABELS[persona]}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Simulated Indian transactions, reducing-balance loans, and communities tailored to your profile.
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 sm:mt-0">
          <button
            type="button"
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-background/80 px-3.5 py-1.5 text-xs font-medium text-emerald-900 dark:text-emerald-200 hover:bg-emerald-500/10 transition-colors"
          >
            <RefreshCw className="size-3" />
            <span>Switch / Reset</span>
          </button>
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            title="Dismiss banner"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>

      <ResetDemoDataDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirmReset={onReset}
        currentPersona={persona}
        isResetting={isResetting}
      />
    </>
  );
}
