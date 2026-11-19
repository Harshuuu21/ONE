import { prisma } from '../../../config/database.js';
import { BadRequestError, NotFoundError } from '../../../shared/errors/index.js';
import {
  ORDERED_CATEGORIES,
  SPENDING_CATEGORIES,
} from '../../spending-categorization/rules/category-rules.js';
import { MerchantRepository } from '../../spending-categorization/repositories/merchant.repository.js';
import { TransactionClassificationService } from '../../spending-categorization/services/transaction-classification.service.js';
import { isAmbiguousPersonalVpa } from '../../spending-categorization/utils/normalization.utils.js';
import { SpendingCategory } from '../../spending-categorization/types/index.js';
import { calculatePeriodDateRange } from '../utils/date-filter.utils.js';
import {
  CategoryCorrectionRequest,
  CategoryCorrectionResponse,
  CategorySpendingItem,
  IngestTransactionInput,
  PeriodFilter,
  SpendingDistributionResponse,
  SpendingSummaryResponse,
  UserMerchantMappingDto,
} from '../spending-analytics.types.js';

export class SpendingAnalyticsService {
  /**
   * Returns metadata and display configuration for all 14 active spending categories
   */
  static getCategoryList() {
    return ORDERED_CATEGORIES;
  }

  /**
   * Calculates category-wise net spending distribution for a user within a specified period
   * Enforces mathematical invariant: S_c = \sum A_i - \sum R_i
   * Percentage: P_c = (S_c / S_T) * 100 with zero-spending division guard.
   */
  static async getCategoryDistribution(
    userId: string,
    filter: PeriodFilter = 'THIS_MONTH',
    customStart?: string | Date,
    customEnd?: string | Date
  ): Promise<SpendingDistributionResponse> {
    const { startDate, endDate } = calculatePeriodDateRange(filter, customStart, customEnd);

    // Query eligible transactions within the date range
    let transactions: any[] = [];
    try {
      transactions = await prisma.transaction.findMany({
        where: {
          userId,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { date: 'desc' },
      });
    } catch (err) {
      // In offline or disconnected database environments, fall back to empty list
      transactions = [];
    }

    const grossSpendMap: Record<string, number> = {};
    const refundsMap: Record<string, number> = {};
    const countMap: Record<string, number> = {};

    let totalIncome = 0;
    let eligibleDebitCount = 0;

    for (const tx of transactions) {
      const amount = Number(tx.amount) || 0;
      const status = (tx.status || 'COMPLETED').toUpperCase();
      const type = (tx.type || 'EXPENSE').toUpperCase();

      // Exclude non-confirmed / failed / pending / reversed transactions
      if (status === 'FAILED' || status === 'PENDING' || status === 'REVERSED') {
        continue;
      }

      // Exclude internal self-transfers from spending analytics
      if (type === 'TRANSFER') {
        continue;
      }

      // Income vs Refunds vs Expenses
      if (type === 'INCOME') {
        const titleLower = (tx.title || '').toLowerCase();
        const noteLower = (tx.note || '').toLowerCase();
        const isRefund =
          status === 'REFUNDED' ||
          titleLower.includes('refund') ||
          noteLower.includes('refund') ||
          titleLower.includes('reversal');

        if (isRefund) {
          // Offsets category gross spend: S_c = Gross - Refund
          const cat = (tx.category as SpendingCategory) || 'MISCELLANEOUS';
          refundsMap[cat] = (refundsMap[cat] || 0) + amount;
        } else {
          totalIncome += amount;
        }
        continue;
      }

      // Eligible confirmed Expense / Debit
      if (type === 'EXPENSE') {
        eligibleDebitCount++;
        const cat = (tx.category as SpendingCategory) || 'MISCELLANEOUS';
        grossSpendMap[cat] = (grossSpendMap[cat] || 0) + amount;
        countMap[cat] = (countMap[cat] || 0) + 1;
      }
    }

    // Compute net spend per category: S_c = max(0, gross - refunds)
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

    // Construct response items with zero-division safety
    const categories: CategorySpendingItem[] = ORDERED_CATEGORIES.map((cfg) => {
      const gross = Math.round((grossSpendMap[cfg.id] || 0) * 100) / 100;
      const refund = Math.round((refundsMap[cfg.id] || 0) * 100) / 100;
      const net = categoryNetSpendMap[cfg.id] || 0;

      // Zero-spending guard: if totalNetSpend == 0, percentage is strictly 0.00%
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
      period: filter,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      totalNetSpend,
      totalIncome: Math.round(totalIncome * 100) / 100,
      totalTransactions: eligibleDebitCount,
      categories,
    };
  }

  /**
   * Computes top-level spending KPIs: total spend, net savings, savings rate, and top category
   */
  static async getSpendingSummary(
    userId: string,
    filter: PeriodFilter = 'THIS_MONTH',
    customStart?: string | Date,
    customEnd?: string | Date
  ): Promise<SpendingSummaryResponse> {
    const distribution = await this.getCategoryDistribution(
      userId,
      filter,
      customStart,
      customEnd
    );

    const totalSpend = distribution.totalNetSpend;
    const totalIncome = distribution.totalIncome;
    const netSavings = Math.round((totalIncome - totalSpend) * 100) / 100;
    const savingsRate =
      totalIncome > 0 ? Math.max(0, Math.round(((totalIncome - totalSpend) / totalIncome) * 100)) : 0;

    // Find top spending category with netSpend > 0
    let topCategory: SpendingSummaryResponse['topCategory'] = null;
    let highestAmount = 0;

    for (const cat of distribution.categories) {
      if (cat.netSpend > highestAmount) {
        highestAmount = cat.netSpend;
        topCategory = {
          categoryId: cat.categoryId,
          displayName: cat.displayName,
          amount: cat.netSpend,
          percentage: cat.percentage,
        };
      }
    }

    // Calculate daily average spend within the period
    const startMs = new Date(distribution.startDate).getTime();
    const endMs = new Date(distribution.endDate).getTime();
    const nowMs = Date.now();
    const elapsedMs = Math.max(1, Math.min(endMs, nowMs) - startMs);
    const elapsedDays = Math.max(1, Math.ceil(elapsedMs / (1000 * 60 * 60 * 24)));
    const averageDailySpend = Math.round((totalSpend / elapsedDays) * 100) / 100;

    return {
      period: distribution.period,
      startDate: distribution.startDate,
      endDate: distribution.endDate,
      totalSpend,
      totalIncome,
      netSavings,
      savingsRate,
      topCategory,
      averageDailySpend,
      eligibleTransactionCount: distribution.totalTransactions,
    };
  }

  /**
   * Retrieves paginated transactions for a user within a period, with optional category filter
   */
  static async getSpendingTransactions(
    userId: string,
    options: {
      period?: PeriodFilter;
      category?: SpendingCategory;
      customStart?: string | Date;
      customEnd?: string | Date;
      limit?: number;
      offset?: number;
    } = {}
  ) {
    const { period = 'THIS_MONTH', category, customStart, customEnd, limit = 50, offset = 0 } = options;
    const { startDate, endDate } = calculatePeriodDateRange(period, customStart, customEnd);

    const where: any = {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (category) {
      where.category = category;
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          classificationRecord: true,
        },
        orderBy: { date: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.transaction.count({ where }),
    ]);

    return {
      period,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      category: category || null,
      total,
      limit,
      offset,
      transactions,
    };
  }

  /**
   * Updates a transaction's category per user correction
   * Preserves originalPredictedCategory, sets isManuallyCorrected=true, and updates audit records.
   * If rememberMerchantMapping is requested for a valid merchant, saves user-scoped merchant learning.
   */
  static async correctTransactionCategory(
    userId: string,
    transactionId: string,
    input: CategoryCorrectionRequest
  ): Promise<CategoryCorrectionResponse> {
    const tx = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!tx || tx.userId !== userId) {
      throw new NotFoundError('Transaction not found or access denied.');
    }

    if (!SPENDING_CATEGORIES[input.newCategory]) {
      throw new BadRequestError(`Invalid spending category: '${input.newCategory}'.`);
    }

    const previousCategory = tx.category;
    const originalPredictedCategory = tx.originalPredictedCategory || previousCategory;
    const correctionTimestamp = new Date();

    // Update transaction record
    const updatedTx = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        category: input.newCategory,
        originalPredictedCategory,
        isManuallyCorrected: true,
        correctionTimestamp,
      },
    });

    // Record / Update classification audit entry
    try {
      await prisma.transactionClassification.upsert({
        where: { transactionId },
        update: {
          finalCategoryId: input.newCategory,
          manuallyCorrected: true,
          correctedByUserId: userId,
          updatedAt: correctionTimestamp,
        },
        create: {
          transactionId,
          predictedCategoryId: originalPredictedCategory,
          finalCategoryId: input.newCategory,
          confidenceScore: tx.confidenceScore || 100,
          classificationMethod: 'USER_CONFIRMED_MAPPING',
          manuallyCorrected: true,
          correctedByUserId: userId,
        },
      });
    } catch (err) {
      // Classification record logging fallback
    }

    let merchantMappingCreated = false;
    let message = `Transaction category updated from ${previousCategory} to ${input.newCategory}.`;

    // Handle user-scoped merchant learning
    if (input.rememberMerchantMapping) {
      const isAmbiguous = isAmbiguousPersonalVpa(tx.upiId);
      const merchantKey =
        tx.merchantId ||
        tx.normalizedMerchantName ||
        tx.upiId ||
        tx.merchantName ||
        tx.title;

      if (isAmbiguous) {
        message = `Category updated. Personal UPI handles are not remembered as global merchant rules to preserve categorization safety.`;
      } else if (merchantKey) {
        const cleanKey = merchantKey.toLowerCase().trim();

        // Save in-memory repository for fast classification pipeline
        MerchantRepository.saveUserConfirmedMapping(userId, cleanKey, input.newCategory, false);

        // Persist to UserMerchantCorrection database table
        try {
          await prisma.userMerchantCorrection.upsert({
            where: {
              userId_normalizedMerchantKey: {
                userId,
                normalizedMerchantKey: cleanKey,
              },
            },
            update: {
              correctedCategoryId: input.newCategory,
              merchantIdentifier: tx.merchantId,
              isAmbiguousPersonalVpa: false,
              updatedAt: correctionTimestamp,
            },
            create: {
              userId,
              normalizedMerchantKey: cleanKey,
              merchantIdentifier: tx.merchantId,
              correctedCategoryId: input.newCategory,
              isAmbiguousPersonalVpa: false,
            },
          });
          merchantMappingCreated = true;
          message = `Category updated to ${input.newCategory} and remembered for future transactions from "${merchantKey}".`;
        } catch (dbErr) {
          // In-memory mapping active even if DB table upsert encounters issues
          merchantMappingCreated = true;
          message = `Category updated to ${input.newCategory} and remembered for future transactions from "${merchantKey}".`;
        }
      }
    }

    return {
      transactionId,
      previousCategory,
      originalPredictedCategory,
      finalCategory: input.newCategory,
      isManuallyCorrected: true,
      correctionTimestamp: correctionTimestamp.toISOString(),
      merchantMappingCreated,
      merchantIdentifier: tx.merchantId || tx.normalizedMerchantName || undefined,
      message,
    };
  }

  /**
   * Ingests a new transaction into ONE's financial pipeline with automated categorization
   * Validates status, prevents duplicates by transactionRef, and executes classification.
   */
  static async ingestTransaction(userId: string, input: IngestTransactionInput) {
    // 1. Prevent duplicate transaction ingestion
    if (input.transactionRef) {
      const existing = await prisma.transaction.findFirst({
        where: {
          userId,
          transactionRef: input.transactionRef,
        },
      });

      if (existing) {
        return {
          duplicate: true,
          message: 'Transaction already ingested with identical transactionRef.',
          transaction: existing,
        };
      }
    }

    // 2. Validate transaction status & confirmation
    const status = (input.status || 'COMPLETED').toUpperCase();
    const type = (input.type || 'EXPENSE').toUpperCase() as any;
    const isConfirmedPayment =
      input.isConfirmedPayment ?? (status === 'COMPLETED');

    // 3. Execute classification algorithm
    const classification = TransactionClassificationService.classify({
      userId,
      transactionId: input.transactionRef || input.sourceTransactionId,
      amount: input.amount,
      merchantName: input.merchantName || input.title,
      upiId: input.upiId,
      upiHolderName: input.upiHolderName,
      merchantId: input.merchantId,
      mcc: input.mcc,
      bankDescription: input.bankDescription,
      transactionRef: input.transactionRef,
      isConfirmedPayment,
    });

    // 4. Store transaction with classification provenance
    const tx = await prisma.transaction.create({
      data: {
        userId,
        title: input.title || input.merchantName || 'Financial Transaction',
        amount: input.amount,
        category: classification.finalCategory,
        type,
        source: input.source || 'MANUAL',
        status,
        transactionRef: input.transactionRef,
        sourceTransactionId: input.sourceTransactionId,
        merchantName: input.merchantName,
        normalizedMerchantName: classification.normalizedMerchantName,
        upiId: input.upiId,
        merchantId: classification.identifiedMerchantId || input.merchantId,
        mcc: input.mcc ? String(input.mcc) : undefined,
        originalPredictedCategory: classification.predictedCategory,
        confidenceScore: classification.confidenceScore,
        classificationMethod: classification.classificationMethod,
        isManuallyCorrected: false,
        date: input.date ? new Date(input.date) : new Date(),
        note: input.note,
        linkedBankAccountId: input.linkedBankAccountId,
        accountId: input.accountId,
      },
    });

    // 5. Store audit classification record
    try {
      await prisma.transactionClassification.create({
        data: {
          transactionId: tx.id,
          predictedCategoryId: classification.predictedCategory,
          finalCategoryId: classification.finalCategory,
          confidenceScore: classification.confidenceScore,
          classificationMethod: classification.classificationMethod,
          matchedSignals: classification.availableEvidence as any,
          conflictsDetected: classification.conflictsDetected as any,
          manuallyCorrected: false,
        },
      });
    } catch (auditErr) {
      // Non-blocking classification audit fallback
    }

    return {
      duplicate: false,
      transaction: tx,
      classification,
    };
  }

  /**
   * Returns details for a verified merchant and any user-specific customization
   */
  static async getMerchantDetails(userId: string, idOrKey: string) {
    const verified =
      MerchantRepository.findVerifiedById(idOrKey) ||
      MerchantRepository.findVerifiedByName(idOrKey)?.merchant ||
      MerchantRepository.findVerifiedByUpi(idOrKey);

    const userMapping = MerchantRepository.findUserConfirmedMapping(userId, idOrKey);

    return {
      identifier: verified?.merchantIdentifier || idOrKey,
      name: verified?.originalName || idOrKey,
      normalizedName: verified?.normalizedName || idOrKey.toLowerCase(),
      defaultCategory: verified?.category || 'MISCELLANEOUS',
      isVerified: Boolean(verified),
      userCustomMapping: userMapping
        ? {
            assignedCategory: userMapping.assignedCategory,
            confirmationCount: userMapping.confirmationCount,
            lastConfirmedAt: userMapping.lastConfirmedAt,
          }
        : null,
    };
  }

  /**
   * Lists all user-confirmed merchant-to-category learning records
   */
  static async listMerchantMappings(userId: string): Promise<UserMerchantMappingDto[]> {
    // Check database records first
    try {
      const records = await prisma.userMerchantCorrection.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
      });

      if (records.length > 0) {
        return records.map((r) => ({
          id: r.id,
          userId: r.userId,
          merchantIdentifier: r.merchantIdentifier || undefined,
          merchantKey: r.normalizedMerchantKey,
          assignedCategory: r.correctedCategoryId as SpendingCategory,
          confirmationCount: 1,
          lastConfirmedAt: r.updatedAt.toISOString(),
          isAmbiguousPersonalVpa: r.isAmbiguousPersonalVpa,
        }));
      }
    } catch (err) {
      // Fall through to in-memory repository
    }

    // In-memory fallback
    const memList = MerchantRepository.listUserConfirmedMappings(userId);
    return memList.map((m) => ({
      id: m.id,
      userId: m.userId,
      merchantKey: m.merchantKey,
      assignedCategory: m.assignedCategory,
      confirmationCount: m.confirmationCount,
      lastConfirmedAt: typeof m.lastConfirmedAt === 'string' ? m.lastConfirmedAt : new Date(m.lastConfirmedAt).toISOString(),
      isAmbiguousPersonalVpa: m.isAmbiguousPersonalVpa,
    }));
  }

  /**
   * Explicitly creates a user-specific merchant mapping rule
   */
  static async createMerchantMapping(
    userId: string,
    data: {
      merchantKey: string;
      category: SpendingCategory;
      merchantIdentifier?: string;
    }
  ): Promise<UserMerchantMappingDto> {
    if (!SPENDING_CATEGORIES[data.category]) {
      throw new BadRequestError(`Invalid category: ${data.category}`);
    }

    const cleanKey = data.merchantKey.toLowerCase().trim();
    const isAmbiguous = isAmbiguousPersonalVpa(cleanKey);

    if (isAmbiguous) {
      throw new BadRequestError(
        'Cannot create persistent merchant mapping for an ambiguous personal UPI VPA (e.g. mobile number or @paytm handle).'
      );
    }

    // Save in-memory
    const memRecord = MerchantRepository.saveUserConfirmedMapping(
      userId,
      cleanKey,
      data.category,
      false
    );

    // Save in database
    try {
      const record = await prisma.userMerchantCorrection.upsert({
        where: {
          userId_normalizedMerchantKey: {
            userId,
            normalizedMerchantKey: cleanKey,
          },
        },
        update: {
          correctedCategoryId: data.category,
          merchantIdentifier: data.merchantIdentifier,
          isAmbiguousPersonalVpa: false,
          updatedAt: new Date(),
        },
        create: {
          userId,
          normalizedMerchantKey: cleanKey,
          merchantIdentifier: data.merchantIdentifier,
          correctedCategoryId: data.category,
          isAmbiguousPersonalVpa: false,
        },
      });

      return {
        id: record.id,
        userId: record.userId,
        merchantIdentifier: record.merchantIdentifier || undefined,
        merchantKey: record.normalizedMerchantKey,
        assignedCategory: record.correctedCategoryId as SpendingCategory,
        confirmationCount: memRecord.confirmationCount,
        lastConfirmedAt: record.updatedAt.toISOString(),
        isAmbiguousPersonalVpa: false,
      };
    } catch (err) {
      return {
        id: memRecord.id,
        userId: memRecord.userId,
        merchantKey: memRecord.merchantKey,
        assignedCategory: memRecord.assignedCategory,
        confirmationCount: memRecord.confirmationCount,
        lastConfirmedAt: typeof memRecord.lastConfirmedAt === 'string' ? memRecord.lastConfirmedAt : new Date(memRecord.lastConfirmedAt).toISOString(),
        isAmbiguousPersonalVpa: false,
      };
    }
  }

  /**
   * Deletes a user-specific merchant mapping rule
   */
  static async deleteMerchantMapping(userId: string, idOrKey: string): Promise<boolean> {
    const memDeleted = MerchantRepository.deleteUserConfirmedMapping(userId, idOrKey);

    try {
      await prisma.userMerchantCorrection.deleteMany({
        where: {
          userId,
          OR: [{ id: idOrKey }, { normalizedMerchantKey: idOrKey.toLowerCase().trim() }],
        },
      });
    } catch (err) {
      // In-memory deletion still succeeded
    }

    return memDeleted;
  }
}
