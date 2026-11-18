import { z } from 'zod';

const occupationEnum = z.enum([
  'STUDENT',
  'WORKING_PROFESSIONAL',
  'FREELANCER',
  'BUSINESS_OWNER',
  'ENTREPRENEUR',
  'HOMEMAKER',
  'RETIRED',
  'OTHER',
]);

const goalItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Goal name is required'),
  targetAmount: z.number().nonnegative().optional(),
  currentSavings: z.number().nonnegative().optional(),
  targetDate: z.string().optional(),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).optional(),
  category: z.string().optional(),
});

export const updateFinancialProfileSchema = z.object({
  occupation: occupationEnum.optional(),
  occupationDetails: z.string().max(200).optional(),
  incomeSource: z.string().max(100).optional(),
  monthlyIncomeRange: z.string().max(100).optional(),
  monthlyIncomeMin: z.number().nonnegative().optional(),
  monthlyIncomeMax: z.number().nonnegative().optional(),
  incomeFrequency: z.string().max(50).optional(),
  incomeStability: z.string().max(50).optional(),
  financialResponsibilities: z.string().max(500).optional(),
  financialGoals: z.array(goalItemSchema).optional(),
  interests: z.array(z.string()).optional(),
  onboardingStep: z.number().int().min(1).max(5).optional(),
});

export const completeOnboardingSchema = z.object({
  occupation: occupationEnum,
  occupationDetails: z.string().max(200).optional(),
  incomeSource: z.string().max(100).optional(),
  monthlyIncomeRange: z.string().max(100).optional(),
  monthlyIncomeMin: z.number().nonnegative().optional(),
  monthlyIncomeMax: z.number().nonnegative().optional(),
  incomeFrequency: z.string().max(50).optional(),
  incomeStability: z.string().max(50).optional(),
  financialResponsibilities: z.string().max(500).optional(),
  financialGoals: z.array(goalItemSchema).default([]),
  interests: z.array(z.string()).default([]),
});

export type UpdateFinancialProfileInput = z.infer<typeof updateFinancialProfileSchema>;
export type CompleteOnboardingInput = z.infer<typeof completeOnboardingSchema>;

