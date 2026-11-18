import { prisma } from '../../../config/database.js';
import {
  ClassificationResult,
  RawTransactionInput,
  SpendingCategory,
  SpendingCategoryConfig,
} from '../types/index.js';
import { ORDERED_CATEGORIES, SPENDING_CATEGORIES } from '../rules/category-rules.js';
import { TransactionClassificationService } from './transaction-classification.service.js';
import { MerchantRepository } from '../repositories/merchant.repository.js';

export class CategorizationService {
  /**
   * Returns all active spending categories and their metadata
   */
  static listCategories(): SpendingCategoryConfig[] {
    return ORDERED_CATEGORIES.filter((c) => c.isActive);
  }

  /**
   * Classifies a single confirmed transaction
   */
  static async classifyTransaction(
    input: RawTransactionInput,
    persistToDb = false
  ): Promise<ClassificationResult> {
    const result = TransactionClassificationService.classify(input);

    // Persist category update to database if transactionId exists and persistToDb is true
    if (persistToDb && input.transactionId) {
      try {
        await prisma.transaction.update({
          where: { id: input.transactionId },
          data: {
            category: result.finalCategory,
          },
        });
      } catch (err: any) {
        console.warn(
          `[CategorizationService] DB update warning for tx ${input.transactionId}:`,
          err.message
        );
      }
    }

    return result;
  }

  /**
   * Batch categorizes multiple transactions
   */
  static async batchClassifyTransactions(
    inputs: RawTransactionInput[],
    persistToDb = false
  ): Promise<ClassificationResult[]> {
    return Promise.all(inputs.map((input) => this.classifyTransaction(input, persistToDb)));
  }

  /**
   * Handles user manual correction of a transaction category
   * Updates transaction and records user-confirmed merchant mapping for future learning.
   */
  static async overrideCategory(
    userId: string,
    transactionId: string,
    newCategory: SpendingCategory,
    merchantKey?: string
  ): Promise<{ success: boolean; updatedCategory: SpendingCategory }> {
    // 1. Update in Database
    try {
      await prisma.transaction.update({
        where: { id: transactionId },
        data: { category: newCategory },
      });
    } catch (err: any) {
      console.warn(`[CategorizationService] DB override warning:`, err.message);
    }

    // 2. Save confirmed mapping for this user's merchant history
    if (merchantKey) {
      // Check if key is a personal mobile UPI ID e.g. 9876543210@paytm
      const isPersonal = /^\d{10}@/.test(merchantKey);
      MerchantRepository.saveUserConfirmedMapping(userId, merchantKey, newCategory, isPersonal);
    }

    return {
      success: true,
      updatedCategory: newCategory,
    };
  }
}
