import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../shared/types/index.js';
import { sendSuccess } from '../../../shared/utils/response.js';
import { CategorizationService } from '../services/categorization.service.js';

export class CategorizationController {
  /**
   * GET /api/categorization/categories
   * Returns all active spending categories and their display metadata
   */
  static async listCategories(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const categories = CategorizationService.listCategories();
      return sendSuccess(res, categories, 'Categories fetched successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/categorization/classify
   * Categorizes a single transaction payload
   */
  static async classify(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { persistToDb, ...txInput } = req.body;
      const result = await CategorizationService.classifyTransaction(
        { ...txInput, userId },
        Boolean(persistToDb)
      );
      return sendSuccess(res, result, 'Transaction categorized successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/categorization/batch-classify
   * Categorizes a batch of transactions
   */
  static async batchClassify(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { transactions, persistToDb } = req.body;
      const inputs = transactions.map((t: any) => ({ ...t, userId }));
      const results = await CategorizationService.batchClassifyTransactions(
        inputs,
        Boolean(persistToDb)
      );
      return sendSuccess(res, results, 'Batch transactions categorized successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/categorization/override
   * Manually overrides a transaction category and records user-specific merchant history
   */
  static async overrideCategory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { transactionId, category, merchantKey } = req.body;
      const result = await CategorizationService.overrideCategory(
        userId,
        transactionId,
        category,
        merchantKey
      );
      return sendSuccess(res, result, 'Transaction category overridden successfully');
    } catch (error) {
      next(error);
    }
  }
}
