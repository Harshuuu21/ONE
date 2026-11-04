import type { Goal } from '@/types';

export interface NewGoalInput {
  name: string;
  target: number;
  by: string;
  category: string;
  monthlyPace: number;
}

export type { Goal };

