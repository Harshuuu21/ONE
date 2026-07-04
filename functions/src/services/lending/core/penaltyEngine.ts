import { publishEvent, SystemEvents } from "../../../infrastructure/orchestration/eventBus";
import { logAuditAction } from "../../../infrastructure/logger/auditLogger";

export const applyPenalty = async (loanId: string, borrowerUid: string, penaltyAmount: number, reason: string) => {
    const correlationId = `penalty_${Date.now()}`;

    // Publish event which strictly downgrades Reliability Score in Reputation Engine
    const payload = {
        loanId,
        borrowerUid,
        penaltyAmount,
        reason
    };

    await publishEvent(SystemEvents.LENDING_PENALTY_APPLIED as any, payload, correlationId);
    await logAuditAction("loan_penalty_applied", borrowerUid, payload, correlationId);

    return { success: true };
};
