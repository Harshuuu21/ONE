import { CreateTripPayload, TripDocument } from "../models/schemas";
import { persistTrip } from "../data/travelRepository";
import { canAffordTrip } from "../../planning/core/planningService";
import { publishEvent, SystemEvents } from "../../../infrastructure/orchestration/eventBus";
import { aiHooks } from "../../../infrastructure/ai/aiHooks";
import { logAuditAction } from "../../../infrastructure/logger/auditLogger";

export const processCreateTrip = async (payload: CreateTripPayload, uid: string) => {
    const timestamp = new Date().toISOString();
    const correlationId = payload.correlationId || `trip_${Date.now()}`;

    // 1. Core Validation: Consult the Financial Planning Engine
    const decisionContext = await canAffordTrip(uid, payload.estimatedCost);

    // 2. Assemble Document
    const document: TripDocument = {
        uid,
        destination: payload.destination,
        estimatedCost: payload.estimatedCost,
        currency: payload.currency,
        startDate: payload.startDate,
        endDate: payload.endDate,
        affordability: decisionContext.affordability,
        status: "PLANNED",
        createdAt: timestamp,
        updatedAt: timestamp,
        correlationId
    };

    // 3. Persistence
    const tripId = await persistTrip(document);
    document.id = tripId;

    // 4. Publish Domain Event
    await publishEvent(SystemEvents.TRIP_CREATED as any, document, correlationId);

    // 5. Trigger AI Coach
    // Pass the deterministic decision context to the AI so it can explain it
    await aiHooks.triggerTravelAgent({
        uid,
        action: "trip_created",
        tripId,
        decisionContext
    });

    // 6. Audit Log
    await logAuditAction("trip_created", uid, { tripId, affordability: decisionContext.affordability }, correlationId);

    return {
        success: true,
        tripId,
        decisionContext
    };
};
