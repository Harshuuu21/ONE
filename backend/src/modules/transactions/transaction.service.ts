import { prisma } from '../../config/database.js';
import { CreateTransactionInput } from './transaction.schema.js';
import { ConsentStatus, TransactionType } from '@prisma/client';
import { BadRequestError } from '../../shared/errors/index.js';
import { SpendingAnalyticsService } from '../spending-analytics/services/spending-analytics.service.js';
import { IngestTransactionInput } from '../spending-analytics/spending-analytics.types.js';

export interface NormalizedBankTransaction {
  transactionRef: string;
  linkedBankAccountId: string;
  title: string;
  amount: number;
  category?: string;
  merchantName?: string;
  upiId?: string;
  mcc?: string | number;
  bankDescription?: string;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  date: string | Date;
  note?: string;
}

export class TransactionService {
  static async listUserTransactions(userId: string) {
    return prisma.transaction.findMany({
      where: { userId },
      include: {
        linkedBankAccount: {
          select: {
            id: true,
            bankName: true,
            accountNumberMasked: true,
            accountType: true,
          },
        },
      },
      orderBy: { date: 'desc' },
      take: 100,
    });
  }

  static async createTransaction(userId: string, input: CreateTransactionInput) {
    // If category is not provided or manual entry, run through intelligent ingestion
    const ingested = await SpendingAnalyticsService.ingestTransaction(userId, {
      amount: input.amount,
      title: input.title,
      type: input.type as any,
      source: 'MANUAL',
      date: input.date,
      note: input.note,
      accountId: input.accountId,
    });

    return ingested.transaction;
  }

  /**
   * Unified ingestion pipeline for transactions from any provider or feed
   */
  static async ingestTransaction(userId: string, input: IngestTransactionInput) {
    return SpendingAnalyticsService.ingestTransaction(userId, input);
  }

  /**
   * Synchronizes normalized financial transactions from Account Aggregator FIP
   * Enforces active consent check, deduplication by transactionRef, and balance sync.
   */
  static async syncBankTransactions(userId: string, transactions: NormalizedBankTransaction[]) {
    // 1. Verify that user has an ACTIVE consent
    const activeConsent = await prisma.consent.findFirst({
      where: {
        userId,
        status: ConsentStatus.APPROVED,
        validUntil: { gt: new Date() },
      },
    });

    if (!activeConsent) {
      throw new BadRequestError('Cannot sync financial data: Active ReBIT consent is missing, revoked, or expired.');
    }

    let syncedCount = 0;
    let duplicateCount = 0;

    for (const tx of transactions) {
      const result = await SpendingAnalyticsService.ingestTransaction(userId, {
        transactionRef: tx.transactionRef,
        linkedBankAccountId: tx.linkedBankAccountId,
        source: 'ACCOUNT_AGGREGATOR',
        title: tx.title,
        merchantName: tx.merchantName,
        upiId: tx.upiId,
        mcc: tx.mcc,
        bankDescription: tx.bankDescription,
        amount: tx.amount,
        type: tx.type === 'INCOME' ? 'INCOME' : tx.type === 'TRANSFER' ? 'TRANSFER' : 'EXPENSE',
        date: tx.date,
        note: tx.note,
        status: 'COMPLETED',
        isConfirmedPayment: true,
      });

      if (result.duplicate) {
        duplicateCount++;
      } else {
        syncedCount++;
      }
    }

    // Update lastSyncedAt on linked accounts
    const accountIds = Array.from(new Set(transactions.map((t) => t.linkedBankAccountId)));
    if (accountIds.length > 0) {
      await prisma.linkedBankAccount.updateMany({
        where: { id: { in: accountIds } },
        data: { lastSyncedAt: new Date() },
      });
    }

    return {
      success: true,
      syncedCount,
      duplicateCount,
      lastSyncedAt: new Date(),
    };
  }

  /**
   * Spending Analytics calculation for Dashboard, Reports, & Savings
   */
  static async getSpendingAnalytics(userId: string) {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryTotals: Record<string, number> = {};

    transactions.forEach((tx) => {
      const val = Number(tx.amount);
      if (tx.type === TransactionType.INCOME) {
        totalIncome += val;
      } else {
        totalExpense += val;
        categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + val;
      }
    });

    const categoryBreakdown = Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0,
    }));

    return {
      totalIncome,
      totalExpense,
      netSavings: totalIncome - totalExpense,
      savingsRate: totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0,
      categoryBreakdown,
      transactionsCount: transactions.length,
    };
  }
}
