import { getActiveLoansForLender } from "../data/lendingRepository";
import { getLatestIntelligence } from "../../intelligence/data/intelligenceRepository";

export const canLenderTakeExposure = async (lenderUid: string, requestedAmount: number): Promise<boolean> => {
    const activeLoans = await getActiveLoansForLender(lenderUid);
    const currentExposure = activeLoans.reduce((sum, loan) => sum + loan.agreement.principal, 0);

    const intel = await getLatestIntelligence(lenderUid);
    if (!intel) return false;

    // Lender can only expose up to 20% of their total cashflow across all loans
    const maxExposure = intel.features.cashflow * 0.20;

    return (currentExposure + requestedAmount) <= maxExposure;
};
