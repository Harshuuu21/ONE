import { Response, NextFunction } from 'express';
import { TransactionService } from './transaction.service.js';
import { AuthenticatedRequest } from '../../shared/types/index.js';
import { sendSuccess } from '../../shared/utils/response.js';

export class TransactionController {
  static async listTransactions(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const transactions = await TransactionService.listUserTransactions(req.user!.id);
      return sendSuccess(res, transactions, 'Transactions fetched');
    } catch (error) {
      next(error);
    }
  }

  static async createTransaction(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const transaction = await TransactionService.createTransaction(req.user!.id, req.body);
      return sendSuccess(res, transaction, 'Transaction created', 201);
    } catch (error) {
      next(error);
    }
  }

  static async getAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const analytics = await TransactionService.getSpendingAnalytics(req.user!.id);
      return sendSuccess(res, analytics, 'Spending analytics calculated');
    } catch (error) {
      next(error);
    }
  }

  static async syncBankTransactions(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await TransactionService.syncBankTransactions(req.user!.id, req.body.transactions || []);
      return sendSuccess(res, result, 'Bank transactions synchronized successfully');
    } catch (error) {
      next(error);
    }
  }
}
