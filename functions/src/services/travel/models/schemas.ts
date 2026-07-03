import { z } from "zod";

export const CreateTripSchema = z.object({
    destination: z.string().min(2),
    estimatedCost: z.number().positive(),
    currency: z.string().length(3),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    correlationId: z.string().optional()
});

export type CreateTripPayload = z.infer<typeof CreateTripSchema>;

export interface TripDocument {
    id?: string;
    uid: string;
    destination: string;
    estimatedCost: number;
    currency: string;
    startDate: string;
    endDate: string;
    affordability: string; 
    status: "PLANNED" | "ACTIVE" | "COMPLETED" | "CANCELLED";
    createdAt: string;
    updatedAt: string;
    correlationId: string;
}
