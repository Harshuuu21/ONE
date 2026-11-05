import { z } from 'zod';

export const discoverAccountsSchema = z.object({
  body: z.object({
    providerId: z.string().optional().default('SAHAMATI_MOCK'),
    correlationId: z.string().optional(),
  }),
});

export const linkAccountsSchema = z.object({
  body: z.object({
    providerId: z.string().min(1, 'Provider ID is required'),
    aaConnectionId: z.string().optional(),
    accounts: z
      .array(
        z.object({
          fipId: z.string().min(1, 'FIP ID is required'),
          bankName: z.string().min(1, 'Bank name is required'),
          bankLogoUrl: z.string().optional(),
          accountType: z.enum(['SAVINGS', 'CHECKING', 'CREDIT', 'INVESTMENT', 'DEPOSIT']).default('SAVINGS'),
          accountNumberMasked: z.string().min(4, 'Masked account number is required'),
          accountRefNumber: z.string().min(1, 'Account reference number is required'),
          balance: z.number().optional().default(0),
        })
      )
      .min(1, 'Please select at least one account to link'),
  }),
});

export type DiscoverAccountsInput = z.infer<typeof discoverAccountsSchema>['body'];
export type LinkAccountsInput = z.infer<typeof linkAccountsSchema>['body'];

