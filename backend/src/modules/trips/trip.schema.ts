import { z } from 'zod';

export const createTripSchema = z.object({
  body: z.object({
    destination: z.string().min(1, 'Destination is required'),
    budget: z.number().positive('Budget must be positive'),
    spent: z.number().nonnegative().default(0),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    travelersCount: z.number().int().positive().default(1),
  }),
});

export const updateTripSchema = z.object({
  body: z.object({
    destination: z.string().min(1).optional(),
    budget: z.number().positive().optional(),
    spent: z.number().nonnegative().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    travelersCount: z.number().int().positive().optional(),
    isCompleted: z.boolean().optional(),
  }),
});

export type CreateTripInput = z.infer<typeof createTripSchema>['body'];
export type UpdateTripInput = z.infer<typeof updateTripSchema>['body'];

