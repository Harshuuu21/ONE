import { z } from 'zod';

export const PeriodFilterEnum = z.enum([
  'THIS_WEEK',
  'THIS_MONTH',
  'LAST_MONTH',
  'LAST_3_MONTHS',
  'THIS_YEAR',
  'CUSTOM',
]);

export const SpendingCategoryEnum = z.enum([
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

export const spendingDistributionSchema = z.object({
  query: z
    .object({
      period: PeriodFilterEnum.optional().default('THIS_MONTH'),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    })
    .optional(),
});

export const spendingSummarySchema = z.object({
  query: z
    .object({
      period: PeriodFilterEnum.optional().default('THIS_MONTH'),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    })
    .optional(),
});

export const spendingTransactionsSchema = z.object({
  query: z
    .object({
      period: PeriodFilterEnum.optional().default('THIS_MONTH'),
      category: SpendingCategoryEnum.optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      limit: z.coerce.number().min(1).max(200).optional().default(50),
      offset: z.coerce.number().min(0).optional().default(0),
    })
    .optional(),
});

export const categoryCorrectionSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Transaction ID is required'),
  }),
  body: z.object({
    newCategory: SpendingCategoryEnum,
    rememberMerchantMapping: z.boolean().optional().default(false),
  }),
});

export const createMerchantMappingSchema = z.object({
  body: z.object({
    merchantKey: z.string().min(2, 'Merchant key must be at least 2 characters'),
    category: SpendingCategoryEnum,
    merchantIdentifier: z.string().optional(),
  }),
});

export const deleteMerchantMappingSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Mapping ID or merchant key is required'),
  }),
});
