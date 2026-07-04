import { DecisionContext } from "../models/schemas";
import { getLatestIntelligence } from "../../intelligence/data/intelligenceRepository";
import { getPlatformPolicies } from "../../../infrastructure/config/policyEngine";

export const generateDecisionContexts = async (uid: string): Promise<DecisionContext[]> => {
    const intel = await getLatestIntelligence(uid);
    const policies = await getPlatformPolicies();
    const timestamp = new Date().toISOString();
    const decisions: DecisionContext[] = [];

    if (!intel) return decisions;

    // Opportunity: High Cashflow
    if (intel.features.cashflow > 1000 && intel.features.savingsRate < 0.2) {
        decisions.push({
            id: `dec_${Date.now()}_1`,
            uid,
            type: "OPPORTUNITY",
            priority: "MEDIUM",
            confidence: 0.9,
            reasoning: "You have strong free cashflow but a savings rate below 20%. You have capacity to accelerate wealth creation.",
            suggestedActions: [
                { label: "Create Savings Goal", actionType: "NAVIGATE", payload: "/goals/new" }
            ],
            policyVersion: policies.version,
            createdAt: timestamp
        });
    }

    // Alert: High Expense Variance
    if (intel.signals.expenseTrend === "increasing" && intel.features.riskLevel === "high") {
        decisions.push({
            id: `dec_${Date.now()}_2`,
            uid,
            type: "WARNING",
            priority: "HIGH",
            confidence: 0.85,
            reasoning: "Your expenses are trending upward, creating a high financial risk level this month.",
            suggestedActions: [
                { label: "Review Expenses", actionType: "NAVIGATE", payload: "/intelligence/expenses" }
            ],
            policyVersion: policies.version,
            createdAt: timestamp
        });
    }

    // We can persist these or return dynamically. For now, return dynamically.
    return decisions;
};
