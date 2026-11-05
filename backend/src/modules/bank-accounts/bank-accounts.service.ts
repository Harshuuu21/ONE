import { prisma } from '../../config/database.js';
import { AAProviderFactory } from '../account-aggregator/adapters/providers/provider.factory.js';
import { LinkAccountsInput } from './bank-accounts.schema.js';
import { NotFoundError, BadRequestError } from '../../shared/errors/index.js';
import { LinkedAccountStatus } from '@prisma/client';

export class BankAccountsService {
  /**
   * Discovers financial accounts across supported FIPs using the AA provider
   */
  static async discoverAccounts(userId: string, providerId = 'SAHAMATI_MOCK', correlationId?: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (!user.mobileNumber) {
      throw new BadRequestError('User mobile number must be verified for bank account discovery');
    }

    const provider = AAProviderFactory.getProvider(providerId);

    // Call provider account discovery
    const accounts = await provider.discoverAccounts({
      userMobile: user.mobileNumber,
      correlationId,
    });

    // Check which accounts are already linked
    const existingLinked = await prisma.linkedBankAccount.findMany({
      where: {
        userId,
        status: LinkedAccountStatus.LINKED,
      },
      select: {
        fipId: true,
        accountNumberMasked: true,
      },
    });

    const linkedSet = new Set(existingLinked.map((a) => `${a.fipId}_${a.accountNumberMasked}`));

    return accounts.map((acc) => ({
      ...acc,
      isAlreadyLinked: linkedSet.has(`${acc.fipId}_${acc.accountNumberMasked}`),
    }));
  }

  /**
   * Links multiple selected bank accounts to the ONE user
   */
  static async linkAccounts(userId: string, input: LinkAccountsInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Resolve or find AA connection
    let aaConnectionId = input.aaConnectionId;
    if (!aaConnectionId) {
      const conn = await prisma.aaConnection.findFirst({
        where: { userId, providerId: input.providerId },
      });
      if (conn) {
        aaConnectionId = conn.id;
      }
    }

    const linkedResults = [];

    for (const acc of input.accounts) {
      // Upsert linked bank account
      const linked = await prisma.linkedBankAccount.upsert({
        where: {
          userId_fipId_accountNumberMasked: {
            userId,
            fipId: acc.fipId,
            accountNumberMasked: acc.accountNumberMasked,
          },
        },
        create: {
          userId,
          aaConnectionId: aaConnectionId || null,
          fipId: acc.fipId,
          bankName: acc.bankName,
          bankLogoUrl: acc.bankLogoUrl || null,
          accountType: acc.accountType,
          accountNumberMasked: acc.accountNumberMasked,
          accountRefNumber: acc.accountRefNumber,
          balance: acc.balance || 0,
          status: LinkedAccountStatus.LINKED,
          lastSyncedAt: new Date(),
        },
        update: {
          aaConnectionId: aaConnectionId || undefined,
          balance: acc.balance !== undefined ? acc.balance : undefined,
          status: LinkedAccountStatus.LINKED,
          lastSyncedAt: new Date(),
        },
      });

      // Synchronize with Account model so all existing balance views update
      await prisma.account.create({
        data: {
          userId,
          bankName: acc.bankName,
          accountNumberMasked: acc.accountNumberMasked,
          accountType: acc.accountType as any,
          balance: acc.balance || 0,
          isConnected: true,
          aaConnectionId: aaConnectionId || null,
        },
      }).catch(() => {
        // Ignore duplicate in legacy Account
      });

      linkedResults.push(linked);
    }

    return {
      linkedCount: linkedResults.length,
      accounts: linkedResults,
    };
  }

  /**
   * Retrieves all active linked accounts for the user
   */
  static async listLinkedAccounts(userId: string) {
    const linked = await prisma.linkedBankAccount.findMany({
      where: {
        userId,
        status: LinkedAccountStatus.LINKED,
      },
      include: {
        aaConnection: {
          select: {
            id: true,
            providerName: true,
            providerId: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalBalance = linked.reduce((sum, acc) => sum + Number(acc.balance), 0);

    return {
      totalBalance,
      accountsCount: linked.length,
      accounts: linked,
    };
  }

  /**
   * De-links a bank account
   */
  static async delinkAccount(userId: string, accountId: string) {
    const account = await prisma.linkedBankAccount.findFirst({
      where: { id: accountId, userId },
    });

    if (!account) {
      throw new NotFoundError('Linked bank account not found');
    }

    const updated = await prisma.linkedBankAccount.update({
      where: { id: accountId },
      data: { status: LinkedAccountStatus.DELINKED },
    });

    return {
      success: true,
      delinkedAccount: updated,
    };
  }
}
