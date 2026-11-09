'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface DemoDataBadgeProps {
  label?: string;
  className?: string;
  showIcon?: boolean;
}

export function DemoDataBadge({
  label = 'Demo',
  className = '',
  showIcon = true,
}: DemoDataBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium tracking-wide text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300 ${className}`}
    >
      {showIcon && <Sparkles className="size-2.5 opacity-80" />}
      <span>{label}</span>
    </span>
  );
}

