import { z } from "zod";
import { HttpsError } from "firebase-functions/v2/https";

export const validatePayload = <T>(schema: z.ZodSchema<T>, data: any): T => {
    try {
        return schema.parse(data);
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new HttpsError('invalid-argument', 'Validation failed', error.errors);
        }
        throw new HttpsError('internal', 'An unexpected error occurred during validation');
    }
};
