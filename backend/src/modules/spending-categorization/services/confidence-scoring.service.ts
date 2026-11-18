import {
  CategoryConfidenceCandidate,
  ScoringThresholds,
  ScoringWeights,
  SignalAvailability,
  SignalStrength,
  SpendingCategory,
} from '../types/index.js';

export const DEFAULT_SCORING_WEIGHTS: ScoringWeights = {
  verifiedIdentifier: 0.40,
  mcc: 0.30,
  nameMatch: 0.20,
  history: 0.10,
};

export const DEFAULT_SCORING_THRESHOLDS: ScoringThresholds = {
  highConfidence: 90,
  moderateConfidence: 70,
};

export class ConfidenceScoringService {
  /**
   * Computes the mathematical confidence score:
   * C(m, c) = 100 * [ \sum (W_j * S_j) / \sum W_j ]
   *
   * @param signals Normalized strengths (0.0 - 1.0) for each signal
   * @param availability Flags indicating whether each signal is available/trustworthy
   * @param weights Configurable signal weights (defaults to 0.40, 0.30, 0.20, 0.10)
   */
  static calculateConfidenceScore(
    signals: SignalStrength,
    availability: SignalAvailability,
    weights: ScoringWeights = DEFAULT_SCORING_WEIGHTS
  ): {
    score: number;
    availableWeightsSum: number;
    weightedNumerator: number;
    activeSignalsCount: number;
  } {
    let weightedNumerator = 0;
    let availableWeightsSum = 0;
    let activeSignalsCount = 0;

    // 1. Verified Merchant Identifier (I)
    if (availability.hasVerifiedIdentifier) {
      const strength = Math.max(0, Math.min(1, signals.verifiedIdentifierStrength));
      weightedNumerator += weights.verifiedIdentifier * strength;
      availableWeightsSum += weights.verifiedIdentifier;
      if (strength > 0) activeSignalsCount++;
    }

    // 2. MCC Match (M)
    if (availability.hasMcc) {
      const strength = Math.max(0, Math.min(1, signals.mccStrength));
      weightedNumerator += weights.mcc * strength;
      availableWeightsSum += weights.mcc;
      if (strength > 0) activeSignalsCount++;
    }

    // 3. Merchant Name Match (N)
    if (availability.hasNameMatch) {
      const strength = Math.max(0, Math.min(1, signals.nameMatchStrength));
      weightedNumerator += weights.nameMatch * strength;
      availableWeightsSum += weights.nameMatch;
      if (strength > 0) activeSignalsCount++;
    }

    // 4. Confirmed Merchant History (H)
    if (availability.hasHistory) {
      const strength = Math.max(0, Math.min(1, signals.historyStrength));
      weightedNumerator += weights.history * strength;
      availableWeightsSum += weights.history;
      if (strength > 0) activeSignalsCount++;
    }

    // Guard against zero available signals
    if (availableWeightsSum <= 0) {
      return {
        score: 0,
        availableWeightsSum: 0,
        weightedNumerator: 0,
        activeSignalsCount: 0,
      };
    }

    // Mathematical formula evaluation
    const rawScore = (weightedNumerator / availableWeightsSum) * 100;
    const finalScore = Math.max(0, Math.min(100, Math.round(rawScore * 100) / 100));

    return {
      score: finalScore,
      availableWeightsSum: Math.round(availableWeightsSum * 100) / 100,
      weightedNumerator: Math.round(weightedNumerator * 1000) / 1000,
      activeSignalsCount,
    };
  }

  /**
   * Evaluates decision thresholds and evidence independence
   * - 90 - 100: High confidence (automatic categorization)
   * - 70 - 89: Moderate confidence (requires at least two independent corroborating signals)
   * - < 70: Below threshold -> Assign MISCELLANEOUS
   */
  static evaluateDecision(
    score: number,
    independentSignalCount: number,
    thresholds: ScoringThresholds = DEFAULT_SCORING_THRESHOLDS
  ): {
    assignedCategoryDecision: 'ACCEPT' | 'REJECT_TO_MISCELLANEOUS';
    tier: 'HIGH' | 'MODERATE' | 'LOW';
    reason: string;
  } {
    if (score >= thresholds.highConfidence) {
      return {
        assignedCategoryDecision: 'ACCEPT',
        tier: 'HIGH',
        reason: `High confidence score of ${score}% exceeds ${thresholds.highConfidence}% threshold.`,
      };
    }

    if (score >= thresholds.moderateConfidence) {
      // Moderate confidence requires at least two independent corroborating evidence signals
      if (independentSignalCount >= 2) {
        return {
          assignedCategoryDecision: 'ACCEPT',
          tier: 'MODERATE',
          reason: `Moderate confidence score of ${score}% supported by ${independentSignalCount} independent signals.`,
        };
      }
      return {
        assignedCategoryDecision: 'REJECT_TO_MISCELLANEOUS',
        tier: 'MODERATE',
        reason: `Moderate confidence score of ${score}% lacks required corroborating evidence (only ${independentSignalCount} signal; requires >= 2).`,
      };
    }

    return {
      assignedCategoryDecision: 'REJECT_TO_MISCELLANEOUS',
      tier: 'LOW',
      reason: `Confidence score of ${score}% is below minimum ${thresholds.moderateConfidence}% threshold.`,
    };
  }
}
