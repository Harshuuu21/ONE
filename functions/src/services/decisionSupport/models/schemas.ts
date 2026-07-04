export interface DecisionAction {
    label: string;
    actionType: "NAVIGATE" | "API_CALL";
    payload: string;
}

export interface DecisionContext {
    id: string;
    uid: string;
    type: "RECOMMENDATION" | "ALERT" | "WARNING" | "OPPORTUNITY" | "NEXT_BEST_ACTION";
    priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    confidence: number;
    reasoning: string;
    suggestedActions: DecisionAction[];
    policyVersion: string;
    createdAt: string;
}
