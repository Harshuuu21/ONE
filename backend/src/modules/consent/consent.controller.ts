import { Response, NextFunction } from 'express';
import { ConsentService } from './consent.service.js';
import { AuthenticatedRequest } from '../../shared/types/index.js';
import { sendSuccess } from '../../shared/utils/response.js';

export class ConsentController {
  static async listConsents(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const consents = await ConsentService.listUserConsents(req.user!.id);
      return sendSuccess(res, consents, 'Consents retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async grantConsent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const consent = await ConsentService.grantConsent(req.user!.id, req.body);
      return sendSuccess(res, consent, 'Consent registered successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateConsentStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await ConsentService.updateConsentStatus(req.user!.id, req.params.id as string, req.body);
      return sendSuccess(res, updated, 'Consent status updated');
    } catch (error) {
      next(error);
    }
  }
}
