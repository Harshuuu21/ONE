'use client';

import React from 'react';
import { Info } from 'lucide-react';

interface SpendingDemoLabelProps {
  className?: string;
}

/**
 * Visual badge shown when spending analytics are powered by synthetic demo data.
 * Adheres strictly to Section 9 of the Spending Intelligence Specification.
 */
export function SpendingDemoLabel({ className = '' }: SpendingDemoLabelProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1 text-xs backdrop-blur-md ${className}`}
      role="status"
      aria-label="Synthetic spending demo data notice"
    >
      <span className="flex h-2 w-2 rounded-full bg-teal-500 dark:bg-teal-400 animate-pulse" />
      <span className="font-mono text-[11px] font-bold tracking-wider text-teal-700 dark:text-teal-300 uppercase">
        DEMO DATA
      </span>
      <span className="hidden sm:inline text-muted-foreground dark:text-slate-400">·</span>
      <span className="hidden sm:inline text-[11px] text-foreground/80 dark:text-slate-300">
        Illustrative spending distribution for preview purposes.
      </span>
      <Info className="h-3 w-3 text-teal-600 dark:text-teal-400/70 sm:hidden" />
    </div>
  );
}
export default SpendingDemoLabel;
