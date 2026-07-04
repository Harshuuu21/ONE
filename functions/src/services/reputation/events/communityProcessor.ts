import { onCustomEventPublished } from "firebase-functions/v2/eventarc";
import { SystemEvents } from "../../../infrastructure/orchestration/eventBus";
import { applyReputationEvent } from "../core/trustService";
import { logger } from "firebase-functions/v2";

export const processCommunityEventsForReputation = onCustomEventPublished(
    {
        eventType: "one-events",
        filters: { type: "community_events" } // Wildcard logic applied in handler
    },
    async (event: any) => {
        const payload = event.data;
        if (!payload) return;

        const { type, data, correlationId } = payload;
        const uid = data.authorId || data.uid || data.createdBy;
        if (!uid) return;

        try {
            switch (type) {
                case SystemEvents.COMMUNITY_POST_CREATED:
                    await applyReputationEvent(uid, type, correlationId, {
                        contributionScore: 2,
                        engagementScore: 1
                    });
                    break;
                case SystemEvents.HELPFUL_REPLY:
                    await applyReputationEvent(uid, type, correlationId, {
                        knowledgeScore: 5,
                        collaborationScore: 3
                    });
                    break;
                case SystemEvents.CHALLENGE_COMPLETED:
                    await applyReputationEvent(uid, type, correlationId, {
                        reliabilityScore: 10,
                        collaborationScore: 5
                    });
                    break;
                case SystemEvents.GOAL_ACHIEVED:
                    await applyReputationEvent(uid, type, correlationId, {
                        reliabilityScore: 5
                    });
                    break;
                // Add more cases as needed for specific deterministic score adjustments
            }
        } catch (error) {
            logger.error(`Failed to process reputation event ${type}`, error);
        }
    }
);
