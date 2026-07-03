import { db } from "../../../config/firebase";

export const initializeUserRecords = async (
    uid: string, 
    email: string, 
    displayName: string,
    device?: string,
    platform?: string,
    appVersion?: string
) => {
    const batch = db.batch();
    const timestamp = new Date().toISOString();

    // 1. User Document
    const userRef = db.collection("users").doc(uid);
    batch.set(userRef, {
        uid,
        email,
        createdAt: timestamp,
        status: "REGISTERED", // State Machine: REGISTERED -> EMAIL_PENDING -> ACTIVE
        emailVerified: false,
        isDeleted: false,
        deletedAt: null
    });

    // 2. User Profile
    const profileRef = db.collection("user_profiles").doc(uid);
    batch.set(profileRef, {
        displayName,
        onboardingCompleted: false,
        riskProfile: "unassessed",
        savingsBehaviour: "unassessed",
        updatedAt: timestamp,
        isDeleted: false,
        deletedAt: null
    });

    // 3. User Preferences
    const preferencesRef = db.collection("user_preferences").doc(uid);
    batch.set(preferencesRef, {
        currency: "USD",
        timezone: "UTC",
        notifications: {
            email: true,
            push: true,
            sms: false,
            goalReminders: true,
            repaymentReminders: true,
            travelReminders: true
        },
        travelPreferences: {
            preferredClass: "economy",
            accommodationStyle: "standard"
        },
        updatedAt: timestamp,
        isDeleted: false,
        deletedAt: null
    });

    // 4. User AI Context
    const aiContextRef = db.collection("user_ai_context").doc(uid);
    batch.set(aiContextRef, {
        financialPersona: "unknown",
        communicationStyle: "concise",
        goalStyle: "balanced",
        riskTolerance: "moderate",
        travelPreferences: "unassessed",
        memoryMetadata: {
            lastAnalyzed: timestamp,
            keyInsights: []
        },
        version: 1,
        modelVersion: "base",
        memoryVersion: "1.0",
        lastAIRefresh: timestamp,
        updatedAt: timestamp,
        isDeleted: false,
        deletedAt: null
    });

    // 5. User Session
    const sessionRef = db.collection("user_sessions").doc();
    batch.set(sessionRef, {
        uid,
        device: device || "unknown",
        platform: platform || "unknown",
        appVersion: appVersion || "unknown",
        sessionCreatedAt: timestamp,
        lastActive: timestamp,
        sessionStatus: "active"
    });

    await batch.commit();
};
