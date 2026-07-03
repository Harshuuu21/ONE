export interface DecisionContext {
    affordability: "affordable" | "stretch" | "unaffordable";
    recommendation: "proceed" | "caution" | "decline";
    confidence: number; // 0-1
    reasoning: string;
    riskLevel: "low" | "moderate" | "high";
}

export interface BudgetPlan {
    essentialAllocation: number;
    discretionaryAllocation: number;
    savingsAllocation: number;
    debtRepaymentAllocation: number;
}
