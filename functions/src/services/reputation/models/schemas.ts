

export interface ReputationDimensions {
    contributionScore: number;
    reliabilityScore: number;
    knowledgeScore: number;
    engagementScore: number;
    collaborationScore: number;
    leadershipScore: number;
    moderationScore: number;
}

export interface ReputationProfileDocument {
    id?: string;
    uid: string;
    dimensions: ReputationDimensions;
    unifiedTrustScore: number; // Aggregated score
    verificationStatus: "unverified" | "verified" | "trusted";
    badges: string[];
    createdAt: string;
    updatedAt: string;
}

export interface ReputationHistoryDocument {
    id?: string;
    uid: string;
    previousScore: number;
    newScore: number;
    triggeringEvent: string;
    timestamp: string;
    correlationId: string;
}
