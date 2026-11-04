'use client';

import { useState } from 'react';
import { SavingsService } from '../services/savings.service';
import type { Transaction, TransactionFilter } from '../types';

export function useSavings() {
  const [filter, setFilter] = useState<TransactionFilter>('all');
  const [allTransactions] = useState<Transaction[]>(SavingsService.getTransactions());

  const filteredTransactions = allTransactions.filter((tx) => {
    if (filter === 'all') return true;
    return tx.type === filter;
  });

  return {
    filter,
    setFilter,
    transactions: filteredTransactions,
  };
}
