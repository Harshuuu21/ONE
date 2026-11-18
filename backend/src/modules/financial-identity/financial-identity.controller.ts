import { Response, NextFunction } from 'express';
import { FinancialIdentityService } from './financial-identity.service.js';
import { AuthenticatedRequest } from '../../shared/types/index.js';
import { sendSuccess } from '../../shared/utils/response.js';

export class FinancialIdentityController {
  /**
   * GET /api/financial-identity/profile
   * Returns current user's financial profile
   */
  static async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const profile = await FinancialIdentityService.getProfile(userId);
      return sendSuccess(res, profile, 'Financial profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/financial-identity/profile
   * Updates partial profile attributes during onboarding wizard steps
   */
  static async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const updated = await FinancialIdentityService.updateProfile(userId, req.body);
      return sendSuccess(res, updated, 'Financial profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/financial-identity/complete
   * Finalizes financial profile onboarding, computes identity score, triggers personalized demo data
   */
  static async completeOnboarding(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const result = await FinancialIdentityService.completeOnboarding(userId, req.body);
      return sendSuccess(res, result, 'Financial onboarding completed successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/financial-identity/recommendations
   * Returns goal feasibility allocations, community recommendations, insights, and educational content
   */
  static async getRecommendations(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const recommendations = await FinancialIdentityService.getRecommendations(userId);
      return sendSuccess(res, recommendations, 'Recommendations retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

