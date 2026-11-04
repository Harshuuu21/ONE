import { transactions } from '@/lib/one-data';
import type { Transaction } from '../types';

export class SavingsService {
  static getTransactions(): Transaction[] {
    return transactions;
  }
}

