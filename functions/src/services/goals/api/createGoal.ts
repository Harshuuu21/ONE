import { onCall, HttpsError } from "firebase-functions/v2/https";
import { CreateGoalSchema } from "../models/schemas";
import { validatePayload } from "../../../infrastructure/security/validation";
import { withSecurity } from "../../../infrastructure/security/middleware";
import { processCreateGoal } from "../core/goalService";

export const createGoal = onCall(async (request) => {
    try {
        const auth = withSecurity(request);
        const payload = validatePayload(CreateGoalSchema, request.data);
        return await processCreateGoal(payload, auth.uid);
    } catch (error: any) {
        if (error instanceof HttpsError) {
            throw error;
        }
        throw new HttpsError('internal', 'An unexpected error occurred while creating the goal.');
    }
});
