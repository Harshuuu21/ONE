import { GLOBAL_VERIFIED_MERCHANTS } from '../rules/merchant-rules.js';
import {
  SpendingCategory,
  UserMerchantMappingRecord,
  VerifiedMerchantRecord,
} from '../types/index.js';

export class MerchantRepository {
  private static verifiedRegistry: Map<string, VerifiedMerchantRecord> = new Map();
  private static upiIndex: Map<string, VerifiedMerchantRecord> = new Map();
  private static userMappings: Map<string, UserMerchantMappingRecord> = new Map(); // key: `${userId}:${merchantKey}`

  // Static initializer loading global directory
  static {
    for (const merchant of GLOBAL_VERIFIED_MERCHANTS) {
      this.addVerifiedMerchant(merchant);
    }
  }

  /**
   * Adds or updates a verified merchant record in the global repository
   */
  static addVerifiedMerchant(record: VerifiedMerchantRecord) {
    this.verifiedRegistry.set(record.merchantIdentifier.toUpperCase(), record);
    this.verifiedRegistry.set(record.id.toLowerCase(), record);

    for (const upi of record.upiIds) {
      this.upiIndex.set(upi.toLowerCase(), record);
    }
  }

  /**
   * Finds verified merchant by exact UPI VPA
   */
  static findVerifiedByUpi(upiId: string | undefined): VerifiedMerchantRecord | null {
    if (!upiId) return null;
    return this.upiIndex.get(upiId.toLowerCase().trim()) || null;
  }

  /**
   * Finds verified merchant by merchant identifier
   */
  static findVerifiedById(merchantId: string | undefined): VerifiedMerchantRecord | null {
    if (!merchantId) return null;
    return (
      this.verifiedRegistry.get(merchantId.toUpperCase().trim()) ||
      this.verifiedRegistry.get(merchantId.toLowerCase().trim()) ||
      null
    );
  }

  /**
   * Finds verified merchant by exact normalized name, aliases, or multi-word phrase containment
   */
  static findVerifiedByName(normalizedName: string | undefined): {
    merchant: VerifiedMerchantRecord;
    strength: number;
  } | null {
    if (!normalizedName) return null;
    const clean = normalizedName.toLowerCase().trim();

    // 1. Exact match against normalized name or aliases (Strength = 1.0)
    for (const merchant of this.verifiedRegistry.values()) {
      if (merchant.normalizedName === clean) {
        return { merchant, strength: 1.0 };
      }
      if (merchant.aliases.some((alias) => alias.toLowerCase() === clean)) {
        return { merchant, strength: 1.0 };
      }
    }

    // 2. Phrase containment: check if input contains full brand alias or primary name with word boundaries (Strength = 0.95)
    for (const merchant of this.verifiedRegistry.values()) {
      for (const alias of merchant.aliases) {
        const cleanAlias = alias.toLowerCase().trim();
        if (cleanAlias.length >= 4) {
          const escaped = cleanAlias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(`\\b${escaped}\\b`, 'i');
          if (regex.test(clean)) {
            return { merchant, strength: 0.95 };
          }
        }
      }

      const primaryName = merchant.normalizedName.toLowerCase().trim();
      if (primaryName.length >= 4) {
        const escaped = primaryName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped}\\b`, 'i');
        if (regex.test(clean)) {
          return { merchant, strength: 0.95 };
        }
      }
    }

    return null;
  }

  /**
   * Finds verified merchants matching token keywords
   */
  static searchVerifiedByKeywords(keywords: string[]): Array<{
    merchant: VerifiedMerchantRecord;
    matchedKeywords: string[];
    matchScore: number;
  }> {
    if (!keywords || keywords.length === 0) return [];

    const results: Array<{
      merchant: VerifiedMerchantRecord;
      matchedKeywords: string[];
      matchScore: number;
    }> = [];

    const seenIds = new Set<string>();

    for (const merchant of this.verifiedRegistry.values()) {
      if (seenIds.has(merchant.id)) continue;

      const merchantWords = `${merchant.normalizedName} ${merchant.aliases.join(' ')}`.toLowerCase();
      const matched: string[] = [];

      for (const kw of keywords) {
        if (merchantWords.includes(kw.toLowerCase())) {
          matched.push(kw);
        }
      }

      if (matched.length > 0) {
        seenIds.add(merchant.id);
        const matchScore = matched.length / Math.max(1, keywords.length);
        results.push({
          merchant,
          matchedKeywords: matched,
          matchScore,
        });
      }
    }

    return results.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Retrieves user-confirmed merchant-to-category history mapping
   */
  static findUserConfirmedMapping(
    userId: string | undefined,
    merchantKey: string | undefined
  ): UserMerchantMappingRecord | null {
    if (!userId || !merchantKey) return null;
    const key = `${userId.toLowerCase()}:${merchantKey.toLowerCase().trim()}`;
    return this.userMappings.get(key) || null;
  }

  /**
   * Records a user-confirmed merchant mapping
   */
  static saveUserConfirmedMapping(
    userId: string,
    merchantKey: string,
    category: SpendingCategory,
    isAmbiguousPersonalVpa = false
  ): UserMerchantMappingRecord {
    const key = `${userId.toLowerCase()}:${merchantKey.toLowerCase().trim()}`;
    const existing = this.userMappings.get(key);

    const record: UserMerchantMappingRecord = {
      id: existing?.id || `user_map_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      merchantKey: merchantKey.toLowerCase().trim(),
      assignedCategory: category,
      confirmationCount: (existing?.confirmationCount || 0) + 1,
      lastConfirmedAt: new Date().toISOString(),
      isAmbiguousPersonalVpa,
    };

    this.userMappings.set(key, record);
    return record;
  }
}
