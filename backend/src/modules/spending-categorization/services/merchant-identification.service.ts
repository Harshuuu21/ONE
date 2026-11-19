import { lookupMcc } from '../rules/mcc-mappings.js';
import { MerchantRepository } from '../repositories/merchant.repository.js';
import {
  ExtractedMerchantInfo,
  MCCMappingRecord,
  SignalAvailability,
  SignalStrength,
  SpendingCategory,
  UserMerchantMappingRecord,
  VerifiedMerchantRecord,
} from '../types/index.js';

export interface IdentificationEvidence {
  verifiedMerchant: VerifiedMerchantRecord | null;
  mccRecord: MCCMappingRecord | null;
  nameMatchMerchant: VerifiedMerchantRecord | null;
  nameMatchStrength: number;
  userHistoryRecord: UserMerchantMappingRecord | null;
  detectedCandidateCategories: Map<
    SpendingCategory,
    {
      signals: SignalStrength;
      availability: SignalAvailability;
      supportingSignals: Array<'VERIFIED_IDENTIFIER' | 'MCC' | 'NAME' | 'HISTORY'>;
    }
  >;
  conflicts: string[];
}

export class MerchantIdentificationService {
  /**
   * Evaluates transaction metadata across all 4 priorities and gathers signal evidence
   */
  static identify(info: ExtractedMerchantInfo): IdentificationEvidence {
    const conflicts: string[] = [];

    // --- Priority 1: Verified Merchant Identifier & UPI VPA ---
    let verifiedMerchant: VerifiedMerchantRecord | null = null;
    if (info.merchantIdentifier) {
      verifiedMerchant = MerchantRepository.findVerifiedById(info.merchantIdentifier);
    }
    if (!verifiedMerchant && info.normalizedUpiId) {
      verifiedMerchant = MerchantRepository.findVerifiedByUpi(info.normalizedUpiId);
    }

    // --- Priority 2: MCC Matching ---
    const mccRecord = lookupMcc(info.mcc);

    // --- Priority 3: User-Specific Previously Confirmed Merchant History ---
    // Checked before keyword matching to respect user overrides
    let userHistoryRecord: UserMerchantMappingRecord | null = null;
    if (info.userId) {
      const historyKey = info.merchantIdentifier || info.normalizedUpiId || info.normalizedMerchantName;
      if (historyKey) {
        userHistoryRecord = MerchantRepository.findUserConfirmedMapping(info.userId, historyKey);
      }
    }

    // --- Priority 4: Merchant Name Matching (Checked only if no user-confirmed history) ---
    let nameMatchMerchant: VerifiedMerchantRecord | null = null;
    let nameMatchStrength = 0;

    if (info.normalizedMerchantName) {
      // 4a. Exact normalized name, alias, or phrase containment match
      const matched = MerchantRepository.findVerifiedByName(info.normalizedMerchantName);
      if (matched) {
        nameMatchMerchant = matched.merchant;
        nameMatchStrength = matched.strength;
      } else if (info.extractedKeywords.length > 0 && (!userHistoryRecord || userHistoryRecord.isAmbiguousPersonalVpa)) {
        // 4b. Keyword / Token match (bypassed if user confirmed mapping exists)
        const keywordMatches = MerchantRepository.searchVerifiedByKeywords(info.extractedKeywords);
        if (keywordMatches.length > 0 && keywordMatches[0].matchScore >= 0.5) {
          nameMatchMerchant = keywordMatches[0].merchant;
          nameMatchStrength = keywordMatches[0].matchScore >= 0.7 ? 0.9 : 0.6;
        }
      }
    }

    // Detect signal conflicts between verified merchant and MCC
    if (verifiedMerchant && mccRecord && verifiedMerchant.category !== mccRecord.category) {
      // Check if merchant operates across multiple business categories
      if (
        verifiedMerchant.isMultiCategory &&
        verifiedMerchant.allowedCategories?.includes(mccRecord.category)
      ) {
        // Multi-category merchant, e.g. Amazon / Swiggy - MCC refines the specific purchase
      } else {
        conflicts.push(
          `Conflict: Verified merchant '${verifiedMerchant.originalName}' indicates category '${verifiedMerchant.category}', but MCC ${mccRecord.code} indicates category '${mccRecord.category}'.`
        );
      }
    }

    // Detect signal conflicts between name-matched merchant and MCC
    if (!verifiedMerchant && nameMatchMerchant && mccRecord && nameMatchMerchant.category !== mccRecord.category) {
      if (
        nameMatchMerchant.isMultiCategory &&
        nameMatchMerchant.allowedCategories?.includes(mccRecord.category)
      ) {
        // Multi-category merchant
      } else {
        conflicts.push(
          `Conflict: Merchant name '${nameMatchMerchant.originalName}' indicates category '${nameMatchMerchant.category}', but MCC ${mccRecord.code} indicates category '${mccRecord.category}'.`
        );
      }
    }

    // Detect signal conflicts between verified identifier and name-matched merchant
    if (verifiedMerchant && nameMatchMerchant && verifiedMerchant.category !== nameMatchMerchant.category) {
      if (
        !verifiedMerchant.isMultiCategory &&
        !nameMatchMerchant.isMultiCategory
      ) {
        conflicts.push(
          `Conflict: Verified identifier indicates '${verifiedMerchant.category}', but merchant name indicates '${nameMatchMerchant.category}'.`
        );
      }
    }

    // Aggregate candidate categories across all detected signals
    const candidateCategories = new Set<SpendingCategory>();
    if (verifiedMerchant) candidateCategories.add(verifiedMerchant.category);
    if (mccRecord) candidateCategories.add(mccRecord.category);
    if (nameMatchMerchant) candidateCategories.add(nameMatchMerchant.category);
    if (userHistoryRecord && !userHistoryRecord.isAmbiguousPersonalVpa) {
      candidateCategories.add(userHistoryRecord.assignedCategory);
    }

    // Build evidence map per candidate category
    const detectedCandidateCategories = new Map<
      SpendingCategory,
      {
        signals: SignalStrength;
        availability: SignalAvailability;
        supportingSignals: Array<'VERIFIED_IDENTIFIER' | 'MCC' | 'NAME' | 'HISTORY'>;
      }
    >();

    const hasVerifiedSignal = Boolean(verifiedMerchant);
    const hasMccSignal = Boolean(mccRecord);
    const hasNameSignal = Boolean(nameMatchMerchant);
    const hasHistorySignal = Boolean(userHistoryRecord && !userHistoryRecord.isAmbiguousPersonalVpa);

    for (const cat of candidateCategories) {
      const supporting: Array<'VERIFIED_IDENTIFIER' | 'MCC' | 'NAME' | 'HISTORY'> = [];

      // S_I: Verified Identifier Strength
      let sI = 0;
      if (verifiedMerchant) {
        if (verifiedMerchant.category === cat) {
          sI = 1.0;
          supporting.push('VERIFIED_IDENTIFIER');
        } else if (verifiedMerchant.allowedCategories?.includes(cat)) {
          sI = 0.8;
          supporting.push('VERIFIED_IDENTIFIER');
        }
      }

      // S_M: MCC Match Strength
      let sM = 0;
      if (mccRecord) {
        if (mccRecord.category === cat) {
          sM = mccRecord.isBroad ? 0.7 : 1.0;
          supporting.push('MCC');
        } else if (mccRecord.alternativeCategories?.includes(cat)) {
          sM = 0.5;
          supporting.push('MCC');
        }
      }

      // S_N: Name Match Strength
      let sN = 0;
      if (nameMatchMerchant && nameMatchMerchant.category === cat) {
        sN = nameMatchStrength;
        supporting.push('NAME');
      }

      // S_H: History Match Strength
      let sH = 0;
      if (userHistoryRecord && userHistoryRecord.assignedCategory === cat) {
        sH = 1.0;
        supporting.push('HISTORY');
      }

      const isUserConfirmedCat = Boolean(
        userHistoryRecord && userHistoryRecord.assignedCategory === cat && !verifiedMerchant
      );

      detectedCandidateCategories.set(cat, {
        signals: {
          verifiedIdentifierStrength: sI,
          mccStrength: sM,
          nameMatchStrength: sN,
          historyStrength: sH,
        },
        availability: {
          hasVerifiedIdentifier: hasVerifiedSignal,
          hasMcc: isUserConfirmedCat ? false : hasMccSignal,
          hasNameMatch: isUserConfirmedCat ? false : hasNameSignal,
          hasHistory: hasHistorySignal,
        },
        supportingSignals: supporting,
      });
    }

    return {
      verifiedMerchant,
      mccRecord,
      nameMatchMerchant,
      nameMatchStrength,
      userHistoryRecord,
      detectedCandidateCategories,
      conflicts,
    };
  }
}
