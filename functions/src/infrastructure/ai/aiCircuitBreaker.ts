import { createIdempotentProcessor } from "../orchestration/eventManager";
import { SystemEvents } from "../orchestration/eventBus";
import { logger } from "firebase-functions/v2";
import { isFeatureEnabled } from "../config/featureFlags";

// This processor catches domain events and asynchronously fires AI hooks.
// Because it uses createIdempotentProcessor, it has a DLQ. If the AI API fails (e.g. rate limit),
// it will safely retry and eventually DLQ without breaking the business logic.
export const processAsyncAIHooks = createIdempotentProcessor(
    {
        eventType: "one-events",
    },
    async (event: any) => {
        const aiEnabled = await isFeatureEnabled("isAiMentorEnabled");
        if (!aiEnabled) return; // Circuit breaker explicitly opened via feature flag

        const { type } = event.data;

        try {
            switch (type) {
                case SystemEvents.COMMUNITY_POST_CREATED:
                    // Await AI generation here (e.g., triggerCommunityMentor(data.id))
                    logger.info(`Async AI hook triggered for ${type}`);
                    break;
                case SystemEvents.LENDING_LOAN_ACTIVE:
                    // Await AI explanation generation
                    logger.info(`Async AI hook triggered for ${type}`);
                    break;
            }
        } catch (error) {
            // Throwing triggers Eventarc's DLQ strategy
            logger.error(`AI API Failed for ${type}. Circuit Breaker tripped.`, error);
            throw error;
        }
    }
);
