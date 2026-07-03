import { getAuth } from "firebase-admin/auth";
import { HttpsError } from "firebase-functions/v2/https";
import { RegisterUserPayload } from "../models/schemas";
import { initializeUserRecords } from "../data/userRepository";
import { publishEvent, SystemEvents } from "../../../infrastructure/orchestration/eventBus";
import { aiHooks } from "../../../infrastructure/ai/aiHooks";
import { logAuditAction } from "../../../infrastructure/logger/auditLogger";

export const processUserRegistration = async (payload: RegisterUserPayload) => {
    const auth = getAuth();
    let createdUserRecord;
    let isIdempotentSuccess = false;

    try {
        // 1. Authentication Integration
        createdUserRecord = await auth.createUser({
            email: payload.email,
            password: payload.password,
            displayName: payload.displayName,
            emailVerified: false 
        });
    } catch (error: any) {
        if (error.code === 'auth/email-already-exists') {
            // Idempotent Registration: If user already exists, we treat it as success but don't re-init records
            createdUserRecord = await auth.getUserByEmail(payload.email);
            isIdempotentSuccess = true;
        } else {
            throw new HttpsError('already-exists', error.message || 'Error creating user authentication record.');
        }
    }

    if (!isIdempotentSuccess) {
        try {
            // 2. Initialize Firestore State
            await initializeUserRecords(
                createdUserRecord.uid, 
                payload.email, 
                payload.displayName,
                payload.device,
                payload.platform,
                payload.appVersion
            );
        } catch (error: any) {
            await auth.deleteUser(createdUserRecord.uid);
            throw new HttpsError('internal', 'Database initialization failed. Rolled back authentication identity.');
        }

        // Granular Events
        await publishEvent(SystemEvents.PROFILE_INITIALIZED, { uid: createdUserRecord.uid }, payload.correlationId);
        await publishEvent(SystemEvents.AI_CONTEXT_INITIALIZED, { uid: createdUserRecord.uid }, payload.correlationId);
        await publishEvent(SystemEvents.SESSION_CREATED, { uid: createdUserRecord.uid }, payload.correlationId);
    }

    // 3. Email Verification Workflow
    let verificationLink = null;
    try {
        verificationLink = await auth.generateEmailVerificationLink(payload.email);
        await publishEvent(SystemEvents.EMAIL_VERIFICATION_CREATED, { uid: createdUserRecord.uid }, payload.correlationId);
    } catch (error: any) {
        console.error("Failed to generate verification link", error);
    }

    // 4. Publish Orchestration Event
    if (!isIdempotentSuccess) {
        await publishEvent(SystemEvents.USER_REGISTERED, {
            uid: createdUserRecord.uid,
            email: payload.email,
            timestamp: new Date().toISOString()
        }, payload.correlationId);
    }

    // 5. Trigger AI Hooks
    if (!isIdempotentSuccess) {
        await aiHooks.triggerFinancialCoach({
            uid: createdUserRecord.uid,
            action: "initialize_context",
            defaultPersona: "unknown"
        });
    }

    // 6. Audit Logging
    await logAuditAction("user_registration", createdUserRecord.uid, {
        device: payload.device,
        platform: payload.platform,
        idempotent: isIdempotentSuccess
    }, payload.correlationId);

    return {
        success: true,
        uid: createdUserRecord.uid,
        message: "User registered successfully. Verification required.",
        verificationLink
    };
};
