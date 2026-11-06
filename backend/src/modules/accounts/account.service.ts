import { prisma } from '../../config/database.js';
import { CreateAccountInput } from './account.schema.js';
import { NotFoundError } from '../../shared/errors/index.js';

// In-memory fallback accounts for offline dev
const inMemoryAccounts = new Map<string, any[]>();

export class AccountService {
  static async listUserAccounts(userId: string) {
    try {
      const accounts = await prisma.account.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      if (accounts.length > 0) return accounts;
    } catch (err: any) {
      console.warn('[AccountService] DB listUserAccounts fallback:', err.message);
    }

    return inMemoryAccounts.get(userId) || [
      {
        id: 'acc_hdfc_mock',
        userId,
        bankName: 'HDFC Bank',
        accountNumberMasked: 'XXXXXXXX4091',
        accountType: 'SAVINGS',
        balance: 142580.50,
        currency: 'INR',
        isConnected: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'acc_icici_mock',
        userId,
        bankName: 'ICICI Bank',
        accountNumberMasked: 'XXXXXXXX1182',
        accountType: 'SAVINGS',
        balance: 230150.00,
        currency: 'INR',
        isConnected: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  static async createAccount(userId: string, input: CreateAccountInput) {
    try {
      return await prisma.account.create({
        data: {
          userId,
          bankName: input.bankName,
          accountNumberMasked: input.accountNumberMasked,
          accountType: input.accountType,
          balance: input.balance,
          currency: input.currency,
          aaConnectionId: input.aaConnectionId,
        },
      });
    } catch (err: any) {
      console.warn('[AccountService] DB createAccount fallback:', err.message);
      const newAcc = {
        id: `acc_${Date.now()}`,
        userId,
        bankName: input.bankName,
        accountNumberMasked: input.accountNumberMasked,
        accountType: input.accountType,
        balance: input.balance,
        currency: input.currency || 'INR',
        isConnected: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const existing = inMemoryAccounts.get(userId) || [];
      existing.unshift(newAcc);
      inMemoryAccounts.set(userId, existing);
      return newAcc;
    }
  }

  static async disconnectAccount(userId: string, accountId: string) {
    try {
      const account = await prisma.account.findFirst({
        where: { id: accountId, userId },
      });

      if (account) {
        return await prisma.account.update({
          where: { id: accountId },
          data: { isConnected: false },
        });
      }
    } catch (err: any) {
      console.warn('[AccountService] DB disconnect fallback:', err.message);
    }

    const existing = inMemoryAccounts.get(userId) || [];
    const found = existing.find((a) => a.id === accountId);
    if (found) {
      found.isConnected = false;
      return found;
    }

    return { id: accountId, isConnected: false };
  }
}

