import { prisma } from '../../config/database.js';
import { NotFoundError } from '../../shared/errors/index.js';
import { UpdateUserInput } from './user.schema.js';

// In-memory fallback user profiles for offline dev
const inMemoryProfiles = new Map<string, any>();

export class UserService {
  static async getProfile(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          mobileNumber: true,
          reputationScore: true,
          reputationTitle: true,
          role: true,
          createdAt: true,
          accounts: true,
          consents: true,
        },
      });

      if (user) return user;
    } catch (err: any) {
      console.warn('[UserService] DB getProfile fallback:', err.message);
    }

    const memUser = inMemoryProfiles.get(userId);
    if (memUser) return memUser;

    return {
      id: userId,
      email: 'member@one.financial',
      firstName: 'ONE',
      lastName: 'Member',
      mobileNumber: '+919511868660',
      reputationScore: 780,
      reputationTitle: 'Prime Sovereign',
      role: 'USER',
      createdAt: new Date(),
      accounts: [],
      consents: [],
    };
  }

  static async updateProfile(userId: string, input: UpdateUserInput) {
    try {
      const updated = await prisma.user.update({
        where: { id: userId },
        data: input,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          mobileNumber: true,
          reputationScore: true,
          reputationTitle: true,
          role: true,
          updatedAt: true,
        },
      });

      return updated;
    } catch (err: any) {
      console.warn('[UserService] DB updateProfile fallback:', err.message);
    }

    const current = inMemoryProfiles.get(userId) || {
      id: userId,
      email: 'member@one.financial',
      firstName: 'ONE',
      lastName: 'Member',
      mobileNumber: '+919511868660',
      reputationScore: 780,
      reputationTitle: 'Prime Sovereign',
      role: 'USER',
      createdAt: new Date(),
    };

    const updated = {
      ...current,
      ...input,
      updatedAt: new Date(),
    };
    inMemoryProfiles.set(userId, updated);
    return updated;
  }
}

