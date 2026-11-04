import { Request, Response, NextFunction } from 'express';
import { CommunityService } from './community.service.js';
import { AuthenticatedRequest } from '../../shared/types/index.js';
import { sendSuccess } from '../../shared/utils/response.js';

export class CommunityController {
  static async listPoolRequests(_req: Request, res: Response, next: NextFunction) {
    try {
      const requests = await CommunityService.listPoolRequests();
      return sendSuccess(res, requests, 'Community pool requests retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async createRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const request = await CommunityService.createRequest(req.user!.id, req.body);
      return sendSuccess(res, request, 'Lending request created', 201);
    } catch (error) {
      next(error);
    }
  }

  static async contribute(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await CommunityService.contribute(req.params.id as string, req.body);
      return sendSuccess(res, updated, 'Contribution recorded');
    } catch (error) {
      next(error);
    }
  }
}
