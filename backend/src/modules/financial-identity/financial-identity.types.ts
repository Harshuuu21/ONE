export type OccupationType =
  | 'STUDENT'
  | 'WORKING_PROFESSIONAL'
  | 'FREELANCER'
  | 'BUSINESS_OWNER'
  | 'ENTREPRENEUR'
  | 'HOMEMAKER'
  | 'RETIRED'
  | 'OTHER';

export type IncomeSource =
  | 'ALLOWANCE'
  | 'SCHOLARSHIP'
  | 'SALARY'
  | 'FREELANCE'
  | 'BUSINESS_REVENUE'
  | 'PENSION'
  | 'INVESTMENTS'
  | 'OTHER';

export type IncomeFrequency = 'MONTHLY' | 'IRREGULAR' | 'WEEKLY' | 'ONE_TIME';
export type IncomeStability = 'HIGH' | 'MODERATE' | 'VARIABLE';

export interface GoalItem {
  id: string;
  name: string;
  targetAmount?: number;
  currentSavings?: number;
  targetDate?: string;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  category?: string;
}

export interface UserFeatureVector {
  occupation: {
    category: OccupationType;
    details?: string;
  };
  income: {
    source?: string;
    range?: string;
    estimatedMonthly?: number;
    frequency?: IncomeFrequency;
    stability?: IncomeStability;
    hasIncome: boolean;
  };
  goals: GoalItem[];
  interests: string[];
  behaviour?: {
    observedMonthlySpend?: number;
    observedSavingsRate?: number;
    transactionCount?: number;
  };
}

export interface FeatureWeights {
  occupation: number; // 0.30
  income: number;     // 0.20
  goals: number;      // 0.25
  interests: number;  // 0.15
  behaviour: number;  // 0.10
}

export const DEFAULT_FEATURE_WEIGHTS: FeatureWeights = {
  occupation: 0.30,
  income: 0.20,
  goals: 0.25,
  interests: 0.15,
  behaviour: 0.10,
};

export interface ProfileClassificationResult {
  declaredOccupation: OccupationType;
  suggestedPersona: 'STUDENT' | 'WORKING_PROFESSIONAL' | 'FREELANCER' | 'BUSINESS_OWNER';
  overallScore: number;
  confidenceThreshold: number;
  isHighConfidence: boolean;
  featureScores: {
    occupationScore: number;
    incomeScore: number;
    goalScore: number;
    interestScore: number;
    behaviourScore?: number;
  };
  adjustedWeights: Record<string, number>;
  candidateRankings: Array<{
    category: string;
    score: number;
  }>;
}

export interface GoalRecommendation {
  id: string;
  name: string;
  description: string;
  targetAmount: number;
  currentSavings: number;
  remainingMonths: number;
  userImportance: number;      // 0 - 100
  financialFeasibility: number; // 0 - 100
  timeSensitivity: number;     // 0 - 100
  profileRelevance: number;     // 0 - 100
  goalPriorityScore: number;   // Calculated priority 0 - 100
  requiredMonthlySaving: number;
  isFeasible: boolean;
  suggestedMonthlyAllocation: number;
}

export interface CommunityRecommendation {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  relevanceScore: number; // 0 - 100
  relevanceTier: 'HIGHLY_RELEVANT' | 'RELEVANT' | 'MODERATELY_RELEVANT' | 'NOT_RECOMMENDED';
  tags: {
    occupationTags: string[];
    goalTags: string[];
    interestTags: string[];
  };
  breakdown: {
    occupationScore: number;
    goalScore: number;
    interestScore: number;
    activityScore: number;
  };
  isSimulatedDemo: boolean;
}

export interface FinancialInsight {
  id: string;
  type: 'SPENDING_TREND' | 'BUDGET_UTILIZATION' | 'SAVINGS_VELOCITY' | 'GOAL_MILESTONE' | 'CASH_BUFFER';
  title: string;
  summary: string;
  metricLabel: string;
  metricValue: string;
  direction: 'UP' | 'DOWN' | 'NEUTRAL';
  confidenceScore: number; // 0 - 100
  confidenceTier: 'RELIABLE' | 'ESTIMATE' | 'SUPPRESSED';
  isDemo: boolean;
  explanation: string;
}

export interface ContentRecommendation {
  id: string;
  title: string;
  category: string;
  readTimeMinutes: number;
  relevanceScore: number; // 0 - 100
  tags: string[];
  reason: string;
}

export interface FinancialProfileDTO {
  occupation: OccupationType;
  occupationDetails?: string;
  incomeSource?: string;
  monthlyIncomeRange?: string;
  monthlyIncomeMin?: number;
  monthlyIncomeMax?: number;
  incomeFrequency?: string;
  incomeStability?: string;
  financialResponsibilities?: string;
  financialGoals?: GoalItem[];
  interests?: string[];
  onboardingStep?: number;
  onboardingComplete?: boolean;
}

