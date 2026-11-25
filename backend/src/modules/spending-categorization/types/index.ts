export type SpendingCategory =
  | 'INVESTMENT'
  | 'MEDICINE'
  | 'FOOD'
  | 'GROCERIES'
  | 'PETROL'
  | 'SHOPPING'
  | 'SUBSCRIPTION'
  | 'TRANSPORT'
  | 'OUTING'
  | 'BILLS_UTILITIES'
  | 'EDUCATION'
  | 'RENT'
  | 'INSURANCE'
  | 'ENTERTAINMENT'
  | 'TRAVEL'
  | 'MISCELLANEOUS';

export interface SpendingCategoryConfig {
  id: SpendingCategory;
  displayName: string;
  description: string;
  icon: string;
  chartColor: string;
  isActive: boolean;
  displayOrder: number;
}

export interface RawTransactionInput {
  transactionId?: string;
  amount: number;
  merchantName?: string;
  upiHolderName?: string;
  upiId?: string; // VPA, e.g. apollo@upi
  merchantId?: string;
  mcc?: string | number; // 4-digit MCC code e.g. 5411, "5812"
  bankDescription?: string;
  transactionRef?: string;
  paymentSource?: 'UPI' | 'CARD' | 'NET_BANKING' | 'ACCOUNT_AGGREGATOR' | 'MANUAL';
  isConfirmedPayment: boolean; // Must be true for processing
  userId?: string;
}

export interface ExtractedMerchantInfo {
  rawMerchantName?: string;
  normalizedMerchantName?: string;
  extractedKeywords: string[];
  rawUpiId?: string;
  normalizedUpiId?: string;
  upiHandlePrefix?: string; // e.g. "apollo" from "apollo@upi"
  upiProviderDomain?: string; // e.g. "upi", "okhdfcbank"
  rawUpiHolderName?: string;
  normalizedUpiHolderName?: string;
  merchantIdentifier?: string;
  mcc?: string;
  bankDescription?: string;
  transactionReference?: string;
  paymentSource?: string;
  isConfirmedPayment: boolean;
  userId?: string;
}

export interface VerifiedMerchantRecord {
  id: string;
  merchantIdentifier: string;
  normalizedName: string;
  originalName: string;
  upiIds: string[];
  aliases: string[];
  category: SpendingCategory;
  mcc?: string;
  isVerified: boolean;
  confidenceProvenance: 'OFFICIAL_REGISTRY' | 'BANK_DIRECTORY' | 'USER_CONFIRMED' | 'HEURISTIC';
  isMultiCategory?: boolean;
  allowedCategories?: SpendingCategory[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface UserMerchantMappingRecord {
  id: string;
  userId: string;
  merchantKey: string; // normalized identifier or UPI ID
  assignedCategory: SpendingCategory;
  confirmationCount: number;
  lastConfirmedAt: Date | string;
  isAmbiguousPersonalVpa: boolean;
}

export interface MCCMappingRecord {
  code: string;
  description: string;
  category: SpendingCategory;
  isBroad: boolean; // Broad MCCs don't uniquely map to a single category
  alternativeCategories?: SpendingCategory[];
}

export interface SignalStrength {
  verifiedIdentifierStrength: number; // S_I: 0.0 - 1.0
  mccStrength: number;                // S_M: 0.0 - 1.0
  nameMatchStrength: number;          // S_N: 0.0 - 1.0
  historyStrength: number;            // S_H: 0.0 - 1.0
}

export interface SignalAvailability {
  hasVerifiedIdentifier: boolean;
  hasMcc: boolean;
  hasNameMatch: boolean;
  hasHistory: boolean;
}

export interface ScoringWeights {
  verifiedIdentifier: number; // default: 0.40
  mcc: number;                // default: 0.30
  nameMatch: number;          // default: 0.20
  history: number;            // default: 0.10
}

export interface ScoringThresholds {
  highConfidence: number;     // default: 90
  moderateConfidence: number; // default: 70
}

export interface CategoryConfidenceCandidate {
  category: SpendingCategory;
  score: number; // 0 - 100
  supportingSignals: Array<'VERIFIED_IDENTIFIER' | 'MCC' | 'NAME' | 'HISTORY'>;
  independentSignalCount: number;
}

export interface ClassificationResult {
  transactionId?: string;
  originalMerchantName?: string;
  normalizedMerchantName?: string;
  identifiedMerchantId?: string;
  predictedCategory: SpendingCategory;
  finalCategory: SpendingCategory;
  confidenceScore: number; // 0 - 100
  confidenceTier: 'HIGH' | 'MODERATE' | 'LOW';
  classificationMethod:
    | 'VERIFIED_IDENTIFIER'
    | 'MCC_MATCH'
    | 'NAME_MATCH'
    | 'HISTORY_MATCH'
    | 'USER_CONFIRMED_MAPPING'
    | 'MULTI_SIGNAL'
    | 'FALLBACK_MISCELLANEOUS';
  matchedRules: string[];
  availableEvidence: {
    verifiedIdentifierUsed: boolean;
    mccUsed: boolean;
    nameMatchUsed: boolean;
    historyMatchUsed: boolean;
    rawSignals: Record<string, number>;
    availableWeightsSum: number;
  };
  conflictsDetected?: string[];
  isManuallyCorrected: boolean;
  timestamp: string;
}

