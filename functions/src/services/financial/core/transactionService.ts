import { ProcessTransactionPayload, TransactionDocument, TransactionClassification, TransactionMetadata } from "../models/schemas";
import { persistTransaction } from "../data/transactionRepository";
import { publishTransactionEvents } from "./transactionEvents";
import { logAuditAction } from "../../../infrastructure/logger/auditLogger";

// Dummy classification for MVP - In production, this would call an internal ML model or rule engine
const classifyTransaction = (payload: ProcessTransactionPayload): TransactionClassification => {
    const merchantLower = payload.merchant.toLowerCase();
    
    // Naive heuristic classification
    if (merchantLower.includes("salary") || merchantLower.includes("payroll")) {
        return { category: "Income", subcategory: "Salary", type: "income", isRecurring: true, isEssential: true, classificationConfidence: 0.95 };
    } else if (merchantLower.includes("grocery") || merchantLower.includes("supermarket")) {
        return { category: "Food", subcategory: "Groceries", type: "expense", isRecurring: true, isEssential: true, classificationConfidence: 0.88 };
    } else if (merchantLower.includes("netflix") || merchantLower.includes("spotify")) {
        return { category: "Entertainment", subcategory: "Subscriptions", type: "expense", isRecurring: true, isEssential: false, classificationConfidence: 0.99 };
    }
    
    return { category: "Uncategorized", subcategory: "General", type: "expense", isRecurring: false, isEssential: false, classificationConfidence: 0.3 };
};

export const processTransactionLogic = async (payload: ProcessTransactionPayload, uid: string) => {
    const timestamp = new Date().toISOString();
    const correlationId = payload.correlationId || `txn_${Date.now()}`;

    // 1. Classify Transaction (Requirement 1)
    const classification = classifyTransaction(payload);

    // 2. Build Standard Metadata (Requirement 5)
    const metadata: TransactionMetadata = {
        status: "COMPLETED",
        version: 1,
        createdAt: timestamp,
        updatedAt: timestamp,
        correlationId,
        createdBy: uid
    };

    // 3. Assemble Document
    const document: TransactionDocument = {
        amount: payload.amount,
        currency: payload.currency,
        merchant: payload.merchant,
        date: payload.date,
        notes: payload.notes,
        ...classification,
        ...metadata
    };

    // 4. Persistence
    const transactionId = await persistTransaction(document);
    document.id = transactionId;

    // 5. Publish Domain Events (Requirement 2 & 3)
    await publishTransactionEvents(document, correlationId);

    // 6. Audit Log
    await logAuditAction("transaction_processed", uid, { transactionId }, correlationId);

    return {
        success: true,
        transactionId,
        classification
    };
};
