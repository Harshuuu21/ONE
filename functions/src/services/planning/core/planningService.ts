import { DecisionContext, BudgetPlan } from "../models/schemas";
import { getLatestIntelligence } from "../../intelligence/data/intelligenceRepository";
import { FinancialIntelligenceSnapshot } from "../../intelligence/models/schemas";
import { HttpsError } from "firebase-functions/v2/https";

// Helper to get intelligence
const fetchIntelligence = async (uid: string): Promise<FinancialIntelligenceSnapshot> => {
    const intel = await getLatestIntelligence(uid);
    if (!intel) {
        throw new HttpsError('not-found', 'No financial intelligence found for user to make a planning decision.');
    }
    return intel;
};

// Affordability Engine (Travel Check)
export const canAffordTrip = async (uid: string, estimatedCost: number): Promise<DecisionContext> => {
    const intel = await fetchIntelligence(uid);
    
    const maxCapacity = intel.features.travelCapacity;
    
    if (estimatedCost <= maxCapacity * 0.5) {
        return {
            affordability: "affordable",
            recommendation: "proceed",
            confidence: 0.9,
            reasoning: `Cost is well within the travel capacity of ${maxCapacity}.`,
            riskLevel: "low"
        };
    } else if (estimatedCost <= maxCapacity) {
        return {
            affordability: "stretch",
            recommendation: "caution",
            confidence: 0.7,
            reasoning: `Cost consumes a large portion of available capacity (${maxCapacity}).`,
            riskLevel: "moderate"
        };
    } else {
        return {
            affordability: "unaffordable",
            recommendation: "decline",
            confidence: 0.95,
            reasoning: `Cost exceeds calculated travel capacity of ${maxCapacity}.`,
            riskLevel: "high"
        };
    }
};

// Goal Optimizer (Goal Check)
export const canCreateGoal = async (uid: string, targetAmount: number): Promise<DecisionContext> => {
    const intel = await fetchIntelligence(uid);
    
    const capacity = intel.features.goalCapacity;
    
    if (targetAmount <= (capacity * 3)) { // Achievable in 3 months
        return {
            affordability: "affordable",
            recommendation: "proceed",
            confidence: 0.9,
            reasoning: `Goal can be achieved rapidly based on savings capacity.`,
            riskLevel: "low"
        };
    } else if (targetAmount <= (capacity * 12)) {
        return {
            affordability: "stretch",
            recommendation: "proceed",
            confidence: 0.8,
            reasoning: `Goal requires medium-term planning but is mathematically sound.`,
            riskLevel: "moderate"
        };
    } else {
        return {
            affordability: "unaffordable",
            recommendation: "caution",
            confidence: 0.85,
            reasoning: `Goal requires more than a year of total goal capacity. Prioritize existing goals.`,
            riskLevel: "high"
        };
    }
};

// Lending Predictor (Community Lending)
export const canLendMoney = async (uid: string, amount: number): Promise<DecisionContext> => {
    const intel = await fetchIntelligence(uid);
    
    if (intel.features.riskLevel === "high" || intel.signals.incomeStability === "volatile") {
        return {
            affordability: "unaffordable",
            recommendation: "decline",
            confidence: 0.95,
            reasoning: `Income stability is volatile. Cash reserves must be prioritized over lending.`,
            riskLevel: "high"
        };
    }

    if (amount > intel.features.cashflow * 0.1) {
        return {
            affordability: "stretch",
            recommendation: "caution",
            confidence: 0.75,
            reasoning: `Lending amount exceeds 10% of monthly cashflow.`,
            riskLevel: "moderate"
        };
    }

    return {
        affordability: "affordable",
        recommendation: "proceed",
        confidence: 0.85,
        reasoning: `Lending amount is within safe thresholds.`,
        riskLevel: "low"
    };
};

// Budget Planner
export const recommendedBudget = async (uid: string): Promise<BudgetPlan> => {
    const intel = await fetchIntelligence(uid);
    // Naive rule-based (50-30-20) modified by intelligence
    const modifier = intel.signals.expenseTrend === "increasing" ? 0.05 : 0;

    return {
        essentialAllocation: 0.50 - modifier,
        discretionaryAllocation: 0.30 - modifier,
        savingsAllocation: 0.20 + (modifier * 2),
        debtRepaymentAllocation: 0 // Placeholder
    };
};
