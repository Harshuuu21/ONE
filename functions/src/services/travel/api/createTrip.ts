import { onCall, HttpsError } from "firebase-functions/v2/https";
import { CreateTripSchema } from "../models/schemas";
import { validatePayload } from "../../../infrastructure/security/validation";
import { withSecurity } from "../../../infrastructure/security/middleware";
import { processCreateTrip } from "../core/travelService";

export const createTrip = onCall(async (request) => {
    try {
        const auth = withSecurity(request);
        const payload = validatePayload(CreateTripSchema, request.data);
        return await processCreateTrip(payload, auth.uid);
    } catch (error: any) {
        if (error instanceof HttpsError) {
            throw error;
        }
        throw new HttpsError('internal', 'An unexpected error occurred while creating the trip.');
    }
});
