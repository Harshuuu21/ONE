import assert from 'node:assert/strict';
import {
  DEFAULT_FEATURE_WEIGHTS,
  FeatureWeights,
  UserFeatureVector,
} from './financial-identity.types.js';
import {
  validateWeightsSum,
  calculateAdjustedWeights,
  normalize0to100,
  calculateOccupationScore,
  calculateIncomeScore,
  calculateGoalScore,
  calculateInterestScore,
  calculateBehaviourScore,
  classifyFinancialIdentity,
} from './financial-identity.scoring.js';
import {
  calculateAvailableMonthlySavings,
  calculateGoalPriorityScore,
  processGoalRecommendations,
  COMMUNITY_CATALOG,
  calculateCommunityRelevance,
  calculateSpendingChange,
  calculateBudgetUtilization,
  calculateSavingsRate,
  calculateInsightConfidence,
  recommendEducationalContent,
} from './financial-identity.engine.js';

console.log('--- Starting Financial Identity Engine Unit Tests ---');

// 1. Weight Validation Tests
{
  console.log('1. Testing Feature Weight Sum Validation (1.0 +/- epsilon)...');
  assert.equal(validateWeightsSum(DEFAULT_FEATURE_WEIGHTS), true);

  const invalidWeights: FeatureWeights = {
    occupation: 0.3,
    income: 0.2,
    goals: 0.2,
    interests: 0.1,
    behaviour: 0.1, // sums to 0.9
  };
  assert.equal(validateWeightsSum(invalidWeights), false);
  console.log('  ✓ Weights sum correctly validated within tolerance.');
}

// 2. Missing Data Weight Redistribution Tests
{
  console.log('2. Testing Proportional Weight Redistribution when Behaviour is Missing...');
  const availableKeys: Array<keyof FeatureWeights> = ['occupation', 'income', 'goals', 'interests'];
  const adjusted = calculateAdjustedWeights(availableKeys, DEFAULT_FEATURE_WEIGHTS);

  const sumAdjusted =
    adjusted.occupation + adjusted.income + adjusted.goals + adjusted.interests + adjusted.behaviour;
  assert.ok(Math.abs(sumAdjusted - 1.0) < 0.0001, `Sum should be 1.0, got ${sumAdjusted}`);
  assert.equal(adjusted.behaviour, 0);

  // Original sum without behaviour = 0.90.
  // Occupation: 0.30 / 0.90 = 0.3333...
  assert.ok(Math.abs(adjusted.occupation - 0.30 / 0.90) < 0.001);
  console.log('  ✓ Proportional weight redistribution is mathematically exact.');
}

// 3. Normalization Formula Tests (0 - 100)
{
  console.log('3. Testing 0-100 Clamped Normalization...');
  assert.equal(normalize0to100(50, 0, 100), 50);
  assert.equal(normalize0to100(-20, 0, 100), 0); // clamped lower bound
  assert.equal(normalize0to100(150, 0, 100), 100); // clamped upper bound
  assert.equal(normalize0to100(50000, 20000, 80000), 50);
  console.log('  ✓ Normalization clamps values and produces correct 0-100 outputs.');
}

// 4. Savings Capacity & Goal Priority Formulas
{
  console.log('4. Testing Savings Capacity & Goal Priority Formulas...');
  // AvailableMonthlySavings = MAX(0, M - X - D)
  const savings1 = calculateAvailableMonthlySavings(100000, 45000, 10000);
  assert.equal(savings1, 45000);

  const savingsDeficit = calculateAvailableMonthlySavings(30000, 25000, 10000);
  assert.equal(savingsDeficit, 0); // Non-negative constraint

  // Goal Priority = (0.35 * UserImportance) + (0.30 * FinancialFeasibility) + (0.20 * TimeSensitivity) + (0.15 * ProfileRelevance)
  const priority = calculateGoalPriorityScore(90, 80, 70, 85);
  // Expected: 0.35*90 + 0.30*80 + 0.20*70 + 0.15*85 = 31.5 + 24 + 14 + 12.75 = 82.25
  assert.equal(priority, 82.25);

  const goalResults = processGoalRecommendations({
    goals: [
      { id: 'g1', name: 'MacBook Pro', targetAmount: 120000, currentSavings: 20000, priority: 'HIGH' },
      { id: 'g2', name: 'Goa Trip', targetAmount: 30000, currentSavings: 5000, priority: 'MEDIUM' },
    ],
    monthlyIncome: 80000,
    monthlyEssentialExpenses: 35000,
    monthlyDebtObligations: 5000,
    profileCategory: 'WORKING_PROFESSIONAL',
  });

  assert.equal(goalResults.availableSavings, 40000);
  assert.equal(goalResults.evaluatedGoals.length, 2);
  assert.ok(goalResults.totalAllocated <= goalResults.availableSavings);
  assert.ok(goalResults.evaluatedGoals[0].suggestedMonthlyAllocation > goalResults.evaluatedGoals[1].suggestedMonthlyAllocation);
  console.log('  ✓ Savings capacity and proportional goal allocation verified.');
}

// 5. Community Recommendation Relevance & Tier Ranking
{
  console.log('5. Testing Community Relevance & Tier Classification...');
  const studentVector: UserFeatureVector = {
    occupation: { category: 'STUDENT', details: 'B.Tech CS' },
    income: { estimatedMonthly: 15000, hasIncome: true, frequency: 'MONTHLY', stability: 'VARIABLE' },
    goals: [{ id: 'g1', name: 'Laptop Fund', targetAmount: 60000, currentSavings: 15000 }],
    interests: ['saving strategies', 'financial literacy', 'budget planning'],
  };

  const studentComm = COMMUNITY_CATALOG.find((c) => c.id === 'comm_student_circle')!;
  const rec = calculateCommunityRelevance(studentVector, studentComm, 0);

  assert.ok(rec.relevanceScore >= 60, `Student score should be >= 60, got ${rec.relevanceScore}`);
  assert.ok(
    rec.relevanceTier === 'HIGHLY_RELEVANT' || rec.relevanceTier === 'RELEVANT',
    `Expected HIGHLY_RELEVANT or RELEVANT, got ${rec.relevanceTier}`
  );
  console.log('  ✓ Community relevance scores and classification tiers verified.');
}

// 6. Financial Insights Calculations & Confidence Scoring
{
  console.log('6. Testing Financial Insights Metrics & Confidence Scoring...');
  // Spending change %
  const spendNormal = calculateSpendingChange(8000, 10000);
  assert.equal(spendNormal.percentageChange, -20); // 20% drop

  const spendZeroPrev = calculateSpendingChange(5000, 0);
  assert.equal(spendZeroPrev.percentageChange, 100);
  assert.equal(spendZeroPrev.isNewSpending, true);

  // Budget Utilization
  const util = calculateBudgetUtilization(4200, 5000);
  assert.equal(util, 84);

  // Savings Rate
  const sRate = calculateSavingsRate(25000, 100000);
  assert.equal(sRate, 25);

  // Confidence Score: (0.50 * Completeness) + (0.30 * Recency) + (0.20 * Consistency)
  const confidence = calculateInsightConfidence(90, 80, 70);
  // 0.50*90 + 0.30*80 + 0.20*70 = 45 + 24 + 14 = 83
  assert.equal(confidence, 83);
  console.log('  ✓ Insights formulas, zero-denominators, and confidence scoring verified.');
}

// 7. Profile Classification Algorithm
{
  console.log('7. Testing Identity Classification across Personas...');
  const professionalVector: UserFeatureVector = {
    occupation: { category: 'WORKING_PROFESSIONAL', details: 'Senior SDE' },
    income: { estimatedMonthly: 120000, hasIncome: true, frequency: 'MONTHLY', stability: 'HIGH' },
    goals: [
      { id: 'g1', name: 'Emergency Fund', targetAmount: 300000, currentSavings: 100000, priority: 'HIGH' },
      { id: 'g2', name: 'Home Downpayment', targetAmount: 1500000, currentSavings: 300000, priority: 'HIGH' },
    ],
    interests: ['investment education', 'tax planning', 'wealth building'],
  };

  const res = classifyFinancialIdentity(professionalVector);
  assert.equal(res.declaredOccupation, 'WORKING_PROFESSIONAL');
  assert.equal(res.suggestedPersona, 'WORKING_PROFESSIONAL');
  assert.ok(res.overallScore >= res.confidenceThreshold);
  assert.equal(res.isHighConfidence, true);
  console.log('  ✓ Profile classification correctly identified WORKING_PROFESSIONAL.');
}

// 8. Educational Content Recommendations
{
  console.log('8. Testing Content Recommendations Engine...');
  const freelancerVector: UserFeatureVector = {
    occupation: { category: 'FREELANCER', details: 'UI Designer' },
    income: { estimatedMonthly: 80000, hasIncome: true, frequency: 'IRREGULAR', stability: 'VARIABLE' },
    goals: [{ id: 'g1', name: 'Studio Upgrade', targetAmount: 200000, currentSavings: 50000 }],
    interests: ['tax planning', 'irregular income planning', 'business finance'],
  };

  const contentRecs = recommendEducationalContent(freelancerVector);
  assert.ok(contentRecs.length > 0);
  assert.equal(contentRecs[0].id, 'content_freelance_tax');
  console.log('  ✓ Content engine prioritizes freelancer tax article for freelancer profile.');
}

console.log('\n--- ALL FINANCIAL IDENTITY ENGINE TESTS PASSED SUCCESSFULLY! ---');
