import { z } from 'zod';

export const createLendingRequestSchema = z.object({
  body: z.object({
    reason: z.string().min(3, 'Reason is required'),
    amount: z.number().positive('Amount must be positive'),
    termMonths: z.number().int().min(1).max(36).default(3),
    interestRate: z.number().nonnegative().default(4.5),
  }),
});

export const contributeLendingSchema = z.object({
  body: z.object({
    amount: z.number().positive('Contribution amount must be positive'),
  }),
});

export type CreateLendingRequestInput = z.infer<typeof createLendingRequestSchema>['body'];
export type ContributeLendingInput = z.infer<typeof contributeLendingSchema>['body'];

