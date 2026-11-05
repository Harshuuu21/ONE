'use client';

import { useState, useEffect } from 'react';
import { AccountAggregatorApi } from '../services/accountAggregatorApi';
import { AAProvider, AAConnection } from '../types';

export function useAccountAggregator() {
  const [providers, setProviders] = useState<AAProvider[]>([]);
  const [connections, setConnections] = useState<AAConnection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [fetchedProviders, fetchedConnections] = await Promise.all([
        AccountAggregatorApi.getProviders(),
        AccountAggregatorApi.listConnections(),
      ]);
      setProviders(fetchedProviders);
      setConnections(fetchedConnections);
    } catch (err: any) {
      setError(err.message || 'Failed to load Account Aggregator data');
    } finally {
      setLoading(false);
    }
  };

  const initiate = async (providerId: string, redirectCallbackUrl?: string) => {
    setError(null);
    try {
      return await AccountAggregatorApi.initiateConnection(providerId, redirectCallbackUrl);
    } catch (err: any) {
      setError(err.message || 'Failed to initiate Account Aggregator connection');
      throw err;
    }
  };

  return {
    providers,
    connections,
    loading,
    error,
    refresh: loadData,
    initiate,
    clearError: () => setError(null),
  };
}

