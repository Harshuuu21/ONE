import { LoanRequestDocument, LoanDocument } from "../models/schemas";
import { persistLoan } from "../data/lendingRepository";
import { generateAgreement } from "./agreementGenerator";
import { scheduleInstallments } from "./installmentEngine";
import { publishEvent, SystemEvents } from "../../../infrastructure/orchestration/eventBus";
import { logAuditAction } from "../../../infrastructure/logger/auditLogger";

export const transitionToActiveLoan = async (request: LoanRequestDocument, lenderUid: string) => {
    const correlationId = `lifecycle_${Date.now()}`;
    const timestamp = new Date().toISOString();

    const agreement = await generateAgreement(request);

    const loan: LoanDocument = {
        requestId: request.id!,
        borrowerUid: request.borrowerUid,
        lenderUid,
        agreement,
        status: "ACTIVE",
        createdAt: timestamp,
        updatedAt: timestamp
    };

    const loanId = await persistLoan(loan);
    loan.id = loanId;

    await scheduleInstallments(loan);

    await publishEvent(SystemEvents.LENDING_LOAN_ACTIVE as any, loan, correlationId);
    await logAuditAction("loan_activated", request.borrowerUid, { loanId, lenderUid }, correlationId);

    return { success: true, loanId };
};
