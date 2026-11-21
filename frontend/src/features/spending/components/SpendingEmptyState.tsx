'use client';

import React from 'react';
import { motion } from 'motion/react';
import { PieChart, Clock } from 'lucide-react';

interface SpendingEmptyStateProps {
  periodLabel?: string;
}

/**
 * Empty state for the Spending Distribution component
 * Displays when no eligible transactions exist for the selected period
 */
export function SpendingEmptyState({ periodLabel = 'this period' }: SpendingEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
      role="status"
      aria-label="No spending distribution data available"
    >
      {/* Subtle Dashed Ring Placeholder */}
      <div className="relative mb-5 flex h-40 w-40 items-center justify-center">
        <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="60"
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="14"
          />
          <circle
            cx="80"
            cy="80"
            r="60"
            fill="none"
            stroke="rgba(20, 184, 166, 0.2)"
            strokeWidth="14"
            strokeDasharray="8 12"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
            <PieChart className="h-6 w-6 opacity-80" />
          </div>
          <span className="mt-1 text-[10px] font-mono uppercase tracking-widest text-slate-500">
            0% Active
          </span>
        </div>
      </div>

      <h3 className="font-serif text-lg font-medium text-white">
        Your spending insights will appear here.
      </h3>
      <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-slate-400">
        Complete your first eligible transaction to see your spending distribution for {periodLabel}.
      </p>

      <div className="mt-4 flex items-center gap-1.5 rounded-full bg-white/[0.03] border border-white/5 px-3 py-1 text-[11px] text-slate-400">
        <Clock className="h-3 w-3 text-teal-400" />
        <span>Try selecting another period above to view historical distributions</span>
      </div>
    </motion.div>
  );
}
