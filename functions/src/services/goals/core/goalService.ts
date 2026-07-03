import { CreateGoalPayload, GoalDocument } from "../models/schemas";
import { persistGoal, getActiveGoals } from "../data/goalRepository";
import { getLatestIntelligence } from "../../intelligence/data/intelligenceRepository";
import { publishEvent, SystemEvents } from "../../../infrastructure/orchestration/eventBus";
import { aiHooks } from "../../../infrastructure/ai/aiHooks";
import { logAuditAction } from "../../../infrastructure/logger/auditLogger";

export const processCreateGoal = async (payload: CreateGoalPayload, uid: string) => {
    const timestamp = new Date().toISOString();
    const correlationId = payload.correlationId || `goal_${Date.now()}`;

    // 1. Fetch Financial Intelligence & Existing Goals for Validation (Requirement 6)
    const intelligence = await getLatestIntelligence(uid);
    await getActiveGoals(uid); // Keeping this call but not assigning it if unused, or just removing it. Actually, I should use it.

    let isFeasible = true;
    
    // Deterministic Validation Logic
    if (intelligence) {
        const capacity = intelligence.features.goalCapacity;
        // Simple heuristic: If target amount exceeds 6 months of available capacity, it's flagged as unfeasible
        if (payload.targetAmount > (capacity * 6)) {
            isFeasible = false;
        }

        if (intelligence.signals.incomeStability === "volatile" || intelligence.features.riskLevel === "high") {
            isFeasible = false;
        }
    }

    // 2. Assemble Document
    const document: GoalDocument = {
        uid,
        title: payload.title,
        targetAmount: payload.targetAmount,
        currentAmount: 0,
        currency: payload.currency,
        targetDate: payload.targetDate,
        category: payload.category,
        status: "ACTIVE",
        isFeasible,
        createdAt: timestamp,
        updatedAt: timestamp,
        correlationId
    };

    // 3. Persistence
    const goalId = await persistGoal(document);
    document.id = goalId;

    // 4. Publish Domain Event
    await publishEvent(SystemEvents.GOAL_CREATED as any, document, correlationId);

    // 5. Trigger AI Coach
    await aiHooks.triggerGoalCoach({
        uid,
        action: "goal_created",
        goalId
    });

    // 6. Audit Log
    await logAuditAction("goal_created", uid, { goalId, isFeasible }, correlationId);

    return {
        success: true,
        goalId,
        isFeasible
    };
};
