import {
  ORDERED_CATEGORIES,
  SPENDING_CATEGORIES,
} from './rules/category-rules.js';
import { SpendingCategory } from './types/index.js';
import {
  CategorySpendingItem,
  PeriodFilter,
  SpendingDistributionResponse,
} from '../spending-analytics/spending-analytics.types.js';
import { calculatePeriodDateRange } from '../spending-analytics/utils/date-filter.utils.js';

export interface AggregateInputTransaction {
  id: string;
  amount: number;
  category: string;
  type: string;
  status: string;
  date: Date | string;
  title?: string;
  note?: string;
}

export class SpendingAggregationService {
  /**
   * Computes category distribution dynamically from a filtered list of transactions
   * Mathematical formulas:
   * S_c = Sum of eligible spending in category c
   * S_T = Sum of all eligible spending across all categories
   * P_c = (S_c / S_T) * 100
   */
  static aggregateDistribution(
    transactions: AggregateInputTransaction[],
    period: PeriodFilter = 'THIS_MONTH',
    customStart?: string | Date,
    customEnd?: string | Date,
    isDemo = false
  ): SpendingDistributionResponse {
    const { startDate, endDate } = calculatePeriodDateRange(period, customStart, customEnd);
    const startMs = startDate.getTime();
    const endMs = endDate.getTime();

    // 1. Filter transactions to strictly those within the date range and completed
    const periodTxs = transactions.filter((tx) => {
      const status = (tx.status || 'COMPLETED').toUpperCase();
      if (status === 'FAILED' || status === 'PENDING' || status === 'REVERSED') {
        return false;
      }
      const txMs = new Date(tx.date).getTime();
      return txMs >= startMs && txMs <= endMs;
    });

    const grossSpendMap: Record<string, number> = {};
    const refundsMap: Record<string, number> = {};
    const countMap: Record<string, number> = {};
    let totalIncome = 0;
    let eligibleDebitCount = 0;

    for (const tx of periodTxs) {
      const amount = Math.abs(Number(tx.amount) || 0);
      const type = (tx.type || 'EXPENSE').toUpperCase();

      if (type === 'TRANSFER') continue;

      if (type === 'INCOME') {
        const titleLower = (tx.title || '').toLowerCase();
        const isRefund = titleLower.includes('refund') || titleLower.includes('reversal');
        if (isRefund) {
          const cat = (tx.category as SpendingCategory) || 'MISCELLANEOUS';
          refundsMap[cat] = (refundsMap[cat] || 0) + amount;
        } else {
          totalIncome += amount;
        }
        continue;
      }

      if (type === 'EXPENSE') {
        eligibleDebitCount++;
        const cat = (tx.category as SpendingCategory) || 'MISCELLANEOUS';
        grossSpendMap[cat] = (grossSpendMap[cat] || 0) + amount;
        countMap[cat] = (countMap[cat] || 0) + 1;
      }
    }

    // 2. Compute net spend per category: S_c = max(0, gross - refunds)
    let totalNetSpend = 0;
    const categoryNetSpendMap: Record<string, number> = {};

    for (const cfg of ORDERED_CATEGORIES) {
      const gross = grossSpendMap[cfg.id] || 0;
      const refund = refundsMap[cfg.id] || 0;
      const net = Math.max(0, Math.round((gross - refund) * 100) / 100);
      categoryNetSpendMap[cfg.id] = net;
      totalNetSpend += net;
    }

    totalNetSpend = Math.round(totalNetSpend * 100) / 100;

    // 3. Compute dynamic percentages: P_c = (S_c / S_T) * 100 with zero-division safety
    const categories: CategorySpendingItem[] = ORDERED_CATEGORIES.map((cfg) => {
      const gross = Math.round((grossSpendMap[cfg.id] || 0) * 100) / 100;
      const refund = Math.round((refundsMap[cfg.id] || 0) * 100) / 100;
      const net = categoryNetSpendMap[cfg.id] || 0;

      const percentage =
        totalNetSpend > 0 ? Math.round((net / totalNetSpend) * 10000) / 100 : 0;

      return {
        categoryId: cfg.id,
        displayName: cfg.displayName,
        icon: cfg.icon,
        chartColor: cfg.chartColor,
        grossSpend: gross,
        refunds: refund,
        netSpend: net,
        percentage,
        transactionCount: countMap[cfg.id] || 0,
      };
    });

    return {
      period,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      totalNetSpend,
      totalIncome: Math.round(totalIncome * 100) / 100,
      totalTransactions: eligibleDebitCount,
      categories,
      isDemo,
      dataSource: isDemo ? 'DEMO_DATA' : 'REAL_TRANSACTION_DATA',
    };
  }
}
