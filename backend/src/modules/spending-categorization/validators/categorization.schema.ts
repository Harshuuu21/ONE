import { z } from 'zod';

const spendingCategoryEnum = z.enum([
  'INVESTMENT',
  'MEDICINE',
  'FOOD',
  'GROCERIES',
  'PETROL',
  'SHOPPING',
  'SUBSCRIPTION',
  'TRANSPORT',
  'OUTING',
  'BILLS_UTILITIES',
  'EDUCATION',
  'RENT',
  'INSURANCE',
  'MISCELLANEOUS',
]);

export const rawTransactionInputSchema = z.object({
  transactionId: z.string().optional(),
  amount: z.number().positive('Amount must be positive'),
  merchantName: z.string().max(200).optional(),
  upiHolderName: z.string().max(200).optional(),
  upiId: z.string().max(100).optional(),
  merchantId: z.string().max(100).optional(),
  mcc: z.union([z.string(), z.number()]).optional(),
  bankDescription: z.string().max(500).optional(),
  transactionRef: z.string().max(100).optional(),
  paymentSource: z.enum(['UPI', 'CARD', 'NET_BANKING', 'ACCOUNT_AGGREGATOR', 'MANUAL']).optional(),
  isConfirmedPayment: z.boolean().default(true),
  persistToDb: z.boolean().default(false),
});

export const batchClassifySchema = z.object({
  transactions: z.array(rawTransactionInputSchema).min(1, 'At least one transaction required'),
  persistToDb: z.boolean().default(false),
});

export const overrideCategorySchema = z.object({
  transactionId: z.string().min(1, 'Transaction ID is required'),
  category: spendingCategoryEnum,
  merchantKey: z.string().max(100).optional(),
});

export type RawTransactionInputDto = z.infer<typeof rawTransactionInputSchema>;
export type BatchClassifyDto = z.infer<typeof batchClassifySchema>;
export type OverrideCategoryDto = z.infer<typeof overrideCategorySchema>;
