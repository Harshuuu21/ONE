import { onCustomEventPublished } from "firebase-functions/v2/eventarc";
import { db } from "../../config/firebase";
import { logger } from "firebase-functions/v2";

export interface EventProcessorOptions {
    eventType: string;
    filters?: Record<string, string>;
    maxRetries?: number;
}

export const createIdempotentProcessor = (
    options: EventProcessorOptions,
    handler: (event: any) => Promise<void>
) => {
    return onCustomEventPublished(
        {
            eventType: options.eventType,
            filters: options.filters
        },
        async (event: any) => {
            const payload = event.data;
            if (!payload) return;

            // GCP Eventarc automatically generates a unique event.id for the delivery attempt
            const eventId = event.id; 
            const correlationId = payload.correlationId || "unknown";
            const maxRetries = options.maxRetries || 3;

            const ledgerRef = db.collection("event_ledger").doc(eventId);
            
            try {
                // 1. Idempotency Check
                const handled = await db.runTransaction(async (transaction: any) => {
                    const doc = await transaction.get(ledgerRef);
                    if (doc.exists && doc.data()?.status === "SUCCESS") {
                        return true; // Already processed
                    }
                    
                    // Mark as processing
                    transaction.set(ledgerRef, {
                        eventId,
                        correlationId,
                        status: "PROCESSING",
                        attempts: (doc.data()?.attempts || 0) + 1,
                        updatedAt: new Date().toISOString()
                    }, { merge: true });
                    
                    return false;
                });

                if (handled) {
                    logger.info(`Event ${eventId} already processed successfully. Skipping.`);
                    return;
                }

                // 2. Execute Business Logic
                await handler(event);

                // 3. Mark Success
                await ledgerRef.update({
                    status: "SUCCESS",
                    updatedAt: new Date().toISOString()
                });

            } catch (error: any) {
                logger.error(`Error processing event ${eventId}`, error);

                // 4. DLQ Strategy
                const doc = await ledgerRef.get();
                const attempts = doc.data()?.attempts || 1;

                if (attempts >= maxRetries) {
                    logger.warn(`Event ${eventId} reached max retries. Moving to DLQ.`);
                    
                    await db.collection("dlq_events").doc(eventId).set({
                        eventId,
                        correlationId,
                        eventType: options.eventType,
                        payload,
                        error: error.message || "Unknown error",
                        failedAt: new Date().toISOString()
                    });

                    await ledgerRef.update({
                        status: "DLQ",
                        updatedAt: new Date().toISOString()
                    });
                } else {
                    // Throw to trigger Eventarc's native retry
                    throw error; 
                }
            }
        }
    );
};
