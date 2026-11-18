import {
  ClassificationResult,
  RawTransactionInput,
  SpendingCategory,
} from '../types/index.js';
import { MerchantNormalizationService } from './merchant-normalization.service.js';
import { MerchantIdentificationService } from './merchant-identification.service.js';
import { ConfidenceScoringService } from './confidence-scoring.service.js';

export class TransactionClassificationService {
  /**
   * Executes end-to-end intelligent transaction categorization
   * Fails safely to MISCELLANEOUS if information is incomplete, conflicting, or below confidence.
   */
  static classify(input: RawTransactionInput): ClassificationResult {
    const timestamp = new Date().toISOString();

    // 1. Verification of Payment Eligibility:
    // QR scanning alone is not proof of completed payment; only process confirmed payments.
    if (!input.isConfirmedPayment) {
      return {
        transactionId: input.transactionId,
        originalMerchantName: input.merchantName,
        normalizedMerchantName: undefined,
        predictedCategory: 'MISCELLANEOUS',
        finalCategory: 'MISCELLANEOUS',
        confidenceScore: 0,
        confidenceTier: 'LOW',
        classificationMethod: 'FALLBACK_MISCELLANEOUS',
        matchedRules: ['REJECTED_UNCONFIRMED_TRANSACTION'],
        availableEvidence: {
          verifiedIdentifierUsed: false,
          mccUsed: false,
          nameMatchUsed: false,
          historyMatchUsed: false,
          rawSignals: {},
          availableWeightsSum: 0,
        },
        conflictsDetected: ['Transaction has not been confirmed by trusted payment provider.'],
        isManuallyCorrected: false,
        timestamp,
      };
    }

    // 2. Extract and Normalize Merchant Information
    const extracted = MerchantNormalizationService.extractAndNormalize(input);

    // 3. Identify Merchant & Gather Evidence Across 4 Priorities
    let evidence;
    try {
      evidence = MerchantIdentificationService.identify(extracted);
    } catch (err: any) {
      // Safe fallback on unexpected identification error
      return {
        transactionId: input.transactionId,
        originalMerchantName: extracted.rawMerchantName,
        normalizedMerchantName: extracted.normalizedMerchantName,
        predictedCategory: 'MISCELLANEOUS',
        finalCategory: 'MISCELLANEOUS',
        confidenceScore: 0,
        confidenceTier: 'LOW',
        classificationMethod: 'FALLBACK_MISCELLANEOUS',
        matchedRules: ['ERROR_IDENTIFICATION_SERVICE_FAILURE'],
        availableEvidence: {
          verifiedIdentifierUsed: false,
          mccUsed: false,
          nameMatchUsed: false,
          historyMatchUsed: false,
          rawSignals: {},
          availableWeightsSum: 0,
        },
        conflictsDetected: [`Service exception: ${err.message}`],
        isManuallyCorrected: false,
        timestamp,
      };
    }

    // 4. Handle Conflict Evaluation
    if (evidence.conflicts.length > 0) {
      return {
        transactionId: input.transactionId,
        originalMerchantName: extracted.rawMerchantName,
        normalizedMerchantName: extracted.normalizedMerchantName,
        identifiedMerchantId: evidence.verifiedMerchant?.merchantIdentifier,
        predictedCategory: 'MISCELLANEOUS',
        finalCategory: 'MISCELLANEOUS',
        confidenceScore: 40,
        confidenceTier: 'LOW',
        classificationMethod: 'FALLBACK_MISCELLANEOUS',
        matchedRules: ['REJECTED_SIGNAL_CONFLICT'],
        availableEvidence: {
          verifiedIdentifierUsed: Boolean(evidence.verifiedMerchant),
          mccUsed: Boolean(evidence.mccRecord),
          nameMatchUsed: Boolean(evidence.nameMatchMerchant),
          historyMatchUsed: Boolean(evidence.userHistoryRecord),
          rawSignals: {},
          availableWeightsSum: 1.0,
        },
        conflictsDetected: evidence.conflicts,
        isManuallyCorrected: false,
        timestamp,
      };
    }

    // 5. Score All Candidate Categories
    const candidateScores: Array<{
      category: SpendingCategory;
      score: number;
      availableWeightsSum: number;
      supportingSignals: Array<'VERIFIED_IDENTIFIER' | 'MCC' | 'NAME' | 'HISTORY'>;
      rawSignals: Record<string, number>;
    }> = [];

    for (const [cat, data] of evidence.detectedCandidateCategories.entries()) {
      const scoringResult = ConfidenceScoringService.calculateConfidenceScore(
        data.signals,
        data.availability
      );

      candidateScores.push({
        category: cat,
        score: scoringResult.score,
        availableWeightsSum: scoringResult.availableWeightsSum,
        supportingSignals: data.supportingSignals,
        rawSignals: {
          verifiedIdentifier: data.signals.verifiedIdentifierStrength,
          mcc: data.signals.mccStrength,
          nameMatch: data.signals.nameMatchStrength,
          history: data.signals.historyStrength,
        },
      });
    }

    // 6. Handle Zero Candidates (Unknown / Missing Merchant)
    if (candidateScores.length === 0) {
      return {
        transactionId: input.transactionId,
        originalMerchantName: extracted.rawMerchantName,
        normalizedMerchantName: extracted.normalizedMerchantName,
        predictedCategory: 'MISCELLANEOUS',
        finalCategory: 'MISCELLANEOUS',
        confidenceScore: 0,
        confidenceTier: 'LOW',
        classificationMethod: 'FALLBACK_MISCELLANEOUS',
        matchedRules: ['NO_RECOGNIZABLE_MERCHANT_SIGNALS'],
        availableEvidence: {
          verifiedIdentifierUsed: false,
          mccUsed: false,
          nameMatchUsed: false,
          historyMatchUsed: false,
          rawSignals: {},
          availableWeightsSum: 0,
        },
        isManuallyCorrected: false,
        timestamp,
      };
    }

    // Sort candidates descending by confidence score
    candidateScores.sort((a, b) => b.score - a.score);
    const topCandidate = candidateScores[0];

    // 7. Evaluate Decision Thresholds & Corroborating Evidence
    const decision = ConfidenceScoringService.evaluateDecision(
      topCandidate.score,
      topCandidate.supportingSignals.length
    );

    const finalCategory: SpendingCategory =
      decision.assignedCategoryDecision === 'ACCEPT' ? topCandidate.category : 'MISCELLANEOUS';

    // 8. Determine Specific Classification Method for Provenance Tracking
    let method: ClassificationResult['classificationMethod'] = 'FALLBACK_MISCELLANEOUS';
    if (finalCategory !== 'MISCELLANEOUS') {
      if (topCandidate.supportingSignals.length > 1) {
        method = 'MULTI_SIGNAL';
      } else if (topCandidate.supportingSignals.includes('VERIFIED_IDENTIFIER')) {
        method = 'VERIFIED_IDENTIFIER';
      } else if (topCandidate.supportingSignals.includes('MCC')) {
        method = 'MCC_MATCH';
      } else if (topCandidate.supportingSignals.includes('NAME')) {
        method = 'NAME_MATCH';
      } else if (topCandidate.supportingSignals.includes('HISTORY')) {
        method = 'HISTORY_MATCH';
      }
    }

    const matchedRules: string[] = [
      ...topCandidate.supportingSignals.map((s) => `SIGNAL_${s}`),
      `DECISION_${decision.assignedCategoryDecision}`,
      `TIER_${decision.tier}`,
    ];

    return {
      transactionId: input.transactionId,
      originalMerchantName: extracted.rawMerchantName,
      normalizedMerchantName: extracted.normalizedMerchantName,
      identifiedMerchantId:
        evidence.verifiedMerchant?.merchantIdentifier ||
        evidence.nameMatchMerchant?.merchantIdentifier,
      predictedCategory: topCandidate.category,
      finalCategory,
      confidenceScore: topCandidate.score,
      confidenceTier: decision.tier,
      classificationMethod: method,
      matchedRules,
      availableEvidence: {
        verifiedIdentifierUsed: topCandidate.supportingSignals.includes('VERIFIED_IDENTIFIER'),
        mccUsed: topCandidate.supportingSignals.includes('MCC'),
        nameMatchUsed: topCandidate.supportingSignals.includes('NAME'),
        historyMatchUsed: topCandidate.supportingSignals.includes('HISTORY'),
        rawSignals: topCandidate.rawSignals,
        availableWeightsSum: topCandidate.availableWeightsSum,
      },
      isManuallyCorrected: false,
      timestamp,
    };
  }
}
