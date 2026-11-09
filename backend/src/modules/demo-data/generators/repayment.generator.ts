import { randomUUID } from 'crypto';
import { GeneratedLoanRepayment } from '../demo-data.types.js';
import { AmortizationMonth } from '../utils/financial.utils.js';

export function createRepaymentsFromSchedule(
  loanId: string,
  schedule: AmortizationMonth[]
): GeneratedLoanRepayment[] {
  return schedule.map((item) => ({
    id: randomUUID(),
    loanId,
    installmentNumber: item.installmentNumber,
    amount: item.amount,
    principalComponent: item.principalComponent,
    interestComponent: item.interestComponent,
    remainingBalance: item.remainingBalance,
    dueDate: item.dueDate,
    paidDate: item.paidDate,
    status: item.status,
    isDemo: true,
  }));
}
