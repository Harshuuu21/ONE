export const generateCommunityInsights = async (communityId: string) => {
    // Deterministic metrics generation (Stubbed for MVP)
    return {
        communityId,
        challengeCompletionRate: 0.72,
        savingsProgressTotal: 45000,
        communityGrowthRate: 0.15,
        engagementTrends: {
            dailyActiveUsers: 120,
            postsPerDay: 45
        },
        popularTopics: ["index_funds", "travel_hacks", "debt_snowball"],
        generatedAt: new Date().toISOString()
    };
};
