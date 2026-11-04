import { prisma } from '../../config/database.js';
import { CreateGoalInput, UpdateGoalInput } from './goal.schema.js';
import { NotFoundError } from '../../shared/errors/index.js';

export class GoalService {
  static async listUserGoals(userId: string) {
    return prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createGoal(userId: string, input: CreateGoalInput) {
    return prisma.goal.create({
      data: {
        userId,
        title: input.title,
        targetAmount: input.targetAmount,
        currentAmount: input.currentAmount,
        category: input.category,
        deadline: input.deadline ? new Date(input.deadline) : null,
      },
    });
  }

  static async updateGoal(userId: string, goalId: string, input: UpdateGoalInput) {
    const goal = await prisma.goal.findFirst({
      where: { id: goalId, userId },
    });

    if (!goal) {
      throw new NotFoundError('Goal not found');
    }

    return prisma.goal.update({
      where: { id: goalId },
      data: {
        ...input,
        deadline: input.deadline ? new Date(input.deadline) : undefined,
      },
    });
  }

  static async deleteGoal(userId: string, goalId: string) {
    const goal = await prisma.goal.findFirst({
      where: { id: goalId, userId },
    });

    if (!goal) {
      throw new NotFoundError('Goal not found');
    }

    return prisma.goal.delete({
      where: { id: goalId },
    });
  }
}

