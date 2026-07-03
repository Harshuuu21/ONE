export type SnapshotType = "current" | "daily" | "weekly" | "monthly";

export interface FinancialSignals {
    incomeStability: "stable" | "variable" | "volatile";
    expenseTrend: "increasing" | "stable" | "decreasing";
    lifestyleInflation: boolean;
    savingsMomentum: "strong" | "neutral" | "weak";
    emergencyRisk: "low" | "medium" | "high";
    budgetDrift: number; // Percentage deviation from norm
}

export interface FinancialFeatures {
    savingsRate: number;
    cashflow: number;
    financialHealthScore: number; // 0-100
    incomeStabilityScore: number; // 0-100
    expenseVariance: number;
    riskLevel: "low" | "moderate" | "high";
    goalCapacity: number; // Discretionary income available for goals
    travelCapacity: number; // Sub-allocation for travel
}

export interface FinancialPredictions {
    predictedEndOfMonthBalance: number;
    predictedSavings: number;
    shortfallRisk: boolean;
}

export interface FinancialIntelligenceSnapshot {
    uid: string;
    type: SnapshotType;
    periodId: string; // e.g. "2026-07" for monthly, "2026-07-03" for daily
    signals: FinancialSignals;
    features: FinancialFeatures;
    predictions: FinancialPredictions;
    updatedAt: string;
}
