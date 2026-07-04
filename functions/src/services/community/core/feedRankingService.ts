import { CommunityPostDocument } from "../models/schemas";

// Deterministic Feed Ranking Engine
export const rankFeed = (posts: CommunityPostDocument[]): CommunityPostDocument[] => {
    const now = Date.now();
    
    return posts.map(post => {
        // 1. Freshness: Exponential decay based on age in hours
        const postTime = new Date(post.createdAt).getTime();
        const ageInHours = Math.max(0, (now - postTime) / (1000 * 60 * 60));
        const freshnessScore = Math.exp(-0.1 * ageInHours); // Decays over time
        
        // 2. Engagement: Weighted sum of metrics
        const engagementScore = (post.metrics.likes * 1) + (post.metrics.comments * 2) + (post.metrics.shares * 3);
        
        // 3. Trust & Relevance: (Stubbed - in Phase 5.5 we would fetch author's Trust Score)
        const trustScore = 1.0; 
        
        // Compute final deterministic ranking score
        post.rankingScore = (freshnessScore * 50) + (engagementScore * 2) * trustScore;
        
        return post;
    }).sort((a, b) => (b.rankingScore || 0) - (a.rankingScore || 0));
};
