import { z } from "zod";
import { FinancialIntelligenceSnapshot } from "../../intelligence/models/schemas";
import { ReputationProfileDocument } from "../../reputation/models/schemas";
import { BudgetPlan } from "../../planning/models/schemas";

export interface LendingDecisionContext {
    approval: boolean;
    requestedAmount: number;
    approvedAmount: number;
    creditLimit: number;
    risk: "low" | "moderate" | "high" | "extreme";
    trust: number;
    fraudScore: number;
    confidence: number;
    reasoning: string;
}

export interface ImmutableSnapshots {
    financial: FinancialIntelligenceSnapshot;
    planning: BudgetPlan | null;
    trust: ReputationProfileDocument;
    risk: any; // We can type this strictly later
}

export interface LoanRequestDocument {
    id?: string;
    borrowerUid: string;
    requestedAmount: number;
    purpose: string;
    status: "PENDING" | "MATCHED" | "REJECTED" | "CANCELLED";
    decisionContext: LendingDecisionContext;
    snapshots: ImmutableSnapshots;
    createdAt: string;
    updatedAt: string;
}

export interface LoanAgreement {
    principal: number;
    interestRate: number;
    totalInterest: number;
    termMonths: number;
    monthlyInstallment: number;
    lateFeePenalty: number;
}

export interface LoanDocument {
    id?: string;
    requestId: string;
    borrowerUid: string;
    lenderUid: string;
    agreement: LoanAgreement;
    status: "ACTIVE" | "COMPLETED" | "DEFAULTED";
    createdAt: string;
    updatedAt: string;
}

export interface InstallmentDocument {
    id?: string;
    loanId: string;
    borrowerUid: string;
    amountDue: number;
    dueDate: string;
    status: "PENDING" | "PAID" | "LATE" | "DEFAULTED";
}

export interface RepaymentDocument {
    id?: string;
    installmentId?: string;
    loanId: string;
    payerUid: string;
    amount: number;
    timestamp: string;
}

export const CreateLoanRequestSchema = z.object({
    requestedAmount: z.number().positive(),
    purpose: z.string(),
    correlationId: z.string().optional()
});

export type CreateLoanRequestPayload = z.infer<typeof CreateLoanRequestSchema>;
