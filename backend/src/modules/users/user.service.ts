import { prisma } from '../../config/database.js';
import { NotFoundError } from '../../shared/errors/index.js';
import { UpdateUserInput } from './user.schema.js';

export class UserService {
  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        reputationScore: true,
        reputationTitle: true,
        role: true,
        createdAt: true,
        accounts: true,
        consents: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User profile not found');
    }

    return user;
  }

  static async updateProfile(userId: string, input: UpdateUserInput) {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: input,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        reputationScore: true,
        reputationTitle: true,
        role: true,
        updatedAt: true,
      },
    });

    return updated;
  }
}

