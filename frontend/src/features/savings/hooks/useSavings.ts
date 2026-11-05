'use client';

import { useState, useEffect } from 'react';
import { SavingsService } from '../services/savings.service';
import type { Transaction, TransactionFilter } from '../types';
import { transactions as mockTransactions } from '@/lib/one-data';

export function useSavings() {
  const [filter, setFilter] = useState<TransactionFilter>('all');
  const [allTransactions, setAllTransactions] = useState<Transaction[]>(mockTransactions);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    SavingsService.getTransactions()
      .then((data) => {
        if (mounted) setAllTransactions(data);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const filteredTransactions = allTransactions.filter((tx) => {
    if (filter === 'all') return true;
    return tx.type === filter;
  });

  return {
    filter,
    setFilter,
    transactions: filteredTransactions,
    loading,
  };
}
