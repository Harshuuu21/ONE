import { onCall, HttpsError } from "firebase-functions/v2/https";
import { CreateCommunitySchema, JoinCommunitySchema, CreatePostSchema } from "../models/schemas";
import { validatePayload } from "../../../infrastructure/security/validation";
import { withSecurity } from "../../../infrastructure/security/middleware";
import { processCreateCommunity, processJoinCommunity, processCreatePost, fetchRankedFeed } from "../core/communityService";
import { generateCommunityInsights } from "../core/insightsService";

export const createCommunity = onCall(async (request) => {
    try {
        const auth = withSecurity(request);
        const payload = validatePayload(CreateCommunitySchema, request.data);
        return await processCreateCommunity(payload, auth.uid);
    } catch (error: any) {
        if (error instanceof HttpsError) throw error;
        throw new HttpsError('internal', 'An unexpected error occurred while creating the community.');
    }
});

export const joinCommunity = onCall(async (request) => {
    try {
        const auth = withSecurity(request);
        const payload = validatePayload(JoinCommunitySchema, request.data);
        return await processJoinCommunity(payload, auth.uid);
    } catch (error: any) {
        if (error instanceof HttpsError) throw error;
        throw new HttpsError('internal', 'An unexpected error occurred while joining the community.');
    }
});

export const createCommunityPost = onCall(async (request) => {
    try {
        const auth = withSecurity(request);
        const payload = validatePayload(CreatePostSchema, request.data);
        return await processCreatePost(payload, auth.uid);
    } catch (error: any) {
        if (error instanceof HttpsError) throw error;
        throw new HttpsError('internal', 'An unexpected error occurred while posting.');
    }
});

export const getCommunityFeed = onCall(async (request) => {
    try {
        withSecurity(request);
        const communityId = request.data.communityId;
        if (!communityId) throw new HttpsError('invalid-argument', 'communityId is required');
        
        const feed = await fetchRankedFeed(communityId);
        return { success: true, feed };
    } catch (error: any) {
        if (error instanceof HttpsError) throw error;
        throw new HttpsError('internal', 'An unexpected error occurred while fetching the feed.');
    }
});

export const getCommunityInsights = onCall(async (request) => {
    try {
        withSecurity(request);
        const communityId = request.data.communityId;
        if (!communityId) throw new HttpsError('invalid-argument', 'communityId is required');
        
        const insights = await generateCommunityInsights(communityId);
        return { success: true, insights };
    } catch (error: any) {
        if (error instanceof HttpsError) throw error;
        throw new HttpsError('internal', 'An unexpected error occurred while fetching insights.');
    }
});
