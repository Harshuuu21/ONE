import { prisma } from '../../config/database.js';
import { CreateTransactionInput } from './transaction.schema.js';
import { ConsentStatus, TransactionType } from '@prisma/client';
import { BadRequestError } from '../../shared/errors/index.js';

export interface NormalizedBankTransaction {
  transactionRef: string;
  linkedBankAccountId: string;
  title: string;
  amount: number;
  category: string;
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
    return prisma.transaction.create({
      data: {
        userId,
        accountId: input.accountId,
        title: input.title,
        amount: input.amount,
        category: input.category,
        type: input.type,
        date: input.date ? new Date(input.date) : new Date(),
        note: input.note,
        source: 'MANUAL',
      },
    });
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
      // Check for duplicate by (userId, transactionRef)
      const existing = await prisma.transaction.findFirst({
        where: {
          userId,
          transactionRef: tx.transactionRef,
        },
      });

      if (existing) {
        duplicateCount++;
        continue;
      }

      await prisma.transaction.create({
        data: {
          userId,
          linkedBankAccountId: tx.linkedBankAccountId,
          transactionRef: tx.transactionRef,
          source: 'ACCOUNT_AGGREGATOR',
          title: tx.title,
          amount: tx.amount,
          category: tx.category || 'General',
          type: tx.type === 'INCOME' ? TransactionType.INCOME : TransactionType.EXPENSE,
          date: new Date(tx.date),
          note: tx.note,
        },
      });

      syncedCount++;
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
