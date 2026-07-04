import { db } from "../../../config/firebase";
import { ReputationProfileDocument, ReputationHistoryDocument } from "../models/schemas";

export const getReputationProfile = async (uid: string): Promise<ReputationProfileDocument | null> => {
    const snapshot = await db.collection("reputation_profiles").where("uid", "==", uid).limit(1).get();
    if (snapshot.empty) return null;
    return snapshot.docs[0].data() as ReputationProfileDocument;
};

export const persistReputationProfile = async (profile: ReputationProfileDocument): Promise<void> => {
    const docRef = profile.id 
        ? db.collection("reputation_profiles").doc(profile.id) 
        : db.collection("reputation_profiles").doc();
        
    if (!profile.id) profile.id = docRef.id;
    
    await docRef.set(profile, { merge: true });
};

export const persistReputationHistory = async (history: ReputationHistoryDocument): Promise<void> => {
    const docRef = db.collection("reputation_history").doc();
    await docRef.set({ ...history, id: docRef.id });
};

export const createInitialProfile = (uid: string): ReputationProfileDocument => {
    const now = new Date().toISOString();
    return {
        uid,
        dimensions: {
            contributionScore: 0,
            reliabilityScore: 50, // Base trust
            knowledgeScore: 0,
            engagementScore: 0,
            collaborationScore: 0,
            leadershipScore: 0,
            moderationScore: 0
        },
        unifiedTrustScore: 50,
        verificationStatus: "unverified",
        badges: [],
        createdAt: now,
        updatedAt: now
    };
};
