import { z } from 'zod';

export const initiateConnectionSchema = z.object({
  body: z.object({
    providerId: z.string().min(1, 'Provider ID is required'),
    redirectCallbackUrl: z.string().url().optional(),
  }),
});

export const aaCallbackSchema = z.object({
  body: z.object({
    providerId: z.string().min(1, 'Provider ID is required'),
    correlationId: z.string().min(1, 'Correlation ID is required'),
    status: z.enum(['SUCCESS', 'FAILED', 'CANCELLED', 'APPROVED', 'REJECTED']),
    consentHandle: z.string().optional(),
    customerHandle: z.string().optional(),
    discoveredAccounts: z.array(z.any()).optional(),
    errorReason: z.string().optional(),
  }),
});

