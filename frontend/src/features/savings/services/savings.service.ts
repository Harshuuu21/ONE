import { transactions } from '@/lib/one-data';
import type { Transaction } from '../types';
import { AuthApi } from '@/features/authentication/services/authApi';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export class SavingsService {
  static async getTransactions(): Promise<Transaction[]> {
    try {
      const token = AuthApi.getAccessToken();
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/transactions`, { headers, credentials: 'include' });
      const json = await res.json();
      if (res.ok && json.success && Array.isArray(json.data) && json.data.length > 0) {
        return json.data.map((tx: any) => ({
          id: tx.id,
          merchant: tx.title,
          amount: Number(tx.amount),
          date: new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          category: tx.category,
          type: tx.type === 'INCOME' ? 'income' : 'expense',
          aiInsight: tx.note || undefined,
        }));
      }
    } catch {
      // Offline fallback
    }
    return transactions;
  }

  static async getAnalytics() {
    try {
      const token = AuthApi.getAccessToken();
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/transactions/analytics`, { headers, credentials: 'include' });
      const json = await res.json();
      if (res.ok && json.success) {
        return json.data;
      }
    } catch {
      // Offline fallback
    }
    return null;
  }
}
