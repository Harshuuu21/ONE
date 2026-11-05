'use client';

import { useState, useEffect, useCallback } from 'react';
import { ConsentRecord, RequestConsentParams, RequestConsentResponse } from '../types';
import { ConsentApi } from '../services/consentApi';

export function useConsent(autoFetch = true) {
  const [consents, setConsents] = useState<ConsentRecord[]>([]);
  const [activeConsent, setActiveConsent] = useState<ConsentRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConsents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ConsentApi.listConsents();
      setConsents(data);
      const active = data.find((c) => c.status === 'APPROVED') || null;
      setActiveConsent(active);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch consent records');
    } finally {
      setLoading(false);
    }
  }, []);

  const requestConsent = useCallback(
    async (params: RequestConsentParams): Promise<RequestConsentResponse> => {
      setLoading(true);
      setError(null);
      try {
        const res = await ConsentApi.requestConsent(params);
        return res;
      } catch (err: any) {
        setError(err.message || 'Failed to initiate consent request');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const revokeConsent = useCallback(
    async (consentId: string, reason?: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        await ConsentApi.revokeConsent(consentId, reason);
        await fetchConsents();
        return true;
      } catch (err: any) {
        setError(err.message || 'Failed to revoke consent');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchConsents]
  );

  const getConsentDetails = useCallback(async (idOrHandle: string): Promise<ConsentRecord> => {
    setLoading(true);
    setError(null);
    try {
      return await ConsentApi.getConsent(idOrHandle);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch consent details');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchConsents();
    }
  }, [autoFetch, fetchConsents]);

  return {
    consents,
    activeConsent,
    loading,
    error,
    fetchConsents,
    requestConsent,
    revokeConsent,
    getConsentDetails,
  };
}
