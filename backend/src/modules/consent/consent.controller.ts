import { Request, Response, NextFunction } from 'express';
import { ConsentService } from './consent.service.js';
import { AuthenticatedRequest } from '../../shared/types/index.js';
import { sendSuccess } from '../../shared/utils/response.js';

export class ConsentController {
  static async requestConsent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await ConsentService.requestConsent(req.user!.id, req.body);
      return sendSuccess(res, result, 'Consent request created', 201);
    } catch (error) {
      next(error);
    }
  }

  static async listConsents(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const consents = await ConsentService.listUserConsents(req.user!.id);
      return sendSuccess(res, consents, 'Consents retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getConsent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const consent = await ConsentService.getConsent(req.user!.id, req.params.id as string);
      return sendSuccess(res, consent, 'Consent details retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async revokeConsent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await ConsentService.revokeConsent(req.user!.id, req.params.id as string, req.body?.reason);
      return sendSuccess(res, result, 'Consent revoked');
    } catch (error) {
      next(error);
    }
  }

  static async handleCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ConsentService.handleCallback(req.headers, req.body);
      return sendSuccess(res, result, 'Consent callback processed');
    } catch (error) {
      next(error);
    }
  }
}
