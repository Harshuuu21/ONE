import { RepaymentDocument } from "../models/schemas";
import { persistRepayment } from "../data/lendingRepository";
import { publishEvent, SystemEvents } from "../../../infrastructure/orchestration/eventBus";
import { logAuditAction } from "../../../infrastructure/logger/auditLogger";

export const processRepayment = async (loanId: string, payerUid: string, amount: number, installmentId?: string) => {
    const correlationId = `repay_${Date.now()}`;
    const timestamp = new Date().toISOString();

    const repayment: RepaymentDocument = {
        loanId,
        payerUid,
        amount,
        installmentId,
        timestamp
    };

    const repaymentId = await persistRepayment(repayment);
    repayment.id = repaymentId;

    // Publish event which triggers Trust Score increases via Reputation Engine
    await publishEvent(SystemEvents.LENDING_REPAYMENT_MADE as any, repayment, correlationId);
    await logAuditAction("loan_repayment_made", payerUid, { loanId, repaymentId, amount }, correlationId);

    return { success: true, repaymentId };
};
