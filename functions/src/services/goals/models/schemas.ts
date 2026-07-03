import { z } from "zod";

export const CreateGoalSchema = z.object({
    title: z.string().min(2),
    targetAmount: z.number().positive(),
    currency: z.string().length(3),
    targetDate: z.string().datetime(), // ISO 8601 string
    category: z.string(),
    correlationId: z.string().optional()
});

export type CreateGoalPayload = z.infer<typeof CreateGoalSchema>;

export interface GoalDocument {
    id?: string;
    uid: string;
    title: string;
    targetAmount: number;
    currentAmount: number;
    currency: string;
    targetDate: string;
    category: string;
    status: "ACTIVE" | "COMPLETED" | "PAUSED" | "CANCELLED";
    isFeasible: boolean; // Computed upon creation using Financial Intelligence
    createdAt: string;
    updatedAt: string;
    correlationId: string;
}
