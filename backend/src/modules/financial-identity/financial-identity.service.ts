import { prisma } from '../../config/database.js';
import { DemoDataService } from '../demo-data/demo-data.service.js';
import {
  FinancialProfileDTO,
  OccupationType,
  UserFeatureVector,
  GoalItem,
  ProfileClassificationResult,
  GoalRecommendation,
  CommunityRecommendation,
  FinancialInsight,
  ContentRecommendation,
} from './financial-identity.types.js';
import {
  UpdateFinancialProfileInput,
  CompleteOnboardingInput,
} from './financial-identity.validation.js';
import { classifyFinancialIdentity } from './financial-identity.scoring.js';
import {
  COMMUNITY_CATALOG,
  calculateCommunityRelevance,
  processGoalRecommendations,
  calculateInsightConfidence,
  recommendEducationalContent,
} from './financial-identity.engine.js';
import { NotFoundError } from '../../shared/errors/index.js';

// In-memory fallback repository when DB is offline or in development
const inMemoryProfiles = new Map<string, any>();

export class FinancialIdentityService {
  /**
   * Estimates numeric monthly income from range string or occupation defaults
   */
  private static parseEstimatedIncome(
    occupation: OccupationType,
    min?: number,
    max?: number,
    rangeStr?: string
  ): { estimated: number; min: number; max: number } {
    if (min !== undefined && max !== undefined && max > 0) {
      return { min, max, estimated: Math.round((min + max) / 2) };
    }
    if (min !== undefined && min > 0) {
      return { min, max: min * 1.5, estimated: min };
    }

    if (rangeStr) {
      const match = rangeStr.match(/(\d+)\s*-\s*(\d+)/);
      if (match) {
        const parsedMin = parseInt(match[1], 10);
        const parsedMax = parseInt(match[2], 10);
        return {
          min: parsedMin,
          max: parsedMax,
          estimated: Math.round((parsedMin + parsedMax) / 2),
        };
      }
    }

    // Default INR estimates per occupation
    switch (occupation) {
      case 'STUDENT':
        return { min: 10000, max: 35000, estimated: 25000 };
      case 'WORKING_PROFESSIONAL':
        return { min: 45000, max: 120000, estimated: 75000 };
      case 'FREELANCER':
        return { min: 30000, max: 100000, estimated: 60000 };
      case 'BUSINESS_OWNER':
      case 'ENTREPRENEUR':
        return { min: 80000, max: 250000, estimated: 140000 };
      case 'HOMEMAKER':
        return { min: 15000, max: 40000, estimated: 25000 };
      case 'RETIRED':
        return { min: 30000, max: 70000, estimated: 45000 };
      default:
        return { min: 30000, max: 60000, estimated: 45000 };
    }
  }

  /**
   * Retrieves user's financial profile
   */
  static async getProfile(userId: string): Promise<FinancialProfileDTO> {
    try {
      const profile = await prisma.financialProfile.findUnique({
        where: { userId },
      });

      if (profile) {
        return {
          occupation: profile.occupation,
          occupationDetails: profile.occupationDetails || undefined,
          incomeSource: profile.incomeSource || undefined,
          monthlyIncomeRange: profile.monthlyIncomeRange || undefined,
          monthlyIncomeMin: profile.monthlyIncomeMin ? Number(profile.monthlyIncomeMin) : undefined,
          monthlyIncomeMax: profile.monthlyIncomeMax ? Number(profile.monthlyIncomeMax) : undefined,
          incomeFrequency: profile.incomeFrequency || undefined,
          incomeStability: profile.incomeStability || undefined,
          financialResponsibilities: profile.financialResponsibilities || undefined,
          financialGoals: (profile.financialGoals as unknown as GoalItem[]) || [],
          interests: profile.interests || [],
          onboardingStep: profile.onboardingStep,
          onboardingComplete: profile.onboardingComplete,
        };
      }
    } catch (err: any) {
      console.warn('[FinancialIdentityService] DB getProfile warning (using memory):', err.message);
    }

    if (inMemoryProfiles.has(userId)) {
      return inMemoryProfiles.get(userId);
    }

    // Default uninitialized profile
    return {
      occupation: 'WORKING_PROFESSIONAL',
      onboardingStep: 1,
      onboardingComplete: false,
      interests: [],
      financialGoals: [],
    };
  }

  /**
   * Saves partial profile progress during onboarding steps (supports resume)
   */
  static async updateProfile(
    userId: string,
    data: UpdateFinancialProfileInput
  ): Promise<FinancialProfileDTO> {
    const existing = await this.getProfile(userId);

    const mergedGoals = data.financialGoals !== undefined ? data.financialGoals : existing.financialGoals;
    const mergedInterests = data.interests !== undefined ? data.interests : existing.interests;
    const updatedOccupation = data.occupation || existing.occupation || 'WORKING_PROFESSIONAL';
    const nextStep = data.onboardingStep || existing.onboardingStep || 1;

    try {
      const updated = await prisma.financialProfile.upsert({
        where: { userId },
        create: {
          userId,
          occupation: updatedOccupation,
          occupationDetails: data.occupationDetails ?? existing.occupationDetails,
          incomeSource: data.incomeSource ?? existing.incomeSource,
          monthlyIncomeRange: data.monthlyIncomeRange ?? existing.monthlyIncomeRange,
          monthlyIncomeMin: data.monthlyIncomeMin ?? existing.monthlyIncomeMin,
          monthlyIncomeMax: data.monthlyIncomeMax ?? existing.monthlyIncomeMax,
          incomeFrequency: data.incomeFrequency ?? existing.incomeFrequency,
          incomeStability: data.incomeStability ?? existing.incomeStability,
          financialResponsibilities: data.financialResponsibilities ?? existing.financialResponsibilities,
          financialGoals: (mergedGoals as any) || [],
          interests: mergedInterests || [],
          onboardingStep: nextStep,
          onboardingComplete: existing.onboardingComplete || false,
        },
        update: {
          occupation: updatedOccupation,
          occupationDetails: data.occupationDetails ?? existing.occupationDetails,
          incomeSource: data.incomeSource ?? existing.incomeSource,
          monthlyIncomeRange: data.monthlyIncomeRange ?? existing.monthlyIncomeRange,
          monthlyIncomeMin: data.monthlyIncomeMin ?? existing.monthlyIncomeMin,
          monthlyIncomeMax: data.monthlyIncomeMax ?? existing.monthlyIncomeMax,
          incomeFrequency: data.incomeFrequency ?? existing.incomeFrequency,
          incomeStability: data.incomeStability ?? existing.incomeStability,
          financialResponsibilities: data.financialResponsibilities ?? existing.financialResponsibilities,
          financialGoals: (mergedGoals as any) || [],
          interests: mergedInterests || [],
          onboardingStep: nextStep,
        },
      });

      const result: FinancialProfileDTO = {
        occupation: updated.occupation,
        occupationDetails: updated.occupationDetails || undefined,
        incomeSource: updated.incomeSource || undefined,
        monthlyIncomeRange: updated.monthlyIncomeRange || undefined,
        monthlyIncomeMin: updated.monthlyIncomeMin ? Number(updated.monthlyIncomeMin) : undefined,
        monthlyIncomeMax: updated.monthlyIncomeMax ? Number(updated.monthlyIncomeMax) : undefined,
        incomeFrequency: updated.incomeFrequency || undefined,
        incomeStability: updated.incomeStability || undefined,
        financialResponsibilities: updated.financialResponsibilities || undefined,
        financialGoals: (updated.financialGoals as unknown as GoalItem[]) || [],
        interests: updated.interests || [],
        onboardingStep: updated.onboardingStep,
        onboardingComplete: updated.onboardingComplete,
      };

      inMemoryProfiles.set(userId, result);
      return result;
    } catch (err: any) {
      console.warn('[FinancialIdentityService] DB updateProfile warning (memory save):', err.message);
      const fallback: FinancialProfileDTO = {
        ...existing,
        ...data,
        occupation: updatedOccupation,
        financialGoals: (mergedGoals as GoalItem[]) || [],
        interests: mergedInterests || [],
        onboardingStep: nextStep,
      };
      inMemoryProfiles.set(userId, fallback);
      return fallback;
    }
  }

  /**
   * Completes onboarding, computes algorithmic classification, triggers demo data, and returns recommendations
   */
  static async completeOnboarding(
    userId: string,
    data: CompleteOnboardingInput
  ): Promise<{
    profile: FinancialProfileDTO;
    classification: ProfileClassificationResult;
    goals: GoalRecommendation[];
    communities: CommunityRecommendation[];
    insights: FinancialInsight[];
    content: ContentRecommendation[];
    demoDataStatus: string;
  }> {
    // 1. Compute income estimate
    const incomeDetails = this.parseEstimatedIncome(
      data.occupation,
      data.monthlyIncomeMin,
      data.monthlyIncomeMax,
      data.monthlyIncomeRange
    );

    // 2. Build feature vector U = { O, I, G, P, B }
    const featureVector: UserFeatureVector = {
      occupation: {
        category: data.occupation,
        details: data.occupationDetails,
      },
      income: {
        source: data.incomeSource,
        range: data.monthlyIncomeRange,
        estimatedMonthly: incomeDetails.estimated,
        frequency: (data.incomeFrequency as any) || 'MONTHLY',
        stability: (data.incomeStability as any) || 'HIGH',
        hasIncome: incomeDetails.estimated > 0,
      },
      goals: (data.financialGoals || []) as GoalItem[],
      interests: data.interests || [],
    };

    // 3. Classify financial identity using the scoring algorithms
    const classification = classifyFinancialIdentity(featureVector);

    // 4. Map occupation to demo data persona
    let demoPersona: 'STUDENT' | 'WORKING_PROFESSIONAL' | 'FREELANCER' | 'BUSINESS_OWNER' =
      'WORKING_PROFESSIONAL';

    switch (data.occupation) {
      case 'STUDENT':
        demoPersona = 'STUDENT';
        break;
      case 'FREELANCER':
        demoPersona = 'FREELANCER';
        break;
      case 'BUSINESS_OWNER':
      case 'ENTREPRENEUR':
        demoPersona = 'BUSINESS_OWNER';
        break;
      default:
        demoPersona = 'WORKING_PROFESSIONAL';
        break;
    }

    // 5. Initialize/regenerate demo data personalized to this persona
    let demoDataStatus = 'COMPLETED';
    try {
      await DemoDataService.resetDemoData(userId, demoPersona);
    } catch (demoErr: any) {
      console.warn('[FinancialIdentityService] Demo data initialization warning:', demoErr.message);
      demoDataStatus = 'READY';
    }

    // 6. Compute recommendations
    // 6a. Goal recommendations & savings capacity
    const essentialExpenses = Math.round(incomeDetails.estimated * 0.45);
    const debtObligations = 0;
    const goalResults = processGoalRecommendations({
      goals: (data.financialGoals || []) as GoalItem[],
      monthlyIncome: incomeDetails.estimated,
      monthlyEssentialExpenses: essentialExpenses,
      monthlyDebtObligations: debtObligations,
      profileCategory: data.occupation,
    });

    // 6b. Community recommendations
    const communities = COMMUNITY_CATALOG.map((comm) =>
      calculateCommunityRelevance(featureVector, comm)
    ).sort((a, b) => b.relevanceScore - a.relevanceScore);

    // 6c. Educational content recommendations
    const content = recommendEducationalContent(featureVector);

    // 6d. Financial insights
    const confidenceScore = calculateInsightConfidence(95, 90, 85);
    const insights: FinancialInsight[] = [
      {
        id: 'insight_spending_pace',
        type: 'SPENDING_TREND',
        title: 'Disciplined Monthly Run-Rate',
        summary: `Your planned essential expenses are pegged at ₹${essentialExpenses.toLocaleString(
          'en-IN'
        )}/month, leaving ample margin for goal allocations.`,
        metricLabel: 'Essential Expense Ratio',
        metricValue: '45%',
        direction: 'DOWN',
        confidenceScore,
        confidenceTier: 'RELIABLE',
        isDemo: true,
        explanation: 'Derived from your declared monthly income and typical consumption benchmarks.',
      },
      {
        id: 'insight_savings_velocity',
        type: 'SAVINGS_VELOCITY',
        title: 'Projected Savings Capacity',
        summary: `You have approximately ₹${goalResults.availableSavings.toLocaleString(
          'en-IN'
        )} in monthly surplus capacity across ${goalResults.evaluatedGoals.length} priority targets.`,
        metricLabel: 'Available Monthly Savings',
        metricValue: `₹${goalResults.availableSavings.toLocaleString('en-IN')}`,
        direction: 'UP',
        confidenceScore,
        confidenceTier: 'RELIABLE',
        isDemo: true,
        explanation: 'Calculated using Max(0, Income - Essentials - Debt) constraint.',
      },
    ];

    // 7. Persist completed profile to database
    const profileDTO: FinancialProfileDTO = {
      occupation: data.occupation,
      occupationDetails: data.occupationDetails,
      incomeSource: data.incomeSource,
      monthlyIncomeRange: data.monthlyIncomeRange,
      monthlyIncomeMin: incomeDetails.min,
      monthlyIncomeMax: incomeDetails.max,
      incomeFrequency: data.incomeFrequency,
      incomeStability: data.incomeStability,
      financialResponsibilities: data.financialResponsibilities,
      financialGoals: (data.financialGoals || []) as GoalItem[],
      interests: data.interests || [],
      onboardingStep: 5,
      onboardingComplete: true,
    };

    try {
      await prisma.$transaction(async (tx) => {
        await tx.financialProfile.upsert({
          where: { userId },
          create: {
            userId,
            occupation: data.occupation,
            occupationDetails: data.occupationDetails,
            incomeSource: data.incomeSource,
            monthlyIncomeRange: data.monthlyIncomeRange,
            monthlyIncomeMin: incomeDetails.min,
            monthlyIncomeMax: incomeDetails.max,
            incomeFrequency: data.incomeFrequency,
            incomeStability: data.incomeStability,
            financialResponsibilities: data.financialResponsibilities,
            financialGoals: (data.financialGoals as any) || [],
            interests: data.interests || [],
            onboardingStep: 5,
            onboardingComplete: true,
            profileScore: classification.overallScore,
            classifiedCategory: classification.suggestedPersona,
            metadata: classification as any,
          },
          update: {
            occupation: data.occupation,
            occupationDetails: data.occupationDetails,
            incomeSource: data.incomeSource,
            monthlyIncomeRange: data.monthlyIncomeRange,
            monthlyIncomeMin: incomeDetails.min,
            monthlyIncomeMax: incomeDetails.max,
            incomeFrequency: data.incomeFrequency,
            incomeStability: data.incomeStability,
            financialResponsibilities: data.financialResponsibilities,
            financialGoals: (data.financialGoals as any) || [],
            interests: data.interests || [],
            onboardingStep: 5,
            onboardingComplete: true,
            profileScore: classification.overallScore,
            classifiedCategory: classification.suggestedPersona,
            metadata: classification as any,
          },
        });

        // Mark user onboardingStep as ACTIVE
        await tx.user.update({
          where: { id: userId },
          data: { onboardingStep: 'ACTIVE' },
        });
      });
    } catch (err: any) {
      console.warn('[FinancialIdentityService] DB completeOnboarding warning (memory save):', err.message);
    }

    inMemoryProfiles.set(userId, profileDTO);

    return {
      profile: profileDTO,
      classification,
      goals: goalResults.evaluatedGoals,
      communities,
      insights,
      content,
      demoDataStatus,
    };
  }

  /**
   * Retrieves user recommendations on demand
   */
  static async getRecommendations(userId: string): Promise<{
    goals: GoalRecommendation[];
    communities: CommunityRecommendation[];
    insights: FinancialInsight[];
    content: ContentRecommendation[];
  }> {
    const profile = await this.getProfile(userId);
    const incomeDetails = this.parseEstimatedIncome(
      profile.occupation,
      profile.monthlyIncomeMin,
      profile.monthlyIncomeMax,
      profile.monthlyIncomeRange
    );

    const featureVector: UserFeatureVector = {
      occupation: {
        category: profile.occupation,
        details: profile.occupationDetails,
      },
      income: {
        source: profile.incomeSource,
        range: profile.monthlyIncomeRange,
        estimatedMonthly: incomeDetails.estimated,
        frequency: (profile.incomeFrequency as any) || 'MONTHLY',
        stability: (profile.incomeStability as any) || 'HIGH',
        hasIncome: incomeDetails.estimated > 0,
      },
      goals: profile.financialGoals || [],
      interests: profile.interests || [],
    };

    const essentialExpenses = Math.round(incomeDetails.estimated * 0.45);
    const goalResults = processGoalRecommendations({
      goals: profile.financialGoals || [],
      monthlyIncome: incomeDetails.estimated,
      monthlyEssentialExpenses: essentialExpenses,
      monthlyDebtObligations: 0,
      profileCategory: profile.occupation,
    });

    const communities = COMMUNITY_CATALOG.map((comm) =>
      calculateCommunityRelevance(featureVector, comm)
    ).sort((a, b) => b.relevanceScore - a.relevanceScore);

    const content = recommendEducationalContent(featureVector);

    const confidenceScore = calculateInsightConfidence(95, 90, 85);
    const insights: FinancialInsight[] = [
      {
        id: 'insight_budget_status',
        type: 'BUDGET_UTILIZATION',
        title: 'Monthly Cash Flow Surplus',
        summary: `Your monthly available savings capacity is projected at ₹${goalResults.availableSavings.toLocaleString(
          'en-IN'
        )}.`,
        metricLabel: 'Available Surplus',
        metricValue: `₹${goalResults.availableSavings.toLocaleString('en-IN')}`,
        direction: 'UP',
        confidenceScore,
        confidenceTier: 'RELIABLE',
        isDemo: true,
        explanation: 'Personalized based on your declared income and savings targets.',
      },
    ];

    return {
      goals: goalResults.evaluatedGoals,
      communities,
      insights,
      content,
    };
  }
}

