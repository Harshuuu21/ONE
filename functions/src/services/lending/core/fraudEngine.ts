import { getActiveLoansForBorrower } from "../data/lendingRepository";

// Deterministic Fraud Engine
export const calculateFraudScore = async (uid: string): Promise<number> => {
    let fraudScore = 0; // 0 = no fraud, 100 = extreme risk

    const activeLoans = await getActiveLoansForBorrower(uid);

    // Rule 1: Multiple simultaneous borrowing attempts/active loans
    if (activeLoans.length >= 2) {
        fraudScore += 50;
    } else if (activeLoans.length === 1) {
        fraudScore += 20;
    }

    // Rule 2: Loan cycling (Stubbed - would check if loans were paid off immediately via another loan)
    
    // Output capped between 0 and 100
    return Math.min(100, Math.max(0, fraudScore));
};
