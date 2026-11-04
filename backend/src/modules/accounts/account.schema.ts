import { z } from 'zod';

export const createAccountSchema = z.object({
  body: z.object({
    bankName: z.string().min(1, 'Bank name is required'),
    accountNumberMasked: z.string().min(4, 'Masked account number is required'),
    accountType: z.enum(['SAVINGS', 'CHECKING', 'CREDIT', 'INVESTMENT']).default('SAVINGS'),
    balance: z.number().nonnegative().default(0),
    currency: z.string().default('INR'),
    aaConnectionId: z.string().optional(),
  }),
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>['body'];

