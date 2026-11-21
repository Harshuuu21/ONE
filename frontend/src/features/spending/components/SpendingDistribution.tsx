'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RefreshCw, X, AlertCircle } from 'lucide-react';
import { useSpendingDistribution } from '../hooks/useSpendingDistribution';
import { PERIOD_LABELS } from '../utils/spendingChart.utils';
import { SpendingDonutChart } from './SpendingDonutChart';
import { SpendingCategoryLegend } from './SpendingCategoryLegend';
import { SpendingPeriodSelector } from './SpendingPeriodSelector';
import { SpendingEmptyState } from './SpendingEmptyState';
import { SpendingLoadingState } from './SpendingLoadingState';

export function SpendingDistribution() {
  const {
    period,
    setPeriod,
    slices,
    loading,
    error,
    hoveredCategory,
    setHoveredCategory,
    selectedCategory,
    setSelectedCategory,
    activeSlice,
    refetch,
  } = useSpendingDistribution('THIS_MONTH');

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
      {/* Background Ambience Glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

      {/* Header & Controls */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 px-2.5 py-0.5 text-xs font-semibold text-teal-400 border border-teal-500/20">
              <Sparkles className="h-3 w-3" />
              Category Insights
            </span>
          </div>
          <h2 className="mt-2 text-xl md:text-2xl font-serif font-semibold text-white tracking-tight">
            Spending Distribution
          </h2>
          <p className="mt-0.5 text-xs md:text-sm text-slate-400">
            Proportional financial allocation across categories for {PERIOD_LABELS[period]}.
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <SpendingPeriodSelector
            selected={period}
            onChange={(newPeriod) => setPeriod(newPeriod)}
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => refetch()}
            disabled={loading}
            className="p-2 rounded-full border border-white/10 bg-white/[0.03] text-slate-400 hover:text-white transition disabled:opacity-50"
            title="Refresh distribution"
            aria-label="Refresh spending distribution"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 mt-6">
        {loading ? (
          /* Dedicated Loading State */
          <SpendingLoadingState />
        ) : error && slices.length === 0 ? (
          /* Error State */
          <div className="py-12 text-center flex flex-col items-center">
            <AlertCircle className="h-8 w-8 text-red-400 mb-2 opacity-80" />
            <p className="text-sm text-slate-300 font-medium">{error}</p>
            <button
              onClick={() => refetch()}
              className="mt-3 rounded-full bg-white/10 hover:bg-white/15 px-4 py-1.5 text-xs text-white transition"
            >
              Retry
            </button>
          </div>
        ) : slices.length === 0 ? (
          /* Empty State */
          <SpendingEmptyState periodLabel={PERIOD_LABELS[period]} />
        ) : (
          /* Active Interactive Donut Chart + Legend Layout */
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            {/* Donut Chart Visualizer */}
            <div className="flex shrink-0 items-center justify-center">
              <SpendingDonutChart
                slices={slices}
                hoveredCategory={hoveredCategory}
                onHoverCategory={setHoveredCategory}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                size={280}
              />
            </div>

            {/* Compact Category Legend */}
            <div className="w-full flex-1 min-w-0">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Categories ({slices.length})
                </span>
                <span className="text-xs font-mono text-teal-400">
                  100% Total
                </span>
              </div>

              <SpendingCategoryLegend
                slices={slices}
                hoveredCategory={hoveredCategory}
                onHoverCategory={setHoveredCategory}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>
          </div>
        )}
      </div>

      {/* Selected Category Highlight Banner (STRICT RULE: NO RUPEE AMOUNTS) */}
      <AnimatePresence>
        {activeSlice && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-6 flex items-center justify-between rounded-2xl border px-4 py-2.5 text-xs transition"
            style={{
              backgroundColor: `${activeSlice.color}10`,
              borderColor: `${activeSlice.color}30`,
            }}
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: activeSlice.color }}
              />
              <span className="text-slate-300">
                Filtered view: <strong className="text-white">{activeSlice.name}</strong> accounts for{' '}
                <strong style={{ color: activeSlice.color }}>{activeSlice.percentage}%</strong> of spending across{' '}
                <strong>
                  {activeSlice.transactionCount} {activeSlice.transactionCount === 1 ? 'transaction' : 'transactions'}
                </strong>{' '}
                {PERIOD_LABELS[period]}.
              </span>
            </div>

            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:bg-white/10 hover:text-white transition"
              aria-label="Clear category selection"
            >
              <span>Clear</span>
              <X className="h-3 w-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default SpendingDistribution;
