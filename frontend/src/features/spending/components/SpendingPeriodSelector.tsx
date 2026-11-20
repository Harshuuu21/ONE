'use client';

import React from 'react';
import { motion } from 'motion/react';
import { PeriodFilter } from '../types';

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
    <div className="inline-flex items-center gap-1 overflow-x-auto rounded-full border border-white/10 bg-white/[0.03] p-1 backdrop-blur-md">
      {PERIOD_OPTIONS.map((opt) => {
        const isSelected = selected === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(opt.id)}
            className={`relative rounded-full px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap focus:outline-none disabled:opacity-50 ${
              isSelected ? 'text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {isSelected && (
              <motion.div
                layoutId="spending-period-pill"
                className="absolute inset-0 rounded-full bg-teal-400 shadow-sm shadow-teal-500/30"
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
