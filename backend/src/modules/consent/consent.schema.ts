import { z } from 'zod';

export const createConsentSchema = z.object({
  body: z.object({
    purpose: z.string().min(1, 'Purpose is required'),
    validUntil: z.string().datetime(),
    metadata: z.record(z.any()).optional(),
  }),
});

export const updateConsentSchema = z.object({
  body: z.object({
    status: z.enum(['ACTIVE', 'REVOKED', 'EXPIRED']),
  }),
});

export type CreateConsentInput = z.infer<typeof createConsentSchema>['body'];
export type UpdateConsentInput = z.infer<typeof updateConsentSchema>['body'];

