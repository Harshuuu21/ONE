import { FinancialIntelligenceSnapshot, FinancialFeatures, FinancialSignals, FinancialPredictions } from "../models/schemas";
import { persistIntelligenceSnapshot } from "../data/intelligenceRepository";
import { publishIntelligenceUpdate } from "./intelligenceEvents";
import { logAuditAction } from "../../../infrastructure/logger/auditLogger";

export const processIntelligenceUpdate = async (transaction: any, correlationId: string) => {
    const uid = transaction.createdBy;
    const timestamp = new Date().toISOString();
    
    // In a real system, we would query the last N months of transactions to run the deterministic algorithms.
    // For this MVP vertical slice, we simulate the deterministic math pipeline.

    const features: FinancialFeatures = {
        savingsRate: 0.15, // 15%
        cashflow: 1200, 
        financialHealthScore: 78,
        incomeStabilityScore: 92,
        expenseVariance: 0.05,
        riskLevel: "low",
        goalCapacity: 450,
        travelCapacity: 150
    };

    const signals: FinancialSignals = {
        incomeStability: "stable",
        expenseTrend: "stable",
        lifestyleInflation: false,
        savingsMomentum: "strong",
        emergencyRisk: "low",
        budgetDrift: 0.02
    };

    const predictions: FinancialPredictions = {
        predictedEndOfMonthBalance: 2400,
        predictedSavings: 450,
        shortfallRisk: false
    };

    // Build Current Snapshot
    const currentSnapshot: FinancialIntelligenceSnapshot = {
        uid,
        type: "current",
        periodId: "latest",
        features,
        signals,
        predictions,
        updatedAt: timestamp
    };

    // Persist
    await persistIntelligenceSnapshot(currentSnapshot);

    // Broadcast Features and Signals for AI and downstream consumption
    await publishIntelligenceUpdate(currentSnapshot, correlationId);
    
    await logAuditAction("financial_intelligence_updated", uid, { type: "current" }, correlationId);
};
