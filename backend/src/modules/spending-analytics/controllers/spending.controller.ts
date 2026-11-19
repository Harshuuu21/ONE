import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../shared/types/index.js';
import { sendSuccess } from '../../../shared/utils/response.js';
import { SpendingAnalyticsService } from '../services/spending-analytics.service.js';
import { PeriodFilter } from '../spending-analytics.types.js';

export class SpendingController {
  /**
   * GET /api/spending/categories
   * Returns all 14 active spending categories with color codes and Lucide icon names
   */
  static async listCategories(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const categories = SpendingAnalyticsService.getCategoryList();
      return sendSuccess(res, categories, 'Categories fetched successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/spending/distribution
   * Returns category-wise net spend (S_c), total net spend (S_T), and percentages (P_c)
   */
  static async getDistribution(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { period, startDate, endDate } = req.query as {
        period?: PeriodFilter;
        startDate?: string;
        endDate?: string;
      };

      const result = await SpendingAnalyticsService.getCategoryDistribution(
        userId,
        period,
        startDate,
        endDate
      );

      return sendSuccess(res, result, 'Spending distribution computed successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/spending/summary
   * Returns financial period summary: total spend, income, savings, savings rate, and top category
   */
  static async getSummary(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { period, startDate, endDate } = req.query as {
        period?: PeriodFilter;
        startDate?: string;
        endDate?: string;
      };

      const result = await SpendingAnalyticsService.getSpendingSummary(
        userId,
        period,
        startDate,
        endDate
      );

      return sendSuccess(res, result, 'Spending summary computed successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/spending/transactions
   * Returns paginated spending transactions for a period and optional category
   */
  static async getTransactions(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { period, category, startDate, endDate, limit, offset } = req.query as any;

      const result = await SpendingAnalyticsService.getSpendingTransactions(userId, {
        period,
        category,
        customStart: startDate,
        customEnd: endDate,
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
      });

      return sendSuccess(res, result, 'Spending transactions retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/spending/transactions/:id/category
   * User manual category correction with audit provenance and optional merchant learning
   */
  static async correctCategory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const transactionId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { newCategory, rememberMerchantMapping } = req.body;

      const result = await SpendingAnalyticsService.correctTransactionCategory(
        userId,
        transactionId,
        {
          newCategory,
          rememberMerchantMapping: Boolean(rememberMerchantMapping),
        }
      );

      return sendSuccess(res, result, result.message);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/spending/merchant/:id
   * Returns merchant metadata and user's confirmed category preference if mapped
   */
  static async getMerchantDetails(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const merchantId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      const details = await SpendingAnalyticsService.getMerchantDetails(userId, merchantId);
      return sendSuccess(res, details, 'Merchant details retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/spending/merchant-mappings
   * Returns user-specific merchant learned mappings
   */
  static async listMerchantMappings(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const mappings = await SpendingAnalyticsService.listMerchantMappings(userId);
      return sendSuccess(res, mappings, 'User merchant mappings retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/spending/merchant-mappings
   * Manually creates a user-specific merchant mapping
   */
  static async createMerchantMapping(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { merchantKey, category, merchantIdentifier } = req.body;

      const created = await SpendingAnalyticsService.createMerchantMapping(userId, {
        merchantKey,
        category,
        merchantIdentifier,
      });

      return sendSuccess(res, created, 'Merchant mapping saved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/spending/merchant-mappings/:id
   * Removes a user-specific merchant mapping rule
   */
  static async deleteMerchantMapping(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const mappingId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      const deleted = await SpendingAnalyticsService.deleteMerchantMapping(userId, mappingId);
      return sendSuccess(res, { deleted }, 'Merchant mapping deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
