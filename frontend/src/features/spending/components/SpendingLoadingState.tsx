'use client';

import React from 'react';

/**
 * Dedicated Loading Skeleton for the Spending Distribution Donut Chart & Category Legend
 * Follows ONE's dark fintech aesthetic with subtle pulsing gradients.
 */
export function SpendingLoadingState() {
  return (
    <div
      className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 py-4"
      aria-label="Loading spending distribution"
      role="status"
    >
      {/* Donut Ring Skeleton */}
      <div className="relative flex shrink-0 items-center justify-center">
        <div className="relative h-[280px] w-[280px] flex items-center justify-center">
          {/* Outer pulsed ring */}
          <div className="h-64 w-64 rounded-full border-[24px] border-white/[0.04] animate-pulse" />
          
          {/* Shimmer accent arc overlay */}
          <div className="absolute h-64 w-64 rounded-full border-[24px] border-t-teal-500/20 border-r-teal-500/10 border-b-transparent border-l-transparent animate-spin duration-1000" />

          {/* Central content placeholder */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="h-9 w-20 rounded-lg bg-white/[0.06] animate-pulse" />
            <div className="mt-2 h-3 w-32 rounded bg-white/[0.04] animate-pulse" />
            <div className="mt-1.5 h-2.5 w-24 rounded bg-white/[0.03] animate-pulse" />
          </div>
        </div>
      </div>

      {/* Category Legend Skeleton */}
      <div className="w-full flex-1 min-w-0">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="h-3 w-28 rounded bg-white/[0.06] animate-pulse" />
          <div className="h-3 w-16 rounded bg-teal-500/20 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.04] bg-white/[0.02] p-3 animate-pulse"
            >
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-xl bg-white/[0.06]" />
                <div className="space-y-1.5">
                  <div className="h-3 w-20 rounded bg-white/[0.06]" />
                  <div className="h-2.5 w-12 rounded bg-white/[0.03]" />
                </div>
              </div>
              <div className="h-6 w-12 rounded-lg bg-white/[0.06]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
