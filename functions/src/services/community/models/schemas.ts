import { z } from "zod";

export const CreateCommunitySchema = z.object({
    name: z.string().min(3),
    description: z.string(),
    type: z.enum(["goal_group", "savings_challenge", "travel_group", "general"]),
    correlationId: z.string().optional()
});

export const JoinCommunitySchema = z.object({
    communityId: z.string(),
    correlationId: z.string().optional()
});

export const CreatePostSchema = z.object({
    communityId: z.string(),
    content: z.string().min(1),
    tags: z.array(z.string()).optional(),
    correlationId: z.string().optional()
});

export type CreateCommunityPayload = z.infer<typeof CreateCommunitySchema>;
export type JoinCommunityPayload = z.infer<typeof JoinCommunitySchema>;
export type CreatePostPayload = z.infer<typeof CreatePostSchema>;

export interface CommunityDocument {
    id?: string;
    name: string;
    description: string;
    type: "goal_group" | "savings_challenge" | "travel_group" | "general";
    createdBy: string;
    memberCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface CommunityMemberDocument {
    id?: string;
    communityId: string;
    uid: string;
    joinedAt: string;
    role: "member" | "admin";
}

export interface CommunityPostDocument {
    id?: string;
    communityId: string;
    authorId: string;
    content: string;
    tags: string[];
    metrics: {
        likes: number;
        comments: number;
        shares: number;
    };
    rankingScore?: number; // Deterministically computed
    createdAt: string;
    updatedAt: string;
}
