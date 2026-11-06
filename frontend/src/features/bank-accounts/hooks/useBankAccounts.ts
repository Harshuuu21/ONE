'use client';

import { useState, useEffect } from 'react';
import { BankAccountsApi } from '../services/bankAccountsApi';
import { DiscoveredAccount, LinkedBankAccount } from '../types';

export function useBankAccounts() {
  const [discovered, setDiscovered] = useState<DiscoveredAccount[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<DiscoveredAccount[]>([]);
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedBankAccount[]>([]);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLinked = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await BankAccountsApi.listLinkedAccounts();
      setLinkedAccounts(data.accounts);
      setTotalBalance(data.totalBalance);
    } catch (err: any) {
      setError(err.message || 'Failed to load linked accounts');
    } finally {
      setLoading(false);
    }
  };

  const discover = async (providerId?: string, correlationId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const accounts = await BankAccountsApi.discoverAccounts(providerId, correlationId);
      setDiscovered(accounts);
      // Auto-select eligible accounts by default for convenience
      setSelectedAccounts(accounts.filter((a) => !a.isAlreadyLinked));
      return accounts;
    } catch (err: any) {
      setError(err.message || 'Failed to discover bank accounts');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleAccountSelection = (account: DiscoveredAccount) => {
    const key = `${account.fipId}_${account.accountNumberMasked}`;
    setSelectedAccounts((prev) => {
      const exists = prev.some((a) => `${a.fipId}_${a.accountNumberMasked}` === key);
      if (exists) {
        return prev.filter((a) => `${a.fipId}_${a.accountNumberMasked}` !== key);
      } else {
        return [...prev, account];
      }
    });
  };

  const linkSelected = async (providerId: string, aaConnectionId?: string) => {
    if (selectedAccounts.length === 0) {
      throw new Error('Please select at least one account to link');
    }
    setLoading(true);
    setError(null);
    try {
      const result = await BankAccountsApi.linkAccounts(providerId, selectedAccounts, aaConnectionId);
      try {
        await fetchLinked();
      } catch {
        setLinkedAccounts(result.accounts);
        setTotalBalance(result.accounts.reduce((sum, a) => sum + (Number(a.balance) || 0), 0));
      }
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to link accounts');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const delink = async (accountId: string) => {
    setLoading(true);
    try {
      await BankAccountsApi.delinkAccount(accountId);
      await fetchLinked();
    } catch (err: any) {
      setError(err.message || 'Failed to delink account');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    discovered,
    selectedAccounts,
    linkedAccounts,
    totalBalance,
    loading,
    error,
    discover,
    toggleAccountSelection,
    setSelectedAccounts,
    linkSelected,
    delink,
    fetchLinked,
    clearError: () => setError(null),
  };
}

