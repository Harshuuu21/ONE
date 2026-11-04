import { prisma } from '../../config/database.js';
import { CreateLendingRequestInput, ContributeLendingInput } from './community.schema.js';
import { NotFoundError, BadRequestError } from '../../shared/errors/index.js';

export class CommunityService {
  static async listPoolRequests() {
    return prisma.lendingRequest.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            reputationScore: true,
            reputationTitle: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createRequest(userId: string, input: CreateLendingRequestInput) {
    return prisma.lendingRequest.create({
      data: {
        userId,
        reason: input.reason,
        amount: input.amount,
        termMonths: input.termMonths,
        interestRate: input.interestRate,
      },
    });
  }

  static async contribute(requestId: string, input: ContributeLendingInput) {
    const request = await prisma.lendingRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundError('Lending request not found');
    }

    const newFunded = Number(request.fundedAmount) + input.amount;
    const isFullyFunded = newFunded >= Number(request.amount);

    return prisma.lendingRequest.update({
      where: { id: requestId },
      data: {
        fundedAmount: newFunded,
        status: isFullyFunded ? 'FUNDED' : 'PENDING',
      },
    });
  }
}

