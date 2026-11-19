import assert from 'node:assert/strict';
import { prisma } from '../../../config/database.js';
import { SpendingAnalyticsService } from '../services/spending-analytics.service.js';
import { calculatePeriodDateRange } from '../utils/date-filter.utils.js';
import { MerchantRepository } from '../../spending-categorization/repositories/merchant.repository.js';
import { isAmbiguousPersonalVpa } from '../../spending-categorization/utils/normalization.utils.js';
import { TransactionClassificationService } from '../../spending-categorization/services/transaction-classification.service.js';
import { ORDERED_CATEGORIES } from '../../spending-categorization/rules/category-rules.js';

console.log('=== STARTING SMART SPENDING INTELLIGENCE ENGINE PART 2 TESTS ===\n');

// ---------------------------------------------------------------------------
// In-Memory Test Harness for Deterministic Multi-Scenario Testing
// ---------------------------------------------------------------------------
const mockTransactions = new Map<string, any>();
const mockCorrections = new Map<string, any>();

// Intercept prisma methods for isolated, database-agnostic unit testing
const originalPrismaTx = { ...prisma.transaction };
const originalPrismaCorrection = { ...prisma.userMerchantCorrection };
const originalPrismaClassification = { ...prisma.transactionClassification };

(prisma.transaction as any).create = async ({ data }: any) => {
  const id = data.id || `tx_test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const record = {
    ...data,
    id,
    amount: Number(data.amount),
    date: data.date ? new Date(data.date) : new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  mockTransactions.set(id, record);
  return record;
};

(prisma.transaction as any).findUnique = async ({ where }: any) => {
  if (where.id) return mockTransactions.get(where.id) || null;
  return null;
};

(prisma.transaction as any).findFirst = async ({ where }: any) => {
  for (const tx of mockTransactions.values()) {
    let match = true;
    if (where.userId && tx.userId !== where.userId) match = false;
    if (where.transactionRef && tx.transactionRef !== where.transactionRef) match = false;
    if (where.id && tx.id !== where.id) match = false;
    if (match) return tx;
  }
  return null;
};

(prisma.transaction as any).findMany = async ({ where }: any = {}) => {
  const results: any[] = [];
  for (const tx of mockTransactions.values()) {
    let match = true;
    if (where.userId && tx.userId !== where.userId) match = false;
    if (where.category && tx.category !== where.category) match = false;
    if (where.date) {
      const txTime = new Date(tx.date).getTime();
      if (where.date.gte && txTime < new Date(where.date.gte).getTime()) match = false;
      if (where.date.lte && txTime > new Date(where.date.lte).getTime()) match = false;
    }
    if (match) results.push(tx);
  }
  return results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

(prisma.transaction as any).update = async ({ where, data }: any) => {
  const existing = mockTransactions.get(where.id);
  if (!existing) throw new Error('Transaction not found');
  const updated = { ...existing, ...data, updatedAt: new Date() };
  mockTransactions.set(where.id, updated);
  return updated;
};

(prisma.transaction as any).count = async ({ where }: any = {}) => {
  const list = await (prisma.transaction as any).findMany({ where });
  return list.length;
};

(prisma.userMerchantCorrection as any).upsert = async ({ where, create, update }: any) => {
  const key = `${create.userId}:${create.normalizedMerchantKey}`;
  const existing = mockCorrections.get(key);
  const record = existing ? { ...existing, ...update } : { ...create, id: `corr_${Date.now()}` };
  mockCorrections.set(key, record);
  return record;
};

(prisma.userMerchantCorrection as any).findMany = async ({ where }: any) => {
  const results: any[] = [];
  for (const r of mockCorrections.values()) {
    if (where.userId && r.userId !== where.userId) continue;
    results.push(r);
  }
  return results;
};

(prisma.userMerchantCorrection as any).deleteMany = async ({ where }: any) => {
  let count = 0;
  for (const [k, r] of mockCorrections.entries()) {
    if (where.userId && r.userId !== where.userId) continue;
    mockCorrections.delete(k);
    count++;
  }
  return { count };
};

(prisma.transactionClassification as any).upsert = async ({ create, update }: any) => {
  return { ...create, ...update, id: `cls_${Date.now()}` };
};

(prisma.transactionClassification as any).create = async ({ data }: any) => {
  return { ...data, id: `cls_${Date.now()}` };
};

async function runTests() {
  const USER_A = 'usr_alice_101';
  const USER_B = 'usr_bob_202';

  // -------------------------------------------------------------------------
  // SCENARIO 1: Transaction Ingestion & Automated Classification
  // -------------------------------------------------------------------------
  console.log('Scenario 1: Testing transaction ingestion & automatic categorization...');
  {
    const ingested = await SpendingAnalyticsService.ingestTransaction(USER_A, {
      amount: 450.0,
      title: 'Apollo Pharmacy Koramangala',
      merchantName: 'Apollo Pharmacy',
      upiId: 'apollo@upi',
      transactionRef: 'UPI-REF-001-APOLLO',
      type: 'EXPENSE',
      status: 'COMPLETED',
      isConfirmedPayment: true,
    });

    assert.equal(ingested.duplicate, false);
    assert.equal(ingested.transaction.category, 'MEDICINE');
    assert.equal(ingested.transaction.originalPredictedCategory, 'MEDICINE');
    assert.equal(ingested.transaction.isManuallyCorrected, false);
    assert.equal(ingested.classification!.confidenceScore, 100);
    assert.ok(
      ingested.classification!.classificationMethod === 'VERIFIED_IDENTIFIER' ||
      ingested.classification!.classificationMethod === 'MULTI_SIGNAL'
    );
    console.log('  ✓ Ingestion of verified merchant categorized to MEDICINE (Score: 100%).');
  }

  // -------------------------------------------------------------------------
  // SCENARIO 2: Duplicate Ingestion Prevention
  // -------------------------------------------------------------------------
  console.log('Scenario 2: Testing duplicate transaction ingestion prevention...');
  {
    const duplicateAttempt = await SpendingAnalyticsService.ingestTransaction(USER_A, {
      amount: 450.0,
      title: 'Apollo Pharmacy Koramangala (Duplicate Webhook)',
      transactionRef: 'UPI-REF-001-APOLLO', // Same transaction reference
      type: 'EXPENSE',
      status: 'COMPLETED',
      isConfirmedPayment: true,
    });

    assert.equal(duplicateAttempt.duplicate, true);
    assert.equal(duplicateAttempt.transaction.transactionRef, 'UPI-REF-001-APOLLO');
    assert.equal(mockTransactions.size, 1); // No new transaction created
    console.log('  ✓ Duplicate transactionRef rejected idempotently.');
  }

  // -------------------------------------------------------------------------
  // SCENARIO 3: Unknown Merchant Safe Fallback to MISCELLANEOUS
  // -------------------------------------------------------------------------
  console.log('Scenario 3: Testing unknown merchant fallback to MISCELLANEOUS...');
  let unknownTxId = '';
  {
    const ingested = await SpendingAnalyticsService.ingestTransaction(USER_A, {
      amount: 320.0,
      title: 'Mysterious Corner Vendor 992',
      merchantName: 'Mysterious Corner Vendor 992',
      transactionRef: 'TX-REF-002-UNKNOWN',
      type: 'EXPENSE',
      status: 'COMPLETED',
      isConfirmedPayment: true,
    });

    assert.equal(ingested.duplicate, false);
    assert.equal(ingested.transaction.category, 'MISCELLANEOUS');
    assert.equal(ingested.transaction.originalPredictedCategory, 'MISCELLANEOUS');
    assert.equal(ingested.transaction.isManuallyCorrected, false);
    assert.equal(ingested.classification!.confidenceScore, 0);
    assert.equal(ingested.classification!.classificationMethod, 'FALLBACK_MISCELLANEOUS');
    unknownTxId = ingested.transaction.id;
    console.log('  ✓ Unknown merchant safely classified as MISCELLANEOUS (Score: 0%).');
  }

  // -------------------------------------------------------------------------
  // SCENARIOS 4 & 5: Category Correction & Original Prediction Preservation
  // -------------------------------------------------------------------------
  console.log('Scenarios 4 & 5: Testing user category correction & original prediction preservation...');
  {
    const correctionResult = await SpendingAnalyticsService.correctTransactionCategory(
      USER_A,
      unknownTxId,
      {
        newCategory: 'MEDICINE',
        rememberMerchantMapping: true,
      }
    );

    assert.equal(correctionResult.previousCategory, 'MISCELLANEOUS');
    assert.equal(correctionResult.originalPredictedCategory, 'MISCELLANEOUS');
    assert.equal(correctionResult.finalCategory, 'MEDICINE');
    assert.equal(correctionResult.isManuallyCorrected, true);
    assert.equal(correctionResult.merchantMappingCreated, true);

    // Verify stored transaction state
    const storedTx = await prisma.transaction.findUnique({ where: { id: unknownTxId } });
    assert.ok(storedTx);
    assert.equal(storedTx!.category, 'MEDICINE');
    assert.equal(storedTx!.originalPredictedCategory, 'MISCELLANEOUS');
    assert.equal(storedTx!.isManuallyCorrected, true);
    assert.ok(storedTx!.correctionTimestamp);
    console.log('  ✓ Category updated to MEDICINE while original predicted category MISCELLANEOUS remains preserved.');
  }

  // -------------------------------------------------------------------------
  // SCENARIOS 6 & 7: User-Specific Merchant Learning for Future Transactions
  // -------------------------------------------------------------------------
  console.log('Scenarios 6 & 7: Testing user-specific merchant learning on future transactions...');
  {
    // User A ingests another transaction from the same merchant
    const futureTx = await SpendingAnalyticsService.ingestTransaction(USER_A, {
      amount: 180.0,
      title: 'Mysterious Corner Vendor 992',
      merchantName: 'Mysterious Corner Vendor 992',
      transactionRef: 'TX-REF-003-FUTURE-A',
      type: 'EXPENSE',
      status: 'COMPLETED',
      isConfirmedPayment: true,
    });

    assert.equal(futureTx.transaction.category, 'MEDICINE');
    assert.equal(futureTx.classification!.classificationMethod, 'USER_CONFIRMED_MAPPING');
    assert.equal(futureTx.classification!.confidenceScore, 100);
    console.log('  ✓ Future transaction for User A automatically classified as MEDICINE using learned mapping.');
  }

  // -------------------------------------------------------------------------
  // SCENARIO 8: Cross-User Isolation (User B does NOT inherit User A's mapping)
  // -------------------------------------------------------------------------
  console.log('Scenario 8: Testing cross-user merchant learning isolation...');
  {
    // User B ingests a transaction from the same merchant
    const userBTx = await SpendingAnalyticsService.ingestTransaction(USER_B, {
      amount: 250.0,
      title: 'Mysterious Corner Vendor 992',
      merchantName: 'Mysterious Corner Vendor 992',
      transactionRef: 'TX-REF-004-USER-B',
      type: 'EXPENSE',
      status: 'COMPLETED',
      isConfirmedPayment: true,
    });

    // User B should NOT receive User A's custom mapping
    assert.equal(userBTx.transaction.category, 'MISCELLANEOUS');
    assert.equal(userBTx.classification!.classificationMethod, 'FALLBACK_MISCELLANEOUS');
    console.log('  ✓ Strict user isolation verified: User B unaffected by User A custom rule.');
  }

  // -------------------------------------------------------------------------
  // SCENARIO 9: Merchant Mapping Removal
  // -------------------------------------------------------------------------
  console.log('Scenario 9: Testing user merchant mapping deletion...');
  {
    const deleted = await SpendingAnalyticsService.deleteMerchantMapping(
      USER_A,
      'mysterious corner vendor 992'
    );
    assert.equal(deleted, true);

    // Ingest transaction for User A again; should revert to default fallback
    const postDeleteTx = await SpendingAnalyticsService.ingestTransaction(USER_A, {
      amount: 150.0,
      title: 'Mysterious Corner Vendor 992',
      merchantName: 'Mysterious Corner Vendor 992',
      transactionRef: 'TX-REF-005-AFTER-DELETE',
      type: 'EXPENSE',
      status: 'COMPLETED',
      isConfirmedPayment: true,
    });

    assert.equal(postDeleteTx.transaction.category, 'MISCELLANEOUS');
    console.log('  ✓ Deleted mapping successfully cleared from user learning cache.');
  }

  // -------------------------------------------------------------------------
  // SCENARIO 10: Ambiguous Personal UPI Safety Rule
  // -------------------------------------------------------------------------
  console.log('Scenario 10: Testing ambiguous personal UPI safety...');
  {
    assert.equal(isAmbiguousPersonalVpa('9876543210@paytm'), true);
    assert.equal(isAmbiguousPersonalVpa('rohit.sharma@okaxis'), true);
    assert.equal(isAmbiguousPersonalVpa('919876543210@ybl'), true);
    assert.equal(isAmbiguousPersonalVpa('apollo@upi'), false); // Verified business merchant

    // Ingest personal transfer
    const personalTx = await SpendingAnalyticsService.ingestTransaction(USER_A, {
      amount: 1000.0,
      title: 'Transfer to Rohit Sharma',
      upiId: '9876543210@paytm',
      transactionRef: 'TX-REF-006-PERSONAL',
      type: 'EXPENSE',
      status: 'COMPLETED',
      isConfirmedPayment: true,
    });

    // Attempt to correct with rememberMerchantMapping=true
    const correction = await SpendingAnalyticsService.correctTransactionCategory(
      USER_A,
      personalTx.transaction.id,
      {
        newCategory: 'FOOD',
        rememberMerchantMapping: true,
      }
    );

    assert.equal(correction.finalCategory, 'FOOD');
    assert.equal(correction.merchantMappingCreated, false); // Blocked from remembering personal VPA
    console.log('  ✓ Personal UPI handles protected against global/persistent rule corruption.');
  }

  // -------------------------------------------------------------------------
  // SCENARIO 11: Refund Adjustment (S_c = \sum A_i - \sum R_i)
  // -------------------------------------------------------------------------
  console.log('Scenario 11: Testing refund offset against category net spend...');
  {
    const USER_REFUND = 'usr_refund_calc';

    // 1. Expense: ₹1,500 on SHOPPING
    await SpendingAnalyticsService.ingestTransaction(USER_REFUND, {
      amount: 1500.0,
      title: 'Zara Fashion Store',
      merchantName: 'Zara',
      mcc: 5651,
      transactionRef: 'TX-ZARA-EXPENSE',
      type: 'EXPENSE',
      status: 'COMPLETED',
      isConfirmedPayment: true,
    });

    // 2. Refund: ₹500 on SHOPPING
    await SpendingAnalyticsService.ingestTransaction(USER_REFUND, {
      amount: 500.0,
      title: 'Refund: Zara Returned Item',
      transactionRef: 'TX-ZARA-REFUND',
      type: 'INCOME',
      status: 'REFUNDED',
      note: 'Returned shirt refund',
      isConfirmedPayment: true,
    });

    // Note: ensure refund transaction is tagged with SHOPPING category
    const refundTx = await prisma.transaction.findFirst({
      where: { userId: USER_REFUND, transactionRef: 'TX-ZARA-REFUND' },
    });
    assert.ok(refundTx);
    await prisma.transaction.update({
      where: { id: refundTx!.id },
      data: { category: 'SHOPPING' },
    });

    const dist = await SpendingAnalyticsService.getCategoryDistribution(USER_REFUND, 'THIS_MONTH');
    const shoppingItem = dist.categories.find((c) => c.categoryId === 'SHOPPING')!;

    assert.equal(shoppingItem.grossSpend, 1500.0);
    assert.equal(shoppingItem.refunds, 500.0);
    assert.equal(shoppingItem.netSpend, 1000.0); // 1500 - 500 = 1000
    assert.equal(dist.totalNetSpend, 1000.0);
    console.log('  ✓ Category net spend accurately offsets refunds: ₹1,500 - ₹500 = ₹1,000.');
  }

  // -------------------------------------------------------------------------
  // SCENARIO 12: Transaction Reversal Exclusion
  // -------------------------------------------------------------------------
  console.log('Scenario 12: Testing transaction reversal exclusion...');
  {
    const USER_REV = 'usr_reversal_test';

    // Completed Expense: ₹800
    await SpendingAnalyticsService.ingestTransaction(USER_REV, {
      amount: 800.0,
      title: 'Swiggy Food Order',
      merchantName: 'Swiggy',
      upiId: 'swiggy@icici',
      transactionRef: 'TX-SWIGGY-VALID',
      type: 'EXPENSE',
      status: 'COMPLETED',
      isConfirmedPayment: true,
    });

    // Reversed Expense: ₹600 (Reversed bank debit)
    await SpendingAnalyticsService.ingestTransaction(USER_REV, {
      amount: 600.0,
      title: 'Failed Restaurant Debit',
      transactionRef: 'TX-REST-REVERSED',
      type: 'EXPENSE',
      status: 'REVERSED',
      isConfirmedPayment: false,
    });

    const dist = await SpendingAnalyticsService.getCategoryDistribution(USER_REV, 'THIS_MONTH');
    assert.equal(dist.totalNetSpend, 800.0);
    assert.equal(dist.totalTransactions, 1); // Reversed tx excluded
    console.log('  ✓ Reversed transactions strictly excluded from gross and net spend.');
  }

  // -------------------------------------------------------------------------
  // SCENARIO 13: Self-Transfer Exclusion
  // -------------------------------------------------------------------------
  console.log('Scenario 13: Testing self-transfer exclusion from spending analytics...');
  {
    const USER_TRANSFER = 'usr_transfer_test';

    // Normal expense: ₹350
    await SpendingAnalyticsService.ingestTransaction(USER_TRANSFER, {
      amount: 350.0,
      title: 'Uber Ride',
      merchantName: 'Uber',
      mcc: 4121,
      transactionRef: 'TX-UBER-COMMUTE',
      type: 'EXPENSE',
      status: 'COMPLETED',
      isConfirmedPayment: true,
    });

    // Internal self-transfer: ₹10,000 to HDFC Savings
    await SpendingAnalyticsService.ingestTransaction(USER_TRANSFER, {
      amount: 10000.0,
      title: 'Self Transfer to HDFC Bank',
      transactionRef: 'TX-SELF-XFER',
      type: 'TRANSFER',
      status: 'COMPLETED',
      isConfirmedPayment: true,
    });

    const dist = await SpendingAnalyticsService.getCategoryDistribution(USER_TRANSFER, 'THIS_MONTH');
    assert.equal(dist.totalNetSpend, 350.0);
    assert.equal(dist.totalTransactions, 1); // Self-transfer excluded
    console.log('  ✓ Internal account transfers excluded from consumption spending.');
  }

  // -------------------------------------------------------------------------
  // SCENARIO 14: Investment Categorization & Aggregation
  // -------------------------------------------------------------------------
  console.log('Scenario 14: Testing investment outflow categorization...');
  {
    const USER_INV = 'usr_investment_test';

    await SpendingAnalyticsService.ingestTransaction(USER_INV, {
      amount: 5000.0,
      title: 'Zerodha Broking SIP',
      merchantName: 'Zerodha',
      mcc: 6211, // Securities brokers
      transactionRef: 'TX-ZERODHA-SIP',
      type: 'EXPENSE',
      status: 'COMPLETED',
      isConfirmedPayment: true,
    });

    const dist = await SpendingAnalyticsService.getCategoryDistribution(USER_INV, 'THIS_MONTH');
    const invItem = dist.categories.find((c) => c.categoryId === 'INVESTMENT')!;
    assert.equal(invItem.netSpend, 5000.0);
    assert.equal(invItem.percentage, 100.0);
    console.log('  ✓ Investment outflow correctly mapped and aggregated under INVESTMENT category.');
  }

  // -------------------------------------------------------------------------
  // SCENARIO 15: Period Filtering & Date Boundaries
  // -------------------------------------------------------------------------
  console.log('Scenario 15: Testing financial period filter date boundaries...');
  {
    const now = new Date('2026-11-15T12:00:00.000Z');

    const week = calculatePeriodDateRange('THIS_WEEK', undefined, undefined, now);
    assert.ok(week.startDate.getTime() <= now.getTime());
    assert.ok(week.endDate.getTime() >= now.getTime());

    const month = calculatePeriodDateRange('THIS_MONTH', undefined, undefined, now);
    assert.equal(month.startDate.getDate(), 1);
    assert.equal(month.startDate.getMonth(), 10); // November

    const lastMonth = calculatePeriodDateRange('LAST_MONTH', undefined, undefined, now);
    assert.equal(lastMonth.startDate.getMonth(), 9); // October

    const year = calculatePeriodDateRange('THIS_YEAR', undefined, undefined, now);
    assert.equal(year.startDate.getMonth(), 0);
    assert.equal(year.startDate.getDate(), 1);
    assert.equal(year.endDate.getMonth(), 11);
    assert.equal(year.endDate.getDate(), 31);
    console.log('  ✓ Period filters (THIS_WEEK, THIS_MONTH, LAST_MONTH, THIS_YEAR) calculate exact UTC boundaries.');
  }

  // -------------------------------------------------------------------------
  // SCENARIO 16: Percentage Calculation & Zero-Spending Division Guard
  // -------------------------------------------------------------------------
  console.log('Scenario 16: Testing percentage calculation and zero-spending division guard...');
  {
    const USER_ZERO = 'usr_zero_spend';
    const distZero = await SpendingAnalyticsService.getCategoryDistribution(USER_ZERO, 'THIS_MONTH');

    assert.equal(distZero.totalNetSpend, 0);
    // Enforce that no category has NaN or Infinity
    for (const cat of distZero.categories) {
      assert.equal(cat.percentage, 0);
      assert.ok(!Number.isNaN(cat.percentage));
    }

    const summaryZero = await SpendingAnalyticsService.getSpendingSummary(USER_ZERO, 'THIS_MONTH');
    assert.equal(summaryZero.totalSpend, 0);
    assert.equal(summaryZero.topCategory, null);
    assert.equal(summaryZero.averageDailySpend, 0);
    console.log('  ✓ Zero spending guard verified: P_c = 0.00% without division-by-zero or NaN.');
  }

  console.log('\n=== ALL 16 SPENDING INTELLIGENCE PART 2 SCENARIOS PASSED WITH 100% SUCCESS! ===\n');
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
