import { ExtractedMerchantInfo, RawTransactionInput } from '../types/index.js';
import { extractKeywords, normalizeText, normalizeUpiId } from '../utils/normalization.utils.js';

export class MerchantNormalizationService {
  /**
   * Extracts, parses, and normalizes merchant metadata from heterogeneous transaction inputs
   * Preserves both raw and normalized values for full auditing provenance.
   */
  static extractAndNormalize(input: RawTransactionInput): ExtractedMerchantInfo {
    const rawMerchantName = input.merchantName?.trim() || undefined;
    const rawUpiId = input.upiId?.trim() || undefined;
    const rawUpiHolderName = input.upiHolderName?.trim() || undefined;

    // 1. Normalize UPI VPA
    const upiParsed = normalizeUpiId(rawUpiId);

    // 2. Derive merchant candidate text if rawMerchantName is missing but bank description exists
    let effectiveMerchantName = rawMerchantName;
    if (!effectiveMerchantName && input.bankDescription) {
      effectiveMerchantName = this.extractMerchantFromBankNarration(input.bankDescription);
    }
    if (!effectiveMerchantName && upiParsed.handle) {
      // If no name is provided, use clean UPI handle as fallback candidate
      effectiveMerchantName = upiParsed.handle.replace(/[-_.]/g, ' ');
    }

    // 3. Normalize Name and Holder Name
    const normalizedMerchantName = normalizeText(effectiveMerchantName);
    const normalizedUpiHolderName = normalizeText(rawUpiHolderName);

    // 4. Extract Keywords
    const extractedKeywords = extractKeywords(normalizedMerchantName);

    // 5. Normalize MCC
    let normalizedMcc: string | undefined = undefined;
    if (input.mcc) {
      normalizedMcc = String(input.mcc).trim().padStart(4, '0');
    }

    return {
      rawMerchantName,
      normalizedMerchantName: normalizedMerchantName || undefined,
      extractedKeywords,
      rawUpiId,
      normalizedUpiId: upiParsed.normalized,
      upiHandlePrefix: upiParsed.handle,
      upiProviderDomain: upiParsed.domain,
      rawUpiHolderName,
      normalizedUpiHolderName: normalizedUpiHolderName || undefined,
      merchantIdentifier: input.merchantId?.trim() || undefined,
      mcc: normalizedMcc,
      bankDescription: input.bankDescription?.trim() || undefined,
      transactionReference: input.transactionRef?.trim() || undefined,
      paymentSource: input.paymentSource || 'UPI',
      isConfirmedPayment: Boolean(input.isConfirmedPayment),
      userId: input.userId,
    };
  }

  /**
   * Parses common Indian bank narration formats
   * Example: "UPI/4234234/APOLLO PHARMACY/apollo@upi" -> "APOLLO PHARMACY"
   * Example: "POS 4324 SWIGGY BANGALORE" -> "SWIGGY BANGALORE"
   */
  private static extractMerchantFromBankNarration(narration: string): string | undefined {
    if (!narration) return undefined;

    const parts = narration.split('/');
    if (parts.length >= 3 && parts[0].toUpperCase().includes('UPI')) {
      // Typically: UPI / RRN / MerchantName / VPA
      const candidate = parts[2].trim();
      if (candidate.length > 2) return candidate;
    }

    const posMatch = narration.match(/POS\s+\d*\s*([A-Za-z0-9\s]+)/i);
    if (posMatch && posMatch[1]) {
      return posMatch[1].trim();
    }

    return narration.trim();
  }
}

