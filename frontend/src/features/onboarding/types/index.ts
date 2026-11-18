export type OccupationType =
  | 'STUDENT'
  | 'WORKING_PROFESSIONAL'
  | 'FREELANCER'
  | 'BUSINESS_OWNER'
  | 'ENTREPRENEUR'
  | 'HOMEMAKER'
  | 'RETIRED'
  | 'OTHER';

export interface GoalItem {
  id?: string;
  name: string;
  targetAmount?: number;
  currentSavings?: number;
  targetDate?: string;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  category?: string;
}

export interface FinancialProfile {
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

export interface GoalRecommendation {
  id: string;
  name: string;
  description: string;
  targetAmount: number;
  currentSavings: number;
  remainingMonths: number;
  userImportance: number;
  financialFeasibility: number;
  timeSensitivity: number;
  profileRelevance: number;
  goalPriorityScore: number;
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
  relevanceScore: number;
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
  type: string;
  title: string;
  summary: string;
  metricLabel: string;
  metricValue: string;
  direction: 'UP' | 'DOWN' | 'NEUTRAL';
  confidenceScore: number;
  confidenceTier: 'RELIABLE' | 'ESTIMATE' | 'SUPPRESSED';
  isDemo: boolean;
  explanation: string;
}

export interface ContentRecommendation {
  id: string;
  title: string;
  category: string;
  readTimeMinutes: number;
  relevanceScore: number;
  tags: string[];
  reason: string;
}

export interface OnboardingCompletionResponse {
  profile: FinancialProfile;
  classification: {
    declaredOccupation: OccupationType;
    suggestedPersona: string;
    overallScore: number;
    confidenceThreshold: number;
    isHighConfidence: boolean;
    featureScores: Record<string, number>;
  };
  goals: GoalRecommendation[];
  communities: CommunityRecommendation[];
  insights: FinancialInsight[];
  content: ContentRecommendation[];
  demoDataStatus: string;
}

