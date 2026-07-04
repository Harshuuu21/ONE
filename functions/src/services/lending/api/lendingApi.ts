import { onCall, HttpsError } from "firebase-functions/v2/https";
import { CreateLoanRequestSchema } from "../models/schemas";
import { validatePayload } from "../../../infrastructure/security/validation";
import { withSecurity } from "../../../infrastructure/security/middleware";
import { createLoanRequest } from "../core/requestEngine";

export const requestLoan = onCall(async (request) => {
    try {
        const auth = withSecurity(request);
        const payload = validatePayload(CreateLoanRequestSchema, request.data);
        return await createLoanRequest(payload, auth.uid);
    } catch (error: any) {
        if (error instanceof HttpsError) throw error;
        throw new HttpsError('internal', 'An unexpected error occurred while processing loan request.');
    }
});

// Stubs for other API endpoints like approveLoan, makeRepayment
export const makeRepayment = onCall(async (request) => {
    withSecurity(request);
    // Logic goes here
    return { success: true };
});
