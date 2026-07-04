import { db } from "../../config/firebase";

export interface FeatureFlags {
    isLendingEnabled: boolean;
    isCommunityEnabled: boolean;
    isAiMentorEnabled: boolean;
    isTravelEnabled: boolean;
}

let cachedFlags: FeatureFlags | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 60000; // 1 minute

export const getFeatureFlags = async (): Promise<FeatureFlags> => {
    const now = Date.now();
    
    if (cachedFlags && (now - lastFetchTime) < CACHE_TTL) {
        return cachedFlags;
    }

    try {
        const doc = await db.collection("platform_config").doc("features").get();
        if (doc.exists) {
            cachedFlags = doc.data() as FeatureFlags;
            lastFetchTime = now;
            return cachedFlags;
        }
    } catch (e) {
        // Fallback gracefully
    }

    // Default flags if missing
    return {
        isLendingEnabled: true,
        isCommunityEnabled: true,
        isAiMentorEnabled: true,
        isTravelEnabled: true
    };
};

export const isFeatureEnabled = async (featureKey: keyof FeatureFlags): Promise<boolean> => {
    const flags = await getFeatureFlags();
    return !!flags[featureKey];
};
