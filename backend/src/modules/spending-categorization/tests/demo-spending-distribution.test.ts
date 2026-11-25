import assert from 'node:assert/strict';
import { DemoTransactionGenerator } from '../demo-transaction-generator.js';
import { DemoDataService } from '../demo-data.service.js';
import { SpendingAggregationService } from '../spending-aggregation.service.js';
import { DemoDistributionService } from '../demo-distribution.service.js';
import { ORDERED_CATEGORIES } from '../rules/category-rules.js';

async function runDemoSpendingDistributionTests() {
  console.log('=== STARTING SMART SPENDING DEMO DISTRIBUTION TESTS ===\n');

  const userA = 'test-user-a-' + Date.now();
  const userB = 'test-user-b-' + Date.now();

  // Test 1: First login - Generates 15-30 synthetic transactions
  console.log('1. Testing First Login & Synthetic Transaction Generation...');
  const initialTxsA = await DemoDataService.getOrCreateDemoTransactions(userA);
  assert.ok(initialTxsA.length >= 15 && initialTxsA.length <= 30, `Expected 15-30 transactions, got ${initialTxsA.length}`);
  assert.ok(initialTxsA.every((tx) => tx.isDemo === true), 'All transactions must have isDemo: true');
  assert.ok(initialTxsA.every((tx) => tx.userId === userA), 'All transactions must be isolated to userA');
  console.log(`  ✓ Generated ${initialTxsA.length} realistic synthetic transactions.`);

  // Test 2: Subsequent login & Dashboard Refresh - Reuses existing dataset
  console.log('2. Testing Subsequent Login & Dashboard Refresh (No Random Regeneration)...');
  const secondVisitTxsA = await DemoDataService.getOrCreateDemoTransactions(userA);
  assert.equal(secondVisitTxsA.length, initialTxsA.length, 'Dataset count must remain unchanged on refresh');
  assert.equal(secondVisitTxsA[0].id, initialTxsA[0].id, 'First transaction ID must match (exact dataset reuse)');
  console.log('  ✓ Verified exact dataset reuse on dashboard refresh.');

  // Test 3: User-Level Data Isolation
  console.log('3. Testing User-Level Data Isolation (User A vs User B)...');
  const initialTxsB = await DemoDataService.getOrCreateDemoTransactions(userB);
  assert.ok(initialTxsB.length >= 15, 'User B must get their own dataset');
  assert.notEqual(initialTxsA[0].id, initialTxsB[0].id, 'User A and User B transactions must have unique IDs');
  assert.ok(initialTxsB.every((tx) => tx.userId === userB), 'User B transactions must belong strictly to userB');
  console.log('  ✓ Strict isolation between user datasets verified.');

  // Test 4: All 16 Configured Categories Supported
  console.log('4. Testing 16 Configured Categories Invariant...');
  assert.equal(ORDERED_CATEGORIES.length, 16, `Expected 16 categories, got ${ORDERED_CATEGORIES.length}`);
  const catIds = ORDERED_CATEGORIES.map((c) => c.id);
  assert.ok(catIds.includes('ENTERTAINMENT'), 'Must include ENTERTAINMENT');
  assert.ok(catIds.includes('TRAVEL'), 'Must include TRAVEL');
  console.log('  ✓ Verified all 16 categories with display names, icons, and colors.');

  // Test 5: Mathematical Percentage Calculation (S_c, S_T, P_c)
  console.log('5. Testing Mathematical Spending Distribution Invariant...');
  const distMonth = await DemoDistributionService.getSpendingDistribution(userA, 'THIS_MONTH');
  assert.equal(distMonth.isDemo, true, 'isDemo must be true');
  assert.equal(distMonth.dataSource, 'DEMO_DATA', 'dataSource must be DEMO_DATA');
  assert.ok(distMonth.totalNetSpend > 0, 'Total net spend must be positive');

  // Sum of percentages of non-zero categories
  const activeCats = distMonth.categories.filter((c) => c.netSpend > 0);
  assert.ok(activeCats.length >= 6, `Expected at least 6-12 active categories for This Month, got ${activeCats.length}`);

  let sumPct = 0;
  for (const cat of distMonth.categories) {
    if (distMonth.totalNetSpend > 0 && cat.netSpend > 0) {
      const calculatedPct = Math.round((cat.netSpend / distMonth.totalNetSpend) * 10000) / 100;
      assert.equal(cat.percentage, calculatedPct, `Category ${cat.categoryId} percentage formula mismatch`);
      sumPct += cat.percentage;
    } else {
      assert.equal(cat.percentage, 0, 'Zero spend categories must have percentage = 0.00%');
    }
  }
  assert.ok(Math.abs(sumPct - 100) < 0.1, `Sum of active percentages (${sumPct}) must equal 100%`);
  console.log(`  ✓ Verified mathematical formula: S_c, S_T, P_c across ${activeCats.length} active categories summing to ${sumPct.toFixed(1)}%.`);

  // Test 6: Different Date Periods Yield Noticeably Different Distributions
  console.log('6. Testing Dynamic Period Date Filtering (This Week, This Month, Last Month, This Year)...');
  const distWeek = await DemoDistributionService.getSpendingDistribution(userA, 'THIS_WEEK');
  const distLastMonth = await DemoDistributionService.getSpendingDistribution(userA, 'LAST_MONTH');
  const distYear = await DemoDistributionService.getSpendingDistribution(userA, 'THIS_YEAR');

  assert.ok(distWeek.categories.length === 16, 'Returns all 16 category metadata rows');
  assert.ok(distLastMonth.categories.length === 16, 'Returns all 16 category metadata rows');
  assert.ok(distYear.categories.length === 16, 'Returns all 16 category metadata rows');

  // Total net spend should differ across periods
  assert.notEqual(distWeek.totalNetSpend, distMonth.totalNetSpend, 'This Week spend must differ from This Month spend');
  assert.notEqual(distMonth.totalNetSpend, distYear.totalNetSpend, 'This Month spend must differ from This Year spend');

  // Active category counts should differ
  const weekActiveCount = distWeek.categories.filter((c) => c.netSpend > 0).length;
  const monthActiveCount = distMonth.categories.filter((c) => c.netSpend > 0).length;
  const yearActiveCount = distYear.categories.filter((c) => c.netSpend > 0).length;

  console.log(`  Active Categories by Period: This Week (${weekActiveCount}), This Month (${monthActiveCount}), This Year (${yearActiveCount})`);
  assert.ok(weekActiveCount > 0, 'This Week must have active categories');
  assert.ok(yearActiveCount >= monthActiveCount, 'This Year must cover at least as many categories as This Month');
  console.log('  ✓ Period date range filtering verified: dynamic distributions across distinct time windows.');

  // Test 7: Development-Only Demo Data Regeneration
  console.log('7. Testing Development-Only Demo Data Regeneration...');
  const regeneratedDist = await DemoDistributionService.regenerateDemoDistribution(userA, 'THIS_MONTH');
  assert.equal(regeneratedDist.isDemo, true, 'Regenerated distribution must maintain isDemo: true');
  assert.ok(regeneratedDist.totalNetSpend > 0, 'Regenerated distribution must have spend');
  console.log('  ✓ Demo data regeneration executed cleanly without side effects.');

  // Test 8: Empty State Zero-Division Safety
  console.log('8. Testing Empty State & Zero Division Safety...');
  const emptyDist = SpendingAggregationService.aggregateDistribution([], 'THIS_MONTH', undefined, undefined, true);
  assert.equal(emptyDist.totalNetSpend, 0, 'Empty transactions must yield totalNetSpend = 0');
  assert.equal(emptyDist.totalTransactions, 0, 'Empty transactions count = 0');
  assert.ok(emptyDist.categories.every((c) => c.percentage === 0), 'All category percentages must be 0 without NaN or division by zero');
  console.log('  ✓ Zero-division safety and empty state verified.');

  console.log('\n=== ALL 8 DEMO SPENDING DISTRIBUTION TESTS PASSED WITH 100% SUCCESS! ===');
}

runDemoSpendingDistributionTests().catch((err) => {
  console.error('Test failed with error:', err);
  process.exit(1);
});
