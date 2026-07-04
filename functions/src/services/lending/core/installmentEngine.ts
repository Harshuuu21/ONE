import { LoanDocument, InstallmentDocument } from "../models/schemas";
import { persistInstallments } from "../data/lendingRepository";

export const scheduleInstallments = async (loan: LoanDocument): Promise<InstallmentDocument[]> => {
    const installments: InstallmentDocument[] = [];
    
    // Generate dates monthly from today
    let currentDate = new Date();

    for (let i = 1; i <= loan.agreement.termMonths; i++) {
        currentDate.setMonth(currentDate.getMonth() + 1);
        
        installments.push({
            loanId: loan.id!,
            borrowerUid: loan.borrowerUid,
            amountDue: loan.agreement.monthlyInstallment,
            dueDate: currentDate.toISOString(),
            status: "PENDING"
        });
    }

    await persistInstallments(installments);
    return installments;
};
