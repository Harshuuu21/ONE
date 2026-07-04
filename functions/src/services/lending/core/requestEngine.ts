import { CreateLoanRequestPayload, LoanRequestDocument, LendingDecisionContext, ImmutableSnapshots } from "../models/schemas";
import { checkBorrowerEligibility } from "./eligibilityEngine";
import { calculateFraudScore } from "./fraudEngine";
import { calculateRisk } from "./riskAssessmentEngine";
import { calculateCreditLimit } from "./creditLimitEngine";
import { persistLoanRequest } from "../data/lendingRepository";
import { getLatestIntelligence } from "../../intelligence/data/intelligenceRepository";
import { recommendedBudget } from "../../planning/core/planningService";
import { getReputationProfile } from "../../reputation/data/reputationRepository";
import { publishEvent, SystemEvents } from "../../../infrastructure/orchestration/eventBus";
import { logAuditAction } from "../../../infrastructure/logger/auditLogger";

export const canBorrow = async (uid: string, requestedAmount: number): Promise<LendingDecisionContext> => {
    const eligibility = await checkBorrowerEligibility(uid);
    if (!eligibility.eligible) {
        return {
            approval: false,
            requestedAmount,
            approvedAmount: 0,
            creditLimit: 0,
            risk: "extreme",
            trust: 0,
            fraudScore: 0,
            confidence: 1,
            reasoning: eligibility.reason || "Ineligible."
        };
    }

    const fraudScore = await calculateFraudScore(uid);
    if (fraudScore >= 50) {
        return {
            approval: false,
            requestedAmount,
            approvedAmount: 0,
            creditLimit: 0,
            risk: "extreme",
            trust: 0,
            fraudScore,
            confidence: 0.9,
            reasoning: "Loan request denied due to fraud detection rules (e.g. active cycling)."
        };
    }

    const creditLimit = await calculateCreditLimit(uid);
    const risk = await calculateRisk(uid);
    
    // We already checked eligibility, so we have a reputation profile
    const reputation = await getReputationProfile(uid);
    const trust = reputation!.unifiedTrustScore;

    if (requestedAmount > creditLimit) {
        return {
            approval: false,
            requestedAmount,
            approvedAmount: 0, // Partial approvals could be implemented here
            creditLimit,
            risk,
            trust,
            fraudScore,
            confidence: 0.95,
            reasoning: `Requested amount exceeds calculated credit limit of ${creditLimit}.`
        };
    }

    if (risk === "extreme") {
        return {
            approval: false,
            requestedAmount,
            approvedAmount: 0,
            creditLimit,
            risk,
            trust,
            fraudScore,
            confidence: 0.95,
            reasoning: "Denied due to extreme risk profile."
        };
    }

    return {
        approval: true,
        requestedAmount,
        approvedAmount: requestedAmount,
        creditLimit,
        risk,
        trust,
        fraudScore,
        confidence: 0.85,
        reasoning: "Approved based on available credit limit and stable risk metrics."
    };
};

export const createLoanRequest = async (payload: CreateLoanRequestPayload, uid: string) => {
    const correlationId = payload.correlationId || `loan_req_${Date.now()}`;
    const timestamp = new Date().toISOString();

    const decision = await canBorrow(uid, payload.requestedAmount);

    // Capture immutable snapshots for audit and history
    const intel = await getLatestIntelligence(uid);
    const planning = await recommendedBudget(uid).catch(() => null); // Fallback if no plan
    const trustProfile = await getReputationProfile(uid);

    const snapshots: ImmutableSnapshots = {
        financial: intel!,
        planning,
        trust: trustProfile!,
        risk: { riskLevel: decision.risk, fraudScore: decision.fraudScore }
    };

    const document: LoanRequestDocument = {
        borrowerUid: uid,
        requestedAmount: payload.requestedAmount,
        purpose: payload.purpose,
        status: decision.approval ? "PENDING" : "REJECTED",
        decisionContext: decision,
        snapshots,
        createdAt: timestamp,
        updatedAt: timestamp
    };

    const requestId = await persistLoanRequest(document);
    document.id = requestId;

    await publishEvent(SystemEvents.LENDING_REQUEST_CREATED as any, document, correlationId);
    await logAuditAction("loan_request_created", uid, { requestId, approved: decision.approval }, correlationId);

    return { success: decision.approval, requestId, decisionContext: decision };
};
