import { Response, NextFunction } from 'express';
import { DemoDataService } from './demo-data.service.js';
import { AuthenticatedRequest } from '../../shared/types/index.js';
import { sendSuccess } from '../../shared/utils/response.js';
import { UserPersona } from './demo-data.types.js';

export class DemoDataController {
  /**
   * POST /api/demo-data/initialize
   * Generates or retrieves existing demo dataset for the user.
   */
  static async initialize(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { persona, force } = req.body || {};
      const summary = await DemoDataService.initializeDemoData(
        userId,
        persona as UserPersona,
        Boolean(force)
      );
      return sendSuccess(res, summary, 'Demo data initialized successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/demo-data/status
   * Checks whether the user has active demo data and returns record counts.
   */
  static async getStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const status = await DemoDataService.getDemoDataStatus(userId);
      return sendSuccess(res, status, 'Demo data status fetched');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/demo-data/summary
   * Provides full financial metrics, goals, loans, and recent transactions.
   */
  static async getSummary(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const summary = await DemoDataService.getDemoDataSummary(userId);
      return sendSuccess(res, summary, 'Demo data summary fetched');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/demo-data/reset
   * Purges only records where isDemo = true and generates a fresh dataset.
   */
  static async reset(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { persona } = req.body || {};
      const summary = await DemoDataService.resetDemoData(userId, persona as UserPersona);
      return sendSuccess(res, summary, 'Demo data reset and regenerated successfully');
    } catch (error) {
      next(error);
    }
  }
}

