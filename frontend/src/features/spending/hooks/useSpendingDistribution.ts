'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  CategorySpendingItem,
  PeriodFilter,
  SpendingChartSlice,
} from '../types/spending.types';
import { SpendingApi } from '../services/spendingApi';
import { DemoDataService } from '@/services/demoDataService';
import {
  calculateDonutSlices,
  getPeriodDateRange,
  mapRawCategory,
} from '../utils/spendingChart.utils';

export interface UseSpendingDistributionReturn {
  period: PeriodFilter;
  setPeriod: (period: PeriodFilter) => void;
  slices: SpendingChartSlice[];
  loading: boolean;
  error: string | null;
  hoveredCategory: string | null;
  setHoveredCategory: (categoryName: string | null) => void;
  selectedCategory: string | null;
  setSelectedCategory: (categoryName: string | null) => void;
  activeSlice: SpendingChartSlice | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to manage fetching and interactive state of the spending distribution donut chart
 */
export function useSpendingDistribution(
  initialPeriod: PeriodFilter = 'THIS_MONTH'
): UseSpendingDistributionReturn {
  const [period, setPeriod] = useState<PeriodFilter>(initialPeriod);
  const [slices, setSlices] = useState<SpendingChartSlice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fetchDistribution = useCallback(async (currentPeriod: PeriodFilter) => {
    setLoading(true);
    setError(null);
    setSelectedCategory(null);
    setHoveredCategory(null);

    try {
      // 1. Fetch from live Backend API: GET /api/spending/distribution
      const backendDist = await SpendingApi.getDistribution(currentPeriod);

      if (
        backendDist &&
        backendDist.categories &&
        backendDist.categories.length > 0 &&
        backendDist.totalNetSpend > 0
      ) {
        const computedSlices = calculateDonutSlices(backendDist.categories);
        setSlices(computedSlices);
        setLoading(false);
        return;
      }

      // 2. Fallback to Demo Data environment if backend has no recorded transactions yet
      const demoSummary = await DemoDataService.getSummary();
      if (
        demoSummary &&
        demoSummary.recentTransactions &&
        demoSummary.recentTransactions.length > 0
      ) {
        const { start, end } = getPeriodDateRange(currentPeriod);

        // Filter transactions for period: only completed expenses
        const periodTxs = demoSummary.recentTransactions.filter((tx) => {
          if (tx.type !== 'EXPENSE' || tx.status !== 'COMPLETED') return false;
          const d = new Date(tx.date).getTime();
          return d >= start.getTime() && d <= end.getTime();
        });

        if (periodTxs.length > 0) {
          // Group by category to build CategorySpendingItems
          const categoryTotals: Record<string, { net: number; count: number }> = {};
          for (const tx of periodTxs) {
            const rawCat = tx.category || 'MISCELLANEOUS';
            const cat = mapRawCategory(rawCat);
            if (!categoryTotals[cat]) categoryTotals[cat] = { net: 0, count: 0 };
            categoryTotals[cat].net += Math.abs(Number(tx.amount));
            categoryTotals[cat].count += 1;
          }

          const mockBackendItems: CategorySpendingItem[] = Object.entries(categoryTotals).map(
            ([catId, data]) => ({
              categoryId: catId as any,
              displayName: catId,
              icon: 'Tag',
              chartColor: '#14B8A6',
              grossSpend: data.net,
              refunds: 0,
              netSpend: data.net,
              percentage: 0,
              transactionCount: data.count,
            })
          );

          const computedSlices = calculateDonutSlices(mockBackendItems);
          setSlices(computedSlices);
          setLoading(false);
          return;
        }
      }

      // 3. No eligible spending for this period -> Empty state
      setSlices([]);
    } catch {
      setError('Unable to load spending distribution. Please try again.');
      setSlices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDistribution(period);
  }, [period, fetchDistribution]);

  const activeSlice = useMemo(() => {
    const targetName = hoveredCategory || selectedCategory;
    if (!targetName) return null;
    return slices.find((s) => s.name === targetName || s.categoryId === targetName) || null;
  }, [hoveredCategory, selectedCategory, slices]);

  const refetch = useCallback(async () => {
    await fetchDistribution(period);
  }, [fetchDistribution, period]);

  return {
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
  };
}
