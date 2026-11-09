import { round2 } from './random.utils.js';

export interface AmortizationMonth {
  installmentNumber: number;
  dueDate: Date;
  paidDate?: Date;
  amount: number;
  principalComponent: number;
  interestComponent: number;
  remainingBalance: number;
  status: 'PAID' | 'SCHEDULED' | 'OVERDUE';
}

/**
 * Calculates standard reducing-balance monthly EMI:
 * EMI = [P * r * (1 + r)^n] / [(1 + r)^n - 1]
 * where r = annualInterestRate / (12 * 100)
 */
export function calculateReducingBalanceEmi(
  principal: number,
  annualInterestRatePercent: number,
  tenureMonths: number
): number {
  if (tenureMonths <= 0) return principal;
  if (annualInterestRatePercent <= 0) {
    return round2(principal / tenureMonths);
  }

  const monthlyRate = annualInterestRatePercent / (12 * 100);
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = (principal * monthlyRate * factor) / (factor - 1);
  return round2(emi);
}

/**
 * Generates an amortization schedule for a loan from a start date,
 * splitting payments into historical (PAID) and future (SCHEDULED).
 */
export function generateAmortizationSchedule(
  principal: number,
  annualInterestRatePercent: number,
  tenureMonths: number,
  startDate: Date,
  asOfDate: Date = new Date()
): {
  monthlyEmi: number;
  schedule: AmortizationMonth[];
  outstandingBalance: number;
  nextPaymentDate: Date | null;
} {
  const monthlyEmi = calculateReducingBalanceEmi(principal, annualInterestRatePercent, tenureMonths);
  const monthlyRate = annualInterestRatePercent / (12 * 100);

  let currentBalance = principal;
  const schedule: AmortizationMonth[] = [];
  let nextPaymentDate: Date | null = null;

  for (let i = 1; i <= tenureMonths; i++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i);

    const interestComponent = round2(currentBalance * monthlyRate);
    // On the final month, principal covers whatever remains
    let principalComponent = round2(monthlyEmi - interestComponent);
    if (i === tenureMonths || principalComponent > currentBalance) {
      principalComponent = currentBalance;
    }

    const newBalance = round2(Math.max(0, currentBalance - principalComponent));
    const isPast = dueDate.getTime() <= asOfDate.getTime();

    let status: 'PAID' | 'SCHEDULED' | 'OVERDUE' = 'SCHEDULED';
    let paidDate: Date | undefined = undefined;

    if (isPast) {
      status = 'PAID';
      // Paid 1-3 days before or on due date
      paidDate = new Date(dueDate);
      paidDate.setDate(paidDate.getDate() - Math.floor(Math.random() * 3));
    } else if (!nextPaymentDate) {
      nextPaymentDate = dueDate;
    }

    schedule.push({
      installmentNumber: i,
      dueDate,
      paidDate,
      amount: round2(principalComponent + interestComponent),
      principalComponent,
      interestComponent,
      remainingBalance: newBalance,
      status,
    });

    currentBalance = newBalance;
  }

  // Calculate current outstanding principal as of today
  const lastPaid = [...schedule].reverse().find((s) => s.status === 'PAID');
  const outstandingBalance = lastPaid ? lastPaid.remainingBalance : principal;

  return {
    monthlyEmi,
    schedule,
    outstandingBalance: round2(outstandingBalance),
    nextPaymentDate,
  };
}

/**
 * Validates financial balance reconciliation:
 * Closing Balance = Opening Balance + Total Credits - Total Debits
 */
export function verifyBalanceReconciliation(
  openingBalance: number,
  credits: number,
  debits: number,
  closingBalance: number
): boolean {
  const calculated = round2(openingBalance + credits - debits);
  return Math.abs(calculated - closingBalance) < 0.05;
}

