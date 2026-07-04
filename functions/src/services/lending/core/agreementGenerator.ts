import { LoanAgreement, LoanRequestDocument } from "../models/schemas";
import { getUnifiedTrustScore } from "../../reputation/core/trustService";

export const generateAgreement = async (request: LoanRequestDocument): Promise<LoanAgreement> => {
    const trustScore = await getUnifiedTrustScore(request.borrowerUid);

    // Deterministic Interest Rate Calculation based on Trust (e.g. 5% to 15%)
    let interestRate = 0.15; // default high risk
    if (trustScore > 80) interestRate = 0.05;
    else if (trustScore > 60) interestRate = 0.08;
    else if (trustScore > 40) interestRate = 0.12;

    const termMonths = 6; // Fixed for now, could be derived from planning/capacity
    const principal = request.decisionContext.approvedAmount;
    
    // Simple interest calculation
    const totalInterest = principal * interestRate * (termMonths / 12);
    const monthlyInstallment = (principal + totalInterest) / termMonths;
    const lateFeePenalty = monthlyInstallment * 0.10; // 10% late fee

    return {
        principal,
        interestRate,
        totalInterest,
        termMonths,
        monthlyInstallment,
        lateFeePenalty
    };
};
