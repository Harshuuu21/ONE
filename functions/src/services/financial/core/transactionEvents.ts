import { publishEvent } from "../../../infrastructure/orchestration/eventBus";

export enum FinancialEvents {
    TRANSACTION_PROCESSED = "one.financial.transaction_processed",
    
    // AI Hooks
    ANALYZE_TRANSACTION_AI = "one.ai.analyze_transaction",
    
    // Placeholder Hooks for Analytics/Orchestration
    UPDATE_FINANCIAL_HEALTH = "one.analytics.update_financial_health",
    UPDATE_SAVINGS_RATE = "one.analytics.update_savings_rate",
    UPDATE_CASHFLOW = "one.analytics.update_cashflow",
    UPDATE_GOAL_PROGRESS = "one.goals.update_progress",
    ANALYZE_RISK = "one.analytics.analyze_risk",
    UPDATE_EXPENSE_ANALYTICS = "one.analytics.update_expense"
}

export const publishTransactionEvents = async (transaction: any, correlationId: string) => {
    // 1. Primary Domain Event
    await publishEvent(FinancialEvents.TRANSACTION_PROCESSED as any, transaction, correlationId);
    
    // 2. AI independent task publication (Decoupled from specific coach)
    await publishEvent(FinancialEvents.ANALYZE_TRANSACTION_AI as any, { transactionId: transaction.id }, correlationId);

    // 3. Trigger Analytics & Metric Hooks
    await publishEvent(FinancialEvents.UPDATE_FINANCIAL_HEALTH as any, { uid: transaction.createdBy }, correlationId);
    await publishEvent(FinancialEvents.UPDATE_SAVINGS_RATE as any, { uid: transaction.createdBy }, correlationId);
    await publishEvent(FinancialEvents.UPDATE_CASHFLOW as any, { uid: transaction.createdBy }, correlationId);
    await publishEvent(FinancialEvents.UPDATE_GOAL_PROGRESS as any, { uid: transaction.createdBy }, correlationId);
    await publishEvent(FinancialEvents.ANALYZE_RISK as any, { uid: transaction.createdBy }, correlationId);
    await publishEvent(FinancialEvents.UPDATE_EXPENSE_ANALYTICS as any, { uid: transaction.createdBy }, correlationId);
};
