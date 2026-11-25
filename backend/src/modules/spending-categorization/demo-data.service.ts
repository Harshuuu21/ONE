import { prisma } from '../../config/database.js';
import {
  DemoTransactionGenerator,
  DemoTransactionRecord,
} from './demo-transaction-generator.js';

/**
 * Isolated User Demo Data Service
 * Ensures strict user-level data segregation and separation from real bank transactions.
 * Persists synthetic spending datasets per user so dashboard refreshes reuse the existing data.
 */
export class DemoDataService {
  // In-memory cache keyed by userId for instant retrieval & offline resilience
  private static userDemoCache = new Map<string, DemoTransactionRecord[]>();

  /**
   * Checks whether demo spending data already exists for the user
   */
  static async hasDemoData(userId: string): Promise<boolean> {
    if (this.userDemoCache.has(userId) && this.userDemoCache.get(userId)!.length > 0) {
      return true;
    }

    try {
      const count = await prisma.transaction.count({
        where: {
          userId,
          isDemo: true,
        },
      });
      return count > 0;
    } catch {
      // In disconnected database environments, fall back to in-memory check
      return false;
    }
  }

  /**
   * Retrieves existing demo transactions, or generates them on first access
   */
  static async getOrCreateDemoTransactions(userId: string): Promise<DemoTransactionRecord[]> {
    // 1. Check in-memory cache first
    const cached = this.userDemoCache.get(userId);
    if (cached && cached.length > 0) {
      return cached;
    }

    // 2. Check database for existing demo transactions
    try {
      const dbRecords = await prisma.transaction.findMany({
        where: {
          userId,
          isDemo: true,
        },
        orderBy: { date: 'desc' },
      });

      if (dbRecords.length > 0) {
        const formatted: DemoTransactionRecord[] = dbRecords.map((r) => ({
          id: r.id,
          userId: r.userId,
          title: r.title,
          merchant: r.merchant || r.merchantName || 'Merchant',
          amount: Number(r.amount),
          category: r.category as any,
          type: r.type as any,
          paymentMethod: r.paymentMethod || 'UPI',
          status: 'COMPLETED',
          date: new Date(r.date),
          isDemo: true,
          note: r.note || undefined,
          originalPredictedCategory: (r.originalPredictedCategory as any) || r.category,
          confidenceScore: Number(r.confidenceScore) || 95.0,
          classificationMethod: r.classificationMethod || 'SYNTHETIC_DEMO_ENGINE',
        }));

        this.userDemoCache.set(userId, formatted);
        return formatted;
      }
    } catch {
      // Database not available or offline, proceed to generate
    }

    // 3. First-time initialization: generate synthetic dataset
    return this.generateAndStore(userId);
  }

  /**
   * Development-only regeneration of the user's demo dataset
   * Wipes only demo transactions for this user and generates a fresh set
   */
  static async regenerateDemoTransactions(userId: string): Promise<DemoTransactionRecord[]> {
    try {
      // Only delete demo transactions for this user, never actual financial transactions
      await prisma.transaction.deleteMany({
        where: {
          userId,
          isDemo: true,
        },
      });
    } catch {
      // Offline fallback
    }

    this.userDemoCache.delete(userId);
    return this.generateAndStore(userId);
  }

  /**
   * Internal generator and storage helper
   */
  private static async generateAndStore(userId: string): Promise<DemoTransactionRecord[]> {
    const transactions = DemoTransactionGenerator.generateTransactions(userId);

    // Save to memory cache
    this.userDemoCache.set(userId, transactions);

    // Try saving to database for persistence across server restarts
    try {
      const recordsToInsert = transactions.map((tx) => ({
        id: tx.id,
        userId: tx.userId,
        title: tx.title,
        merchant: tx.merchant,
        merchantName: tx.merchant,
        normalizedMerchantName: tx.merchant.toLowerCase(),
        amount: tx.amount,
        category: tx.category,
        type: tx.type,
        paymentMethod: tx.paymentMethod,
        status: tx.status,
        date: tx.date,
        isDemo: true,
        source: 'SYNTHETIC_DEMO',
        note: tx.note,
        originalPredictedCategory: tx.originalPredictedCategory,
        confidenceScore: tx.confidenceScore,
        classificationMethod: tx.classificationMethod,
      }));

      // Create in batches or individual upserts
      for (const record of recordsToInsert) {
        await prisma.transaction.upsert({
          where: { id: record.id },
          update: record,
          create: record,
        });
      }
    } catch {
      // Graceful fallback to memory storage if DB is unreachable
    }

    return transactions;
  }
}
