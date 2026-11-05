import { Request, Response, NextFunction } from 'express';
import { AAService } from '../services/aa.service.js';
import { AACallbackHandler } from '../callbacks/callback-handler.js';
import { AuthenticatedRequest } from '../../../shared/types/index.js';
import { sendSuccess } from '../../../shared/utils/response.js';

export class AAController {
  static getProviders(_req: Request, res: Response, next: NextFunction) {
    try {
      const providers = AAService.getSupportedProviders();
      return sendSuccess(res, providers, 'Supported AA providers retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async initiateConnection(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { providerId, redirectCallbackUrl } = req.body;
      const result = await AAService.initiateConnection(req.user!.id, providerId, redirectCallbackUrl);
      return sendSuccess(res, result, 'AA connection session initiated', 201);
    } catch (error) {
      next(error);
    }
  }

  static async listConnections(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const connections = await AAService.listUserConnections(req.user!.id);
      return sendSuccess(res, connections, 'User AA connections retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getConnectionStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await AAService.getConnectionStatus(req.user!.id, req.params.id as string);
      return sendSuccess(res, result, 'Connection status retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async handleCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AACallbackHandler.processCallback({
        headers: req.headers,
        body: req.body,
      });
      return sendSuccess(res, result, 'AA callback processed successfully');
    } catch (error) {
      next(error);
    }
  }
}
