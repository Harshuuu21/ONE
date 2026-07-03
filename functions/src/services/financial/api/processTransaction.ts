import { onCall, HttpsError } from "firebase-functions/v2/https";
import { ProcessTransactionSchema } from "../models/schemas";
import { validatePayload } from "../../../infrastructure/security/validation";
import { withSecurity } from "../../../infrastructure/security/middleware";
import { processTransactionLogic } from "../core/transactionService";

export const processTransaction = onCall(async (request) => {
    try {
        // 1. Security & Auth Guard
        const auth = withSecurity(request);

        // 2. Validation
        const payload = validatePayload(ProcessTransactionSchema, request.data);

        // 3. Core Logic
        return await processTransactionLogic(payload, auth.uid);
    } catch (error: any) {
        if (error instanceof HttpsError) {
            throw error;
        }
        throw new HttpsError('internal', 'An unexpected error occurred while processing the transaction.');
    }
});
