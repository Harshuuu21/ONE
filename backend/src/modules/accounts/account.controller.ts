import { Response, NextFunction } from 'express';
import { AccountService } from './account.service.js';
import { AuthenticatedRequest } from '../../shared/types/index.js';
import { sendSuccess } from '../../shared/utils/response.js';

export class AccountController {
  static async listAccounts(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const accounts = await AccountService.listUserAccounts(req.user!.id);
      return sendSuccess(res, accounts, 'Accounts retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async createAccount(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const account = await AccountService.createAccount(req.user!.id, req.body);
      return sendSuccess(res, account, 'Account linked successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async disconnectAccount(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const account = await AccountService.disconnectAccount(req.user!.id, req.params.id as string);
      return sendSuccess(res, account, 'Account disconnected');
    } catch (error) {
      next(error);
    }
  }
}
