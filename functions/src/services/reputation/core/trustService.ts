import { getReputationProfile, persistReputationProfile, persistReputationHistory, createInitialProfile } from "../data/reputationRepository";
import { ReputationProfileDocument } from "../models/schemas";

// Calculate aggregate score based on dimensions
const calculateUnifiedScore = (profile: ReputationProfileDocument): number => {
    const { contributionScore, reliabilityScore, knowledgeScore, engagementScore, collaborationScore, leadershipScore, moderationScore } = profile.dimensions;
    
    // Weighted aggregation
    return (
        (contributionScore * 0.2) +
        (reliabilityScore * 0.3) +
        (knowledgeScore * 0.15) +
        (engagementScore * 0.1) +
        (collaborationScore * 0.1) +
        (leadershipScore * 0.1) +
        (moderationScore * 0.05)
    );
};

export const getUnifiedTrustScore = async (uid: string): Promise<number> => {
    let profile = await getReputationProfile(uid);
    if (!profile) profile = createInitialProfile(uid);
    return profile.unifiedTrustScore;
};

// Deterministic reputation modifier
export const applyReputationEvent = async (
    uid: string, 
    eventName: string, 
    correlationId: string, 
    modifiers: Partial<Record<keyof ReputationProfileDocument["dimensions"], number>>
) => {
    let profile = await getReputationProfile(uid);
    if (!profile) profile = createInitialProfile(uid);

    const previousScore = profile.unifiedTrustScore;

    // Apply modifiers
    for (const [key, value] of Object.entries(modifiers)) {
        const dimKey = key as keyof typeof profile.dimensions;
        profile.dimensions[dimKey] = Math.min(100, Math.max(0, profile.dimensions[dimKey] + (value as number)));
    }

    profile.unifiedTrustScore = calculateUnifiedScore(profile);
    profile.updatedAt = new Date().toISOString();

    // Verification check
    if (profile.unifiedTrustScore > 80 && profile.dimensions.reliabilityScore > 90) {
        profile.verificationStatus = "trusted";
    }

    await persistReputationProfile(profile);

    await persistReputationHistory({
        uid,
        previousScore,
        newScore: profile.unifiedTrustScore,
        triggeringEvent: eventName,
        timestamp: profile.updatedAt,
        correlationId
    });

    return profile.unifiedTrustScore;
};
