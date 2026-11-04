import { z } from 'zod';

export const updateUserSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().optional(),
    reputationScore: z.number().int().min(0).max(1000).optional(),
    reputationTitle: z.string().optional(),
  }),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>['body'];

