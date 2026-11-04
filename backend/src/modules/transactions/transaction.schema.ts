import { z } from 'zod';

export const createTransactionSchema = z.object({
  body: z.object({
    accountId: z.string().uuid().optional(),
    title: z.string().min(1, 'Title is required'),
    amount: z.number().positive('Amount must be positive'),
    category: z.string().min(1, 'Category is required'),
    type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']).default('EXPENSE'),
    date: z.string().datetime().optional(),
    note: z.string().optional(),
  }),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>['body'];

