import { z } from "zod";

export const ProcessTransactionSchema = z.object({
    amount: z.number().positive(),
    currency: z.string().length(3),
    merchant: z.string().min(1),
    date: z.string().datetime(),
    notes: z.string().optional(),
    correlationId: z.string().optional()
});

export type ProcessTransactionPayload = z.infer<typeof ProcessTransactionSchema>;

export interface TransactionClassification {
    category: string;
    subcategory: string;
    type: "income" | "expense";
    isRecurring: boolean;
    isEssential: boolean;
    classificationConfidence: number;
}

export interface TransactionMetadata {
    status: "PENDING" | "COMPLETED" | "FAILED";
    version: number;
    createdAt: string;
    updatedAt: string;
    correlationId: string;
    createdBy: string;
}

export interface TransactionDocument extends TransactionClassification, TransactionMetadata {
    id?: string;
    amount: number;
    currency: string;
    merchant: string;
    date: string;
    notes?: string;
}
