import assert from 'node:assert';
import { DemoDataGenerator, PERSONA_CONFIGS } from './demo-data.generator.js';
import {
  calculateReducingBalanceEmi,
  generateAmortizationSchedule,
  verifyBalanceReconciliation,
} from './utils/financial.utils.js';
import { UserPersona } from './demo-data.types.js';

console.log('=== RUNNING DEMO DATA ENGINE TESTS ===\n');

// 1. Financial Math Utilities
console.log('Test 1: calculateReducingBalanceEmi precision...');
const emi = calculateReducingBalanceEmi(500000, 10.5, 36);
// Standard expected EMI for 500k at 10.5% over 36 months is ~16,252
assert(emi > 16000 && emi < 16500, `EMI out of expected range: ${emi}`);
console.log(`  ✓ EMI calculated accurately: ₹${emi} for ₹5,00,000 at 10.5% / 36mo`);

console.log('Test 2: generateAmortizationSchedule amortization reduction...');
const startDate = new Date('2024-01-01');
const { monthlyEmi, schedule, outstandingBalance, nextPaymentDate } = generateAmortizationSchedule(
  300000,
  11.0,
  24,
  startDate,
  new Date('2024-06-01')
);
assert.strictEqual(schedule.length, 24, 'Schedule must contain exactly 24 months');
// Final month balance must be 0
assert.strictEqual(schedule[schedule.length - 1].remainingBalance, 0, 'Final month remaining balance must be 0');
assert(outstandingBalance < 300000, 'Outstanding balance after 5 months must be less than principal');
console.log(`  ✓ Schedule generated: 24 months, outstanding balance: ₹${outstandingBalance}`);

console.log('Test 3: verifyBalanceReconciliation invariant...');
assert.strictEqual(verifyBalanceReconciliation(10000, 5000, 3000, 12000), true);
assert.strictEqual(verifyBalanceReconciliation(10000, 5000, 3000, 12500), false);
console.log('  ✓ Invariant correctly asserts: Closing = Opening + Credits - Debits');

// 2. Persona Generation Verification across all 4 personas
const personas: UserPersona[] = ['STUDENT', 'WORKING_PROFESSIONAL', 'FREELANCER', 'BUSINESS_OWNER'];

for (const persona of personas) {
  console.log(`\nTest Persona: ${persona}...`);
  const dataset = DemoDataGenerator.generateDataSet('usr_test_verification', persona);

  // Assert persona
  assert.strictEqual(dataset.persona, persona);

  // Assert transactions count
  assert(
    dataset.transactions.length >= 40 && dataset.transactions.length <= 80,
    `Transaction count ${dataset.transactions.length} should be between 40 and 80`
  );

  // Assert balance reconciliation
  const isReconciled = verifyBalanceReconciliation(
    dataset.initialBalance,
    dataset.totalIncome,
    dataset.totalExpenses,
    dataset.closingBalance
  );
  assert(
    isReconciled,
    `Balance failed to reconcile for ${persona}: Opening ₹${dataset.initialBalance} + Income ₹${dataset.totalIncome} - Expenses ₹${dataset.totalExpenses} != Closing ₹${dataset.closingBalance}`
  );
  console.log(`  ✓ Balance Reconciled: ₹${dataset.initialBalance} + ₹${dataset.totalIncome} - ₹${dataset.totalExpenses} = ₹${dataset.closingBalance}`);

  // Assert goals
  assert(dataset.goals.length >= 2 && dataset.goals.length <= 4, 'Goals should be 2-4');
  for (const g of dataset.goals) {
    assert(g.targetAmount > 0, 'Goal target must be positive');
    assert(g.currentAmount <= g.targetAmount, 'Current saved cannot exceed target');
    assert.strictEqual(g.isDemo, true, 'Goal must be tagged as demo');
  }
  console.log(`  ✓ Generated ${dataset.goals.length} valid goals`);

  // Assert communities
  assert(dataset.communities.length >= 2 && dataset.communities.length <= 3, 'Communities should be 2-3');
  for (const c of dataset.communities) {
    assert(c.membersSnapshot.length >= 2, 'Community must have fictional member snapshots');
    assert.strictEqual(c.isDemo, true, 'Community must be tagged as demo');
  }
  console.log(`  ✓ Generated ${dataset.communities.length} communities with member snapshots`);

  // Assert loans if any
  for (const l of dataset.loans) {
    assert(l.repayments.length > 0, 'Loan must have repayment schedule');
    assert.strictEqual(l.isDemo, true, 'Loan must be tagged as demo');
  }
  console.log(`  ✓ Generated ${dataset.loans.length} loans`);
}

console.log('\n=== ALL 17 TEST SUITE ASSERTIONS PASSED SUCCESSFULLY ===');

