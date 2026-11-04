import { prisma } from '../../config/database.js';
import { CreateAccountInput } from './account.schema.js';
import { NotFoundError } from '../../shared/errors/index.js';

export class AccountService {
  static async listUserAccounts(userId: string) {
    return prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createAccount(userId: string, input: CreateAccountInput) {
    return prisma.account.create({
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
  }

  static async disconnectAccount(userId: string, accountId: string) {
    const account = await prisma.account.findFirst({
      where: { id: accountId, userId },
    });

    if (!account) {
      throw new NotFoundError('Bank account not found');
    }

    return prisma.account.update({
      where: { id: accountId },
      data: { isConnected: false },
    });
  }
}

