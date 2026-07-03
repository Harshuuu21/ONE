import { getEventarc } from "firebase-admin/eventarc";

// Define all major system events
export enum SystemEvents {
    USER_CREATED = "one.identity.user_created",
    TRANSACTION_CREATED = "one.financial.transaction_created",
    GOAL_COMPLETED = "one.goals.goal_completed",
    TRIP_CREATED = "one.travel.trip_created",
    COMMUNITY_POST_CREATED = "one.community.post_created",
    MONEY_REQUEST_CREATED = "one.lending.request_created"
}

export const publishEvent = async (type: SystemEvents, payload: any) => {
    const eventarc = getEventarc();
    await eventarc.channel().publish({
        type,
        data: payload
    });
};
