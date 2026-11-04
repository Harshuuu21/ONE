import { Response, NextFunction } from 'express';
import { GoalService } from './goal.service.js';
import { AuthenticatedRequest } from '../../shared/types/index.js';
import { sendSuccess } from '../../shared/utils/response.js';

export class GoalController {
  static async listGoals(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const goals = await GoalService.listUserGoals(req.user!.id);
      return sendSuccess(res, goals, 'Goals retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async createGoal(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const goal = await GoalService.createGoal(req.user!.id, req.body);
      return sendSuccess(res, goal, 'Goal created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateGoal(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const goal = await GoalService.updateGoal(req.user!.id, req.params.id as string, req.body);
      return sendSuccess(res, goal, 'Goal updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteGoal(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await GoalService.deleteGoal(req.user!.id, req.params.id as string);
      return sendSuccess(res, null, 'Goal deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
