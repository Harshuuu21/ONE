'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  CategorySpendingItem,
  PeriodFilter,
  SpendingChartSlice,
} from '../types/spending.types';
import { SpendingApi } from '../services/spendingApi';
import {
  calculateDonutSlices,
  getPeriodDateRange,
  mapRawCategory,
} from '../utils/spendingChart.utils';
import {
  getOrCreateFrontendDemoTransactions,
  regenerateFrontendDemoTransactions,
} from '../utils/spendingDemoData';

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
  isDemo: boolean;
  dataSource: 'DEMO_DATA' | 'REAL_TRANSACTION_DATA';
  refetch: () => Promise<void>;
  regenerateDemoData: () => Promise<void>;
}

/**
 * Custom hook to manage fetching and interactive state of the spending distribution donut chart
 * Ensures realistic 8-12 balanced category distribution across all periods.
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
  const [isDemo, setIsDemo] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<'DEMO_DATA' | 'REAL_TRANSACTION_DATA'>('DEMO_DATA');

  const computeFromLocalDemo = useCallback((selectedPeriod: PeriodFilter) => {
    const rawTxs = getOrCreateFrontendDemoTransactions();
    const { start, end } = getPeriodDateRange(selectedPeriod);
    const startMs = start.getTime();
    const endMs = end.getTime();

    // Filter transactions falling strictly within the selected period
    const filteredTxs = rawTxs.filter((tx) => {
      const txMs = new Date(tx.date).getTime();
      return txMs >= startMs && txMs <= endMs;
    });

    if (filteredTxs.length > 0) {
      const categoryTotals: Record<string, { net: number; count: number }> = {};
      for (const tx of filteredTxs) {
        const cat = mapRawCategory(tx.category);
        if (!categoryTotals[cat]) categoryTotals[cat] = { net: 0, count: 0 };
        categoryTotals[cat].net += Math.abs(Number(tx.amount));
        categoryTotals[cat].count += 1;
      }

      const mockItems: CategorySpendingItem[] = Object.entries(categoryTotals).map(
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

      const computed = calculateDonutSlices(mockItems);
      setSlices(computed);
      setIsDemo(true);
      setDataSource('DEMO_DATA');
      return true;
    }

    setSlices([]);
    return false;
  }, []);

  const fetchDistribution = useCallback(
    async (currentPeriod: PeriodFilter) => {
      setLoading(true);
      setError(null);
      setSelectedCategory(null);
      setHoveredCategory(null);

      try {
        // 1. Fetch from live Backend API: GET /api/spending/distribution
        const backendDist = await SpendingApi.getDistribution(currentPeriod);

        // If backend returned meaningful distribution with at least 4 active categories, use it
        if (
          backendDist &&
          backendDist.categories &&
          backendDist.categories.filter((c) => c.netSpend > 0).length >= 4 &&
          backendDist.totalNetSpend > 0
        ) {
          const computedSlices = calculateDonutSlices(backendDist.categories);
          setSlices(computedSlices);
          setIsDemo(Boolean(backendDist.isDemo));
          setDataSource(
            backendDist.dataSource ||
              (backendDist.isDemo ? 'DEMO_DATA' : 'REAL_TRANSACTION_DATA')
          );
          setLoading(false);
          return;
        }

        // 2. Fall back to local synthetic demo dataset (8-12 balanced categories)
        computeFromLocalDemo(currentPeriod);
      } catch {
        // 3. Network or server error fallback
        computeFromLocalDemo(currentPeriod);
      } finally {
        setLoading(false);
      }
    },
    [computeFromLocalDemo]
  );

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

  const regenerateDemoData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSelectedCategory(null);
    setHoveredCategory(null);

    try {
      // Regenerate local dataset first for instant visual response
      regenerateFrontendDemoTransactions();

      // Also trigger backend regeneration
      try {
        await SpendingApi.regenerateDemoData(period);
      } catch {
        // Backend optional
      }

      computeFromLocalDemo(period);
    } catch {
      setError('Failed to regenerate demo spending data.');
    } finally {
      setLoading(false);
    }
  }, [period, computeFromLocalDemo]);

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
    isDemo,
    dataSource,
    refetch,
    regenerateDemoData,
  };
}
