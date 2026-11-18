import {
  CommunityRecommendation,
  ContentRecommendation,
  FinancialInsight,
  GoalItem,
  GoalRecommendation,
  OccupationType,
  UserFeatureVector,
} from './financial-identity.types.js';

// ---------------------------------------------------------------------------
// 1. Goal Priority & Allocation Engine (Phase 5)
// ---------------------------------------------------------------------------

export interface GoalAlgorithmInput {
  goals: GoalItem[];
  monthlyIncome: number;
  monthlyEssentialExpenses: number;
  monthlyDebtObligations: number;
  profileCategory: string;
}

/**
 * Calculates Available Monthly Savings Capacity:
 * AvailableMonthlySavings = MAX(0, M - X - D)
 */
export function calculateAvailableMonthlySavings(
  monthlyIncome: number,
  essentialExpenses: number,
  debtObligations: number
): number {
  return Math.max(0, Math.round((monthlyIncome - essentialExpenses - debtObligations) * 100) / 100);
}

/**
 * Calculates Goal Priority Score (0 - 100):
 * GoalPriority = (0.35 * UserImportance) + (0.30 * FinancialFeasibility) + (0.20 * TimeSensitivity) + (0.15 * ProfileRelevance)
 */
export function calculateGoalPriorityScore(
  userImportance: number,
  financialFeasibility: number,
  timeSensitivity: number,
  profileRelevance: number
): number {
  const score =
    0.35 * userImportance +
    0.30 * financialFeasibility +
    0.20 * timeSensitivity +
    0.15 * profileRelevance;
  return Math.max(0, Math.min(100, Math.round(score * 100) / 100));
}

/**
 * Evaluates goals, determines feasibility, and computes monthly savings allocations
 */
export function processGoalRecommendations(input: GoalAlgorithmInput): {
  availableSavings: number;
  evaluatedGoals: GoalRecommendation[];
  totalAllocated: number;
} {
  const availableSavings = calculateAvailableMonthlySavings(
    input.monthlyIncome,
    input.monthlyEssentialExpenses,
    input.monthlyDebtObligations
  );

  const evaluatedGoals: GoalRecommendation[] = [];

  for (const goal of input.goals) {
    const target = goal.targetAmount || 50000;
    const current = goal.currentSavings || 0;
    const remainingAmount = Math.max(0, target - current);

    // Calculate remaining months based on targetDate (default 12 months)
    let monthsRemaining = 12;
    if (goal.targetDate) {
      const diffMs = new Date(goal.targetDate).getTime() - Date.now();
      monthsRemaining = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24 * 30)));
    }

    const requiredMonthlySaving = Math.round((remainingAmount / monthsRemaining) * 100) / 100;
    const isFeasible = availableSavings > 0 && requiredMonthlySaving <= availableSavings;

    // Component Scores (0 - 100)
    const userImportance = goal.priority === 'HIGH' ? 95 : goal.priority === 'MEDIUM' ? 70 : 40;
    const feasibilityScore = availableSavings > 0
      ? Math.max(0, Math.min(100, Math.round((availableSavings / Math.max(1, requiredMonthlySaving)) * 80)))
      : 20;
    const timeSensitivity = monthsRemaining <= 3 ? 95 : monthsRemaining <= 6 ? 75 : monthsRemaining <= 12 ? 55 : 35;
    const profileRelevance = 80;

    const goalPriorityScore = calculateGoalPriorityScore(
      userImportance,
      feasibilityScore,
      timeSensitivity,
      profileRelevance
    );

    evaluatedGoals.push({
      id: goal.id || `rec_goal_${Math.random().toString(36).substring(2, 7)}`,
      name: goal.name,
      description: `Targeting ₹${target.toLocaleString('en-IN')} over ${monthsRemaining} months`,
      targetAmount: target,
      currentSavings: current,
      remainingMonths: monthsRemaining,
      userImportance,
      financialFeasibility: feasibilityScore,
      timeSensitivity,
      profileRelevance,
      goalPriorityScore,
      requiredMonthlySaving,
      isFeasible,
      suggestedMonthlyAllocation: 0, // Computed below
    });
  }

  // Allocate available savings proportionally based on goal priority scores
  const totalPriority = evaluatedGoals.reduce((sum, g) => sum + g.goalPriorityScore, 0);

  let totalAllocated = 0;
  if (totalPriority > 0 && availableSavings > 0) {
    for (const g of evaluatedGoals) {
      const allocation = Math.round((availableSavings * (g.goalPriorityScore / totalPriority)) * 100) / 100;
      g.suggestedMonthlyAllocation = allocation;
      totalAllocated += allocation;
    }
  }

  return {
    availableSavings,
    evaluatedGoals,
    totalAllocated: Math.round(totalAllocated * 100) / 100,
  };
}

// ---------------------------------------------------------------------------
// 2. Community Recommendation Engine (Phase 6)
// ---------------------------------------------------------------------------

export interface CommunityCatalogItem {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  applicableOccupationTags: string[];
  goalTags: string[];
  interestTags: string[];
}

export const COMMUNITY_CATALOG: CommunityCatalogItem[] = [
  {
    id: 'comm_student_circle',
    name: 'Student Savings & Campus Micro-Pool',
    description: 'Shared savings circles for students building semester reserves and tech funds.',
    category: 'STUDENT_SAVINGS',
    memberCount: 240,
    applicableOccupationTags: ['STUDENT', 'OTHER'],
    goalTags: ['laptop', 'device', 'education', 'study', 'semester', 'travel'],
    interestTags: ['saving strategies', 'financial literacy', 'community savings', 'budget planning'],
  },
  {
    id: 'comm_tech_wealth',
    name: 'Young Professionals Wealth Circle',
    description: 'Disciplined savings, emergency reserve buffers, and tax optimization for salaried professionals.',
    category: 'WEALTH_BUILDING',
    memberCount: 580,
    applicableOccupationTags: ['WORKING_PROFESSIONAL', 'HOMEMAKER', 'RETIRED'],
    goalTags: ['emergency fund', 'vehicle', 'house', 'vacation', 'financial independence'],
    interestTags: ['investment education', 'tax planning', 'budget planning', 'saving strategies'],
  },
  {
    id: 'comm_freelancer_finance',
    name: 'Freelancer Cash Flow & Invoicing Hub',
    description: 'Managing variable monthly income, quarterly tax reserves, and professional equipment funds.',
    category: 'FREELANCER_NETWORK',
    memberCount: 310,
    applicableOccupationTags: ['FREELANCER', 'ENTREPRENEUR'],
    goalTags: ['workstation', 'equipment', 'software', 'tax', 'emergency reserve'],
    interestTags: ['irregular income planning', 'business finance', 'tax planning', 'debt management'],
  },
  {
    id: 'comm_business_expansion',
    name: 'SME & Founders Working Capital Pool',
    description: 'Peer support, commercial equipment acquisition, and liquidity buffers for entrepreneurs.',
    category: 'BUSINESS_FINANCE',
    memberCount: 195,
    applicableOccupationTags: ['BUSINESS_OWNER', 'ENTREPRENEUR'],
    goalTags: ['business expansion', 'equipment', 'working capital', 'growth'],
    interestTags: ['business finance', 'community savings', 'financial independence'],
  },
];

/**
 * Calculates Community Relevance Score (0 - 100):
 * CommunityScore = (0.35 * OccupationRelevance) + (0.30 * GoalRelevance) + (0.20 * InterestRelevance) + (0.15 * ActivityRelevance)
 */
export function calculateCommunityRelevance(
  user: UserFeatureVector,
  community: CommunityCatalogItem,
  observedInteractions = 0
): CommunityRecommendation {
  // 1. Occupation Relevance: 100 * MatchingOccupationTags / ApplicableOccupationTags
  const occMatches = community.applicableOccupationTags.includes(user.occupation.category) ? 1 : 0;
  const occupationScore = Math.round(
    (occMatches / Math.max(1, community.applicableOccupationTags.length)) * 100
  );

  // 2. Goal Relevance: 100 * MatchingGoalTags / TotalUserGoalTags
  const userGoalWords = user.goals.map((g) => g.name.toLowerCase()).join(' ');
  let goalMatches = 0;
  for (const tag of community.goalTags) {
    if (userGoalWords.includes(tag)) goalMatches++;
  }
  const goalScore = user.goals.length > 0
    ? Math.min(100, Math.round((goalMatches / Math.max(1, community.goalTags.length)) * 100))
    : 50;

  // 3. Interest Relevance: 100 * MatchingInterestTags / TotalUserInterestTags
  const userInterestWords = user.interests.map((i) => i.toLowerCase()).join(' ');
  let interestMatches = 0;
  for (const tag of community.interestTags) {
    if (userInterestWords.includes(tag)) interestMatches++;
  }
  const interestScore = user.interests.length > 0
    ? Math.min(100, Math.round((interestMatches / Math.max(1, community.interestTags.length)) * 100))
    : 50;

  // 4. Activity Relevance: 100 * MIN(1, RelevantInteractions / InteractionThreshold)
  const activityScore = Math.min(100, Math.round((observedInteractions / 5) * 100));

  // Compute weighted score
  const hasActivity = observedInteractions > 0;
  let finalScore = 0;

  if (hasActivity) {
    finalScore =
      0.35 * occupationScore +
      0.30 * goalScore +
      0.20 * interestScore +
      0.15 * activityScore;
  } else {
    // Redistribute activity weight (0.15) proportionally across the 3 available features
    const sumWeights = 0.35 + 0.30 + 0.20; // 0.85
    finalScore =
      (0.35 / sumWeights) * occupationScore +
      (0.30 / sumWeights) * goalScore +
      (0.20 / sumWeights) * interestScore;
  }

  const roundedScore = Math.round(finalScore * 100) / 100;

  let relevanceTier: 'HIGHLY_RELEVANT' | 'RELEVANT' | 'MODERATELY_RELEVANT' | 'NOT_RECOMMENDED' =
    'NOT_RECOMMENDED';
  if (roundedScore >= 75) relevanceTier = 'HIGHLY_RELEVANT';
  else if (roundedScore >= 60) relevanceTier = 'RELEVANT';
  else if (roundedScore >= 40) relevanceTier = 'MODERATELY_RELEVANT';

  return {
    id: community.id,
    name: community.name,
    description: community.description,
    category: community.category,
    memberCount: community.memberCount,
    relevanceScore: roundedScore,
    relevanceTier,
    tags: {
      occupationTags: community.applicableOccupationTags,
      goalTags: community.goalTags,
      interestTags: community.interestTags,
    },
    breakdown: {
      occupationScore,
      goalScore,
      interestScore,
      activityScore,
    },
    isSimulatedDemo: true,
  };
}

// ---------------------------------------------------------------------------
// 3. Financial Insights & Confidence Scoring Engine (Phase 7)
// ---------------------------------------------------------------------------

/**
 * Calculates Spending Change Percentage:
 * If P > 0: ((C - P) / P) * 100
 * If P = 0 and C = 0: 0
 * If P = 0 and C > 0: 100 (New spending period)
 */
export function calculateSpendingChange(
  currentPeriodSpending: number,
  previousPeriodSpending: number
): { percentageChange: number; isNewSpending: boolean } {
  if (previousPeriodSpending > 0) {
    const change = ((currentPeriodSpending - previousPeriodSpending) / previousPeriodSpending) * 100;
    return { percentageChange: Math.round(change * 100) / 100, isNewSpending: false };
  }
  if (currentPeriodSpending === 0) {
    return { percentageChange: 0, isNewSpending: false };
  }
  return { percentageChange: 100, isNewSpending: true };
}

/**
 * Calculates Budget Utilization Percentage:
 * (CategorySpending / CategoryBudget) * 100
 */
export function calculateBudgetUtilization(spending: number, budget: number): number | null {
  if (budget <= 0) return null;
  return Math.round((spending / budget) * 10000) / 100;
}

/**
 * Calculates Savings Rate:
 * (Savings / Income) * 100
 */
export function calculateSavingsRate(savings: number, income: number): number | null {
  if (income <= 0) return null;
  return Math.round((savings / income) * 10000) / 100;
}

/**
 * Calculates Insight Confidence Score (0 - 100):
 * InsightConfidence = (0.50 * DataCompleteness) + (0.30 * DataRecency) + (0.20 * CalculationConsistency)
 */
export function calculateInsightConfidence(
  dataCompleteness: number,
  dataRecency: number,
  calculationConsistency: number
): number {
  const score =
    0.50 * dataCompleteness +
    0.30 * dataRecency +
    0.20 * calculationConsistency;
  return Math.max(0, Math.min(100, Math.round(score * 100) / 100));
}

// ---------------------------------------------------------------------------
// 4. Content Recommendations Engine (Phase 8)
// ---------------------------------------------------------------------------

export const EDUCATIONAL_CONTENT_CATALOG = [
  {
    id: 'content_student_budget',
    title: 'The 50/30/20 Rule for College Students & Scholars',
    category: 'Budgeting & Saving',
    readTimeMinutes: 4,
    tags: ['STUDENT', 'saving strategies', 'budget planning', 'education'],
  },
  {
    id: 'content_emergency_fund',
    title: 'Designing a 6-Month Liquid Emergency Buffer in High-Yield Accounts',
    category: 'Wealth Foundations',
    readTimeMinutes: 6,
    tags: ['WORKING_PROFESSIONAL', 'emergency fund', 'saving strategies', 'tax planning'],
  },
  {
    id: 'content_freelance_tax',
    title: 'Advance Tax Calculation & Invoicing Best Practices for Indian Freelancers',
    category: 'Tax & Compliance',
    readTimeMinutes: 7,
    tags: ['FREELANCER', 'tax planning', 'business finance', 'irregular income'],
  },
  {
    id: 'content_sme_cashflow',
    title: 'Managing Working Capital Cycles & Vendor Credit Terms',
    category: 'Business Growth',
    readTimeMinutes: 8,
    tags: ['BUSINESS_OWNER', 'ENTREPRENEUR', 'business finance', 'capital'],
  },
];

export function recommendEducationalContent(
  user: UserFeatureVector
): ContentRecommendation[] {
  const recommendations: ContentRecommendation[] = [];

  for (const item of EDUCATIONAL_CONTENT_CATALOG) {
    let score = 50;
    if (item.tags.includes(user.occupation.category)) score += 30;

    const userInterests = user.interests.join(' ').toLowerCase();
    for (const tag of item.tags) {
      if (userInterests.includes(tag.toLowerCase())) score += 15;
    }

    const finalScore = Math.min(100, score);
    recommendations.push({
      id: item.id,
      title: item.title,
      category: item.category,
      readTimeMinutes: item.readTimeMinutes,
      relevanceScore: finalScore,
      tags: item.tags,
      reason: `Matches your professional profile (${user.occupation.category}) and selected financial topics.`,
    });
  }

  return recommendations.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

