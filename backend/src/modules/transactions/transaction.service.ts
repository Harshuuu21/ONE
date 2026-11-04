import { prisma } from '../../config/database.js';
import { CreateTransactionInput } from './transaction.schema.js';

export class TransactionService {
  static async listUserTransactions(userId: string) {
    return prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 100,
    });
  }

  static async createTransaction(userId: string, input: CreateTransactionInput) {
    return prisma.transaction.create({
      data: {
        userId,
        accountId: input.accountId,
        title: input.title,
        amount: input.amount,
        category: input.category,
        type: input.type,
        date: input.date ? new Date(input.date) : new Date(),
        note: input.note,
      },
    });
  }
}

