import { getEventarc } from "firebase-admin/eventarc";

// Define all major system events
export enum SystemEvents {
    // Identity Events
    USER_REGISTERED = "one.identity.user_registered",
    PROFILE_INITIALIZED = "one.identity.profile_initialized",
    AI_CONTEXT_INITIALIZED = "one.identity.ai_context_initialized",
    SESSION_CREATED = "one.identity.session_created",
    EMAIL_VERIFICATION_CREATED = "one.identity.email_verification_created",

    // Financial Events
    TRANSACTION_CREATED = "one.financial.transaction_created",
    
    // Community Events
    COMMUNITY_CREATED = "one.community.created",
    COMMUNITY_MEMBER_JOINED = "one.community.member_joined",
    COMMUNITY_POST_CREATED = "one.community.post_created",
    CHALLENGE_CREATED = "one.community.challenge_created",
    CHALLENGE_COMPLETED = "one.community.challenge_completed",
    GOAL_SHARED = "one.community.goal_shared",
    GOAL_ACHIEVED = "one.community.goal_achieved",
    TRAVEL_SHARED = "one.community.travel_shared",
    HELPFUL_REPLY = "one.community.helpful_reply",
    MILESTONE_CELEBRATED = "one.community.milestone_celebrated",
    
    // Other Events
    GOAL_CREATED = "one.goals.goal_created",
    GOAL_COMPLETED = "one.goals.goal_completed",
    TRIP_CREATED = "one.travel.trip_created",
    MONEY_REQUEST_CREATED = "one.lending.request_created"
}

export const publishEvent = async (type: SystemEvents, payload: any, correlationId?: string) => {
    const eventarc = getEventarc();
    await eventarc.channel().publish({
        type,
        data: {
            ...payload,
            correlationId
        }
    });
};
