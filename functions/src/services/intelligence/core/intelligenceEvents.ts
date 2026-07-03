import { publishEvent } from "../../../infrastructure/orchestration/eventBus";
import { FinancialIntelligenceSnapshot } from "../models/schemas";

export enum IntelligenceEvents {
    SNAPSHOT_GENERATED = "one.intelligence.snapshot_generated",
    SIGNALS_UPDATED = "one.intelligence.signals_updated",
    FEATURES_UPDATED = "one.intelligence.features_updated"
}

export const publishIntelligenceUpdate = async (snapshot: FinancialIntelligenceSnapshot, correlationId: string) => {
    await publishEvent(IntelligenceEvents.SNAPSHOT_GENERATED as any, snapshot, correlationId);
    
    // Publish granular events so independent modules can listen to exactly what they need
    await publishEvent(IntelligenceEvents.SIGNALS_UPDATED as any, { uid: snapshot.uid, signals: snapshot.signals }, correlationId);
    await publishEvent(IntelligenceEvents.FEATURES_UPDATED as any, { uid: snapshot.uid, features: snapshot.features }, correlationId);
};
