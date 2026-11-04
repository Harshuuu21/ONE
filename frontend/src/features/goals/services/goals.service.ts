import { goals } from '@/lib/one-data';
import type { Goal, NewGoalInput } from '../types';

export class GoalsService {
  static getGoals(): Goal[] {
    return goals;
  }

  static async createGoal(input: NewGoalInput): Promise<Goal> {
    await new Promise((r) => setTimeout(r, 400));
    return {
      id: `goal_${Date.now()}`,
      title: input.name,
      target: input.target,
      saved: 0,
      monthly: input.monthlyPace || 100,
      etaMonths: 12,
      tone: 'On track',
      image: '/placeholder.svg',
    };
  }
}
