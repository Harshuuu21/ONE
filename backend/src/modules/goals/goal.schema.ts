import { z } from 'zod';

export const createGoalSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    targetAmount: z.number().positive('Target amount must be positive'),
    currentAmount: z.number().nonnegative().default(0),
    category: z.string().min(1, 'Category is required'),
    deadline: z.string().datetime().optional(),
  }),
});

export const updateGoalSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    targetAmount: z.number().positive().optional(),
    currentAmount: z.number().nonnegative().optional(),
    category: z.string().optional(),
    deadline: z.string().datetime().optional(),
    isCompleted: z.boolean().optional(),
  }),
});

export type CreateGoalInput = z.infer<typeof createGoalSchema>['body'];
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>['body'];

