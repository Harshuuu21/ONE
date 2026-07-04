import { CreateCommunityPayload, JoinCommunityPayload, CreatePostPayload, CommunityDocument, CommunityMemberDocument, CommunityPostDocument } from "../models/schemas";
import { persistCommunity, persistCommunityMember, persistPost, getCommunityPosts } from "../data/communityRepository";
import { publishEvent, SystemEvents } from "../../../infrastructure/orchestration/eventBus";
import { logAuditAction } from "../../../infrastructure/logger/auditLogger";
import { rankFeed } from "./feedRankingService";
import { aiHooks } from "../../../infrastructure/ai/aiHooks";

export const processCreateCommunity = async (payload: CreateCommunityPayload, uid: string) => {
    const timestamp = new Date().toISOString();
    const correlationId = payload.correlationId || `comm_${Date.now()}`;

    const document: CommunityDocument = {
        name: payload.name,
        description: payload.description,
        type: payload.type,
        createdBy: uid,
        memberCount: 0,
        createdAt: timestamp,
        updatedAt: timestamp
    };

    const communityId = await persistCommunity(document);
    document.id = communityId;

    // Automatically join the creator as an admin
    await persistCommunityMember({
        communityId,
        uid,
        joinedAt: timestamp,
        role: "admin"
    });

    await publishEvent(SystemEvents.COMMUNITY_CREATED as any, document, correlationId);
    await logAuditAction("community_created", uid, { communityId, type: payload.type }, correlationId);

    return { success: true, communityId };
};

export const processJoinCommunity = async (payload: JoinCommunityPayload, uid: string) => {
    const timestamp = new Date().toISOString();
    const correlationId = payload.correlationId || `join_${Date.now()}`;

    const member: CommunityMemberDocument = {
        communityId: payload.communityId,
        uid,
        joinedAt: timestamp,
        role: "member"
    };

    const memberId = await persistCommunityMember(member);

    await publishEvent(SystemEvents.COMMUNITY_MEMBER_JOINED as any, { communityId: payload.communityId, uid }, correlationId);
    await logAuditAction("community_joined", uid, { communityId: payload.communityId }, correlationId);

    return { success: true, memberId };
};

export const processCreatePost = async (payload: CreatePostPayload, uid: string) => {
    const timestamp = new Date().toISOString();
    const correlationId = payload.correlationId || `post_${Date.now()}`;

    const document: CommunityPostDocument = {
        communityId: payload.communityId,
        authorId: uid,
        content: payload.content,
        tags: payload.tags || [],
        metrics: { likes: 0, comments: 0, shares: 0 },
        createdAt: timestamp,
        updatedAt: timestamp
    };

    const postId = await persistPost(document);
    document.id = postId;

    await publishEvent(SystemEvents.COMMUNITY_POST_CREATED as any, document, correlationId);
    
    // Trigger AI Mentor (Assistant role, not moderation)
    await aiHooks.triggerCommunityMentor({
        action: "new_post_analysis",
        postId,
        communityId: payload.communityId
    });

    await logAuditAction("community_post_created", uid, { postId, communityId: payload.communityId }, correlationId);

    return { success: true, postId };
};

export const fetchRankedFeed = async (communityId: string) => {
    const rawPosts = await getCommunityPosts(communityId);
    const rankedPosts = rankFeed(rawPosts);
    return rankedPosts;
};
