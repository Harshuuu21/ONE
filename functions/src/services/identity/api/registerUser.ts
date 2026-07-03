import { onCall, HttpsError } from "firebase-functions/v2/https";
import { RegisterUserSchema } from "../models/schemas";
import { validatePayload } from "../../../infrastructure/security/validation";
// import { requireAppCheck } from "../../../infrastructure/security/middleware";
import { processUserRegistration } from "../core/registrationService";

export const registerUser = onCall(async (request) => {
    // Note: We don't use requireAuth here because this is a registration endpoint,
    // so the caller is unauthenticated by definition.
    
    // Security: Require App Check (Uncomment when frontend is ready)
    // requireAppCheck(request);

    try {
        // 1. Zod Validation
        const payload = validatePayload(RegisterUserSchema, request.data);

        // 2. Delegate to Core Service
        const result = await processUserRegistration(payload);
        
        return result;
    } catch (error: any) {
        if (error instanceof HttpsError) {
            throw error;
        }
        throw new HttpsError('internal', 'An unexpected error occurred during registration.');
    }
});
