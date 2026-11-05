import { z } from 'zod';

export const requestConsentSchema = z.object({
  body: z.object({
    providerId: z.string().min(1, 'Provider ID is required'),
    purpose: z.string().optional().default('101 - Personal financial management and financial analytics'),
    dataTypes: z.array(z.string()).optional().default(['TRANSACTIONS', 'PROFILE', 'SUMMARY']),
    dataRangeFrom: z.string().datetime().optional(),
    dataRangeTo: z.string().datetime().optional(),
    fetchFrequency: z.string().optional().default('DAILY'),
    durationDays: z.number().int().positive().optional().default(365),
    accountIds: z.array(z.string()).min(1, 'Please select at least one account for consent authorization'),
  }),
});

export const consentCallbackSchema = z.object({
  body: z.object({
    providerId: z.string().min(1, 'Provider ID is required'),
    consentHandle: z.string().min(1, 'Consent handle is required'),
    consentId: z.string().optional(),
    status: z.enum(['APPROVED', 'REJECTED', 'EXPIRED', 'REVOKED']),
    signature: z.string().optional(),
    metadata: z.record(z.any()).optional(),
  }),
});

export type RequestConsentInput = z.infer<typeof requestConsentSchema>['body'];
export type ConsentCallbackInput = z.infer<typeof consentCallbackSchema>['body'];
