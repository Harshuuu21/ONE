import { onCustomEventPublished } from "firebase-functions/v2/eventarc";
import { processIntelligenceUpdate } from "../core/intelligenceService";

export const onTransactionProcessed = onCustomEventPublished(
    "one.financial.transaction_processed",
    async (event) => {
        const payload = event.data;
        const correlationId = payload.correlationId || "unknown";

        // Route the domain event into the deterministic intelligence pipeline
        await processIntelligenceUpdate(payload, correlationId);
    }
);
