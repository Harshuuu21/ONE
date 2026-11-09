import { z } from 'zod';

export const userPersonaSchema = z.enum([
  'STUDENT',
  'WORKING_PROFESSIONAL',
  'FREELANCER',
  'BUSINESS_OWNER',
]);

export const initializeDemoDataSchema = z.object({
  persona: userPersonaSchema.optional(),
  force: z.boolean().optional().default(false),
});

export const resetDemoDataSchema = z.object({
  persona: userPersonaSchema.optional(),
  confirmReset: z.boolean().refine((val) => val === true, {
    message: 'confirmReset must be true to safely regenerate demo data',
  }),
});

export type InitializeDemoDataInput = z.infer<typeof initializeDemoDataSchema>;
export type ResetDemoDataInput = z.infer<typeof resetDemoDataSchema>;

