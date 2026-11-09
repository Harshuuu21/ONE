'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  DemoDataService,
  DemoDataStatusResponse,
  DemoDataSummaryResponse,
  UserPersona,
} from '@/services/demoDataService';

export function useDemoData() {
  const [status, setStatus] = useState<DemoDataStatusResponse | null>(null);
  const [summary, setSummary] = useState<DemoDataSummaryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatusAndSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [statusRes, summaryRes] = await Promise.all([
        DemoDataService.getStatus(),
        DemoDataService.getSummary(),
      ]);
      setStatus(statusRes);
      setSummary(summaryRes);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch demo data');
    } finally {
      setLoading(false);
    }
  }, []);

  const initializeDemoData = useCallback(
    async (persona?: UserPersona, force?: boolean) => {
      try {
        setLoading(true);
        setError(null);
        const newSummary = await DemoDataService.initialize(persona, force);
        setSummary(newSummary);
        setStatus({
          isInitialized: true,
          status: 'COMPLETED',
          persona: newSummary.persona,
          generatedAt: newSummary.generatedAt,
          generatorVersion: newSummary.generatorVersion,
          recordCounts: {
            transactions: newSummary.metrics.transactionsCount,
            goals: newSummary.metrics.goalsCount,
            loans: newSummary.metrics.activeLoansCount,
            communities: newSummary.metrics.communitiesCount,
          },
        });
      } catch (err: any) {
        setError(err?.message || 'Failed to initialize demo data');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const resetDemoData = useCallback(
    async (persona?: UserPersona) => {
      try {
        setIsResetting(true);
        setError(null);
        const newSummary = await DemoDataService.reset(persona);
        setSummary(newSummary);
        setStatus({
          isInitialized: true,
          status: 'COMPLETED',
          persona: newSummary.persona,
          generatedAt: newSummary.generatedAt,
          generatorVersion: newSummary.generatorVersion,
          recordCounts: {
            transactions: newSummary.metrics.transactionsCount,
            goals: newSummary.metrics.goalsCount,
            loans: newSummary.metrics.activeLoansCount,
            communities: newSummary.metrics.communitiesCount,
          },
        });
      } catch (err: any) {
        setError(err?.message || 'Failed to reset demo data');
      } finally {
        setIsResetting(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchStatusAndSummary();
  }, [fetchStatusAndSummary]);

  return {
    status,
    summary,
    loading,
    isResetting,
    error,
    initializeDemoData,
    resetDemoData,
    refresh: fetchStatusAndSummary,
  };
}

