'use client';

import React from 'react';
import { motion } from 'motion/react';
import { PeriodFilter } from '../types/spending.types';

interface PeriodOption {
  id: PeriodFilter;
  label: string;
}

const PERIOD_OPTIONS: PeriodOption[] = [
  { id: 'THIS_WEEK', label: 'This Week' },
  { id: 'THIS_MONTH', label: 'This Month' },
  { id: 'LAST_MONTH', label: 'Last Month' },
  { id: 'LAST_3_MONTHS', label: 'Last 3 Months' },
  { id: 'THIS_YEAR', label: 'This Year' },
];

interface SpendingPeriodSelectorProps {
  selected: PeriodFilter;
  onChange: (period: PeriodFilter) => void;
  disabled?: boolean;
}

export function SpendingPeriodSelector({
  selected,
  onChange,
  disabled = false,
}: SpendingPeriodSelectorProps) {
  return (
    <div
      className="inline-flex items-center gap-1 overflow-x-auto rounded-full border border-border bg-secondary/50 dark:border-white/10 dark:bg-white/[0.03] p-1 backdrop-blur-md"
      role="tablist"
      aria-label="Select spending period"
    >
      {PERIOD_OPTIONS.map((opt) => {
        const isSelected = selected === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={isSelected}
            disabled={disabled}
            onClick={() => onChange(opt.id)}
            className={`relative rounded-full px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 disabled:opacity-50 ${
              isSelected ? 'text-primary-foreground font-semibold' : 'text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            {isSelected && (
              <motion.div
                layoutId="spending-period-pill"
                className="absolute inset-0 rounded-full bg-primary dark:bg-teal-400 shadow-sm shadow-primary/20 dark:shadow-teal-500/30"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <span className="relative z-10">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
