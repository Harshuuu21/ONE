import {
  DEFAULT_FEATURE_WEIGHTS,
  FeatureWeights,
  OccupationType,
  ProfileClassificationResult,
  UserFeatureVector,
} from './financial-identity.types.js';

const EPSILON = 0.001;
const CONFIDENCE_THRESHOLD = 50;

/**
 * Validates that the sum of configurable weights equals 1.0 within floating point tolerance
 */
export function validateWeightsSum(weights: FeatureWeights): boolean {
  const sum =
    weights.occupation +
    weights.income +
    weights.goals +
    weights.interests +
    weights.behaviour;
  return Math.abs(sum - 1.0) < EPSILON;
}

/**
 * Redistributes weights proportionally when optional features are missing
 * Formula: AdjustedWeight = OriginalWeight / SumOfAvailableWeights
 */
export function calculateAdjustedWeights(
  availableKeys: Array<keyof FeatureWeights>,
  weights: FeatureWeights = DEFAULT_FEATURE_WEIGHTS
): Record<keyof FeatureWeights, number> {
  const sumAvailable = availableKeys.reduce((acc, k) => acc + weights[k], 0);

  if (sumAvailable <= 0) {
    throw new Error('No available features provided for weight calculation.');
  }

  const adjusted: Record<keyof FeatureWeights, number> = {
    occupation: 0,
    income: 0,
    goals: 0,
    interests: 0,
    behaviour: 0,
  };

  for (const key of availableKeys) {
    adjusted[key] = weights[key] / sumAvailable;
  }

  return adjusted;
}

/**
 * Normalizes any value between a min and max to a 0-100 scale
 */
export function normalize0to100(value: number, min: number, max: number): number {
  if (max <= min) return 50;
  const clamped = Math.max(min, Math.min(max, value));
  return Math.round(((clamped - min) / (max - min)) * 100);
}

/**
 * Calculates Occupation Compatibility Score (0 - 100) for candidate category
 */
export function calculateOccupationScore(
  declared: OccupationType,
  candidate: 'STUDENT' | 'WORKING_PROFESSIONAL' | 'FREELANCER' | 'BUSINESS_OWNER'
): number {
  if (declared === candidate) return 100;

  // Cross-compatibility mappings
  switch (candidate) {
    case 'STUDENT':
      return declared === 'OTHER' ? 40 : 10;
    case 'WORKING_PROFESSIONAL':
      if (declared === 'HOMEMAKER' || declared === 'RETIRED') return 70;
      if (declared === 'FREELANCER') return 50;
      return 20;
    case 'FREELANCER':
      if (declared === 'ENTREPRENEUR') return 75;
      if (declared === 'WORKING_PROFESSIONAL') return 45;
      return 15;
    case 'BUSINESS_OWNER':
      if (declared === 'ENTREPRENEUR') return 95;
      if (declared === 'FREELANCER') return 60;
      return 15;
  }
}

/**
 * Calculates Income Compatibility Score (0 - 100)
 */
export function calculateIncomeScore(
  income: UserFeatureVector['income'],
  candidate: 'STUDENT' | 'WORKING_PROFESSIONAL' | 'FREELANCER' | 'BUSINESS_OWNER'
): number {
  const source = (income.source || '').toUpperCase();
  const stability = income.stability || 'MODERATE';
  const est = income.estimatedMonthly || 25000;

  let score = 50;

  switch (candidate) {
    case 'STUDENT':
      if (source.includes('ALLOWANCE') || source.includes('SCHOLARSHIP')) score += 35;
      if (est < 25000) score += 20;
      else if (est > 80000) score -= 25;
      break;

    case 'WORKING_PROFESSIONAL':
      if (source.includes('SALARY')) score += 40;
      if (stability === 'HIGH') score += 20;
      if (est >= 40000 && est <= 250000) score += 15;
      break;

    case 'FREELANCER':
      if (source.includes('FREELANCE') || source.includes('PROJECT')) score += 40;
      if (stability === 'VARIABLE') score += 25;
      break;

    case 'BUSINESS_OWNER':
      if (source.includes('BUSINESS') || source.includes('REVENUE')) score += 40;
      if (est > 80000) score += 20;
      break;
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Calculates Goal Compatibility Score (0 - 100)
 */
export function calculateGoalScore(
  goals: UserFeatureVector['goals'],
  candidate: 'STUDENT' | 'WORKING_PROFESSIONAL' | 'FREELANCER' | 'BUSINESS_OWNER'
): number {
  if (!goals || goals.length === 0) return 50;

  const goalNames = goals.map((g) => g.name.toLowerCase()).join(' ');
  let matches = 0;

  const keywords: Record<string, string[]> = {
    STUDENT: ['laptop', 'device', 'education', 'study', 'semester', 'travel', 'exam'],
    WORKING_PROFESSIONAL: ['emergency', 'vacation', 'vehicle', 'car', 'house', 'invest', 'retirement'],
    FREELANCER: ['workstation', 'equipment', 'software', 'tax', 'emergency reserve', 'gear'],
    BUSINESS_OWNER: ['expansion', 'equipment', 'capital', 'growth', 'hire', 'inventory', 'commercial'],
  };

  const targetKeywords = keywords[candidate] || [];
  for (const kw of targetKeywords) {
    if (goalNames.includes(kw)) matches++;
  }

  return Math.min(100, Math.round(40 + (matches / Math.max(1, targetKeywords.length)) * 60));
}

/**
 * Calculates Interest Compatibility Score (0 - 100)
 */
export function calculateInterestScore(
  interests: string[],
  candidate: 'STUDENT' | 'WORKING_PROFESSIONAL' | 'FREELANCER' | 'BUSINESS_OWNER'
): number {
  if (!interests || interests.length === 0) return 50;

  const joined = interests.join(' ').toLowerCase();
  let matches = 0;

  const keywords: Record<string, string[]> = {
    STUDENT: ['literacy', 'saving', 'budget', 'student'],
    WORKING_PROFESSIONAL: ['wealth', 'invest', 'tax', 'independence', 'fire'],
    FREELANCER: ['irregular', 'tax planning', 'invoicing', 'freelance'],
    BUSINESS_OWNER: ['business', 'capital', 'growth', 'payroll'],
  };

  const targetKeywords = keywords[candidate] || [];
  for (const kw of targetKeywords) {
    if (joined.includes(kw)) matches++;
  }

  return Math.min(100, Math.round(40 + (matches / Math.max(1, targetKeywords.length)) * 60));
}

/**
 * Calculates Observed Behaviour Score (0 - 100) if transaction history is available
 */
export function calculateBehaviourScore(
  behaviour: UserFeatureVector['behaviour'],
  candidate: 'STUDENT' | 'WORKING_PROFESSIONAL' | 'FREELANCER' | 'BUSINESS_OWNER'
): number {
  if (!behaviour || !behaviour.transactionCount) return 50;

  const count = behaviour.transactionCount;
  const spend = behaviour.observedMonthlySpend || 30000;

  switch (candidate) {
    case 'STUDENT':
      return spend < 25000 ? 85 : 40;
    case 'WORKING_PROFESSIONAL':
      return spend >= 30000 && count >= 20 ? 85 : 55;
    case 'FREELANCER':
      return count >= 10 && count <= 40 ? 80 : 50;
    case 'BUSINESS_OWNER':
      return spend > 80000 || count > 50 ? 90 : 50;
  }
}

/**
 * Primary Financial Identity Classification Engine
 * Evaluates candidate categories using proportional weight redistribution
 */
export function classifyFinancialIdentity(
  vector: UserFeatureVector,
  weights: FeatureWeights = DEFAULT_FEATURE_WEIGHTS
): ProfileClassificationResult {
  // Determine available feature keys
  const availableKeys: Array<keyof FeatureWeights> = ['occupation', 'income', 'goals', 'interests'];
  if (vector.behaviour && vector.behaviour.transactionCount && vector.behaviour.transactionCount > 0) {
    availableKeys.push('behaviour');
  }

  const adjustedWeights = calculateAdjustedWeights(availableKeys, weights);

  const candidates: Array<'STUDENT' | 'WORKING_PROFESSIONAL' | 'FREELANCER' | 'BUSINESS_OWNER'> = [
    'STUDENT',
    'WORKING_PROFESSIONAL',
    'FREELANCER',
    'BUSINESS_OWNER',
  ];

  const rankings: Array<{ category: 'STUDENT' | 'WORKING_PROFESSIONAL' | 'FREELANCER' | 'BUSINESS_OWNER'; score: number }> = [];
  const detailedScores: Record<string, any> = {};

  for (const candidate of candidates) {
    const occScore = calculateOccupationScore(vector.occupation.category, candidate);
    const incScore = calculateIncomeScore(vector.income, candidate);
    const goalScore = calculateGoalScore(vector.goals, candidate);
    const intScore = calculateInterestScore(vector.interests, candidate);
    const behScore = availableKeys.includes('behaviour')
      ? calculateBehaviourScore(vector.behaviour, candidate)
      : undefined;

    let totalScore =
      adjustedWeights.occupation * occScore +
      adjustedWeights.income * incScore +
      adjustedWeights.goals * goalScore +
      adjustedWeights.interests * intScore;

    if (behScore !== undefined && adjustedWeights.behaviour > 0) {
      totalScore += adjustedWeights.behaviour * behScore;
    }

    const finalScore = Math.round(totalScore * 100) / 100;
    rankings.push({ category: candidate, score: finalScore });

    detailedScores[candidate] = {
      occupationScore: occScore,
      incomeScore: incScore,
      goalScore: goalScore,
      interestScore: intScore,
      behaviourScore: behScore,
    };
  }

  // Sort descending by score
  rankings.sort((a, b) => b.score - a.score);

  const topCandidate = rankings[0];

  // The occupation explicitly selected by the user remains authoritative
  let resolvedPersona: 'STUDENT' | 'WORKING_PROFESSIONAL' | 'FREELANCER' | 'BUSINESS_OWNER' = topCandidate.category;

  switch (vector.occupation.category) {
    case 'STUDENT':
      resolvedPersona = 'STUDENT';
      break;
    case 'WORKING_PROFESSIONAL':
      resolvedPersona = 'WORKING_PROFESSIONAL';
      break;
    case 'FREELANCER':
      resolvedPersona = 'FREELANCER';
      break;
    case 'BUSINESS_OWNER':
    case 'ENTREPRENEUR':
      resolvedPersona = 'BUSINESS_OWNER';
      break;
    case 'HOMEMAKER':
    case 'RETIRED':
    case 'OTHER':
      // Uses the highest algorithmic scoring persona as fallback
      resolvedPersona = topCandidate.category;
      break;
  }

  return {
    declaredOccupation: vector.occupation.category,
    suggestedPersona: resolvedPersona,
    overallScore: topCandidate.score,
    confidenceThreshold: CONFIDENCE_THRESHOLD,
    isHighConfidence: topCandidate.score >= CONFIDENCE_THRESHOLD,
    featureScores: detailedScores[resolvedPersona],
    adjustedWeights,
    candidateRankings: rankings,
  };
}

