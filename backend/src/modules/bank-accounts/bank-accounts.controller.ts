import { Response, NextFunction } from 'express';
import { BankAccountsService } from './bank-accounts.service.js';
import { AuthenticatedRequest } from '../../shared/types/index.js';
import { sendSuccess } from '../../shared/utils/response.js';

export class BankAccountsController {
  static async discoverAccounts(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { providerId, correlationId } = req.body;
      const accounts = await BankAccountsService.discoverAccounts(req.user!.id, providerId, correlationId);
      return sendSuccess(res, accounts, 'Discovered bank accounts');
    } catch (error) {
      next(error);
    }
  }

  static async linkAccounts(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await BankAccountsService.linkAccounts(req.user!.id, req.body);
      return sendSuccess(res, result, 'Selected accounts linked successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async listLinkedAccounts(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await BankAccountsService.listLinkedAccounts(req.user!.id);
      return sendSuccess(res, result, 'Linked accounts retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async delinkAccount(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await BankAccountsService.delinkAccount(req.user!.id, req.params.id as string);
      return sendSuccess(res, result, 'Account delinked successfully');
    } catch (error) {
      next(error);
    }
  }
}
