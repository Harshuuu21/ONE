import { randomUUID } from 'crypto';
import { GeneratedLoan, UserPersona } from '../demo-data.types.js';
import { round2, randomInRange, randomInt, randomChoice } from '../utils/random.utils.js';
import { monthsAgo, addMonths } from '../utils/date.utils.js';
import { generateAmortizationSchedule } from '../utils/financial.utils.js';
import { createRepaymentsFromSchedule } from './repayment.generator.js';

interface LoanTemplate {
  type: 'PERSONAL' | 'EDUCATION' | 'VEHICLE' | 'BUSINESS' | 'HOME';
  lenderName: string;
  minPrincipal: number;
  maxPrincipal: number;
  minRate: number;
  maxRate: number;
  tenureMonths: number;
  pastMonthsRange: [number, number];
}

const PERSONA_LOAN_TEMPLATES: Record<UserPersona, LoanTemplate[]> = {
  STUDENT: [
    {
      type: 'EDUCATION',
      lenderName: 'HDFC Credila Student Loan',
      minPrincipal: 250000,
      maxPrincipal: 600000,
      minRate: 8.9,
      maxRate: 10.2,
      tenureMonths: 48,
      pastMonthsRange: [6, 18],
    },
    {
      type: 'PERSONAL',
      lenderName: 'SBI Student Scholar Line',
      minPrincipal: 60000,
      maxPrincipal: 150000,
      minRate: 10.5,
      maxRate: 12.0,
      tenureMonths: 24,
      pastMonthsRange: [3, 9],
    },
  ],
  WORKING_PROFESSIONAL: [
    {
      type: 'VEHICLE',
      lenderName: 'HDFC Bank Auto Loan',
      minPrincipal: 400000,
      maxPrincipal: 900000,
      minRate: 8.5,
      maxRate: 9.6,
      tenureMonths: 60,
      pastMonthsRange: [8, 24],
    },
    {
      type: 'PERSONAL',
      lenderName: 'ICICI Instant Personal Credit',
      minPrincipal: 150000,
      maxPrincipal: 400000,
      minRate: 11.2,
      maxRate: 13.5,
      tenureMonths: 36,
      pastMonthsRange: [5, 14],
    },
  ],
  FREELANCER: [
    {
      type: 'PERSONAL',
      lenderName: 'Axis Professional Equipment Credit',
      minPrincipal: 100000,
      maxPrincipal: 280000,
      minRate: 12.0,
      maxRate: 14.5,
      tenureMonths: 24,
      pastMonthsRange: [4, 12],
    },
  ],
  BUSINESS_OWNER: [
    {
      type: 'BUSINESS',
      lenderName: 'Kotak Business Growth Line',
      minPrincipal: 800000,
      maxPrincipal: 2000000,
      minRate: 12.5,
      maxRate: 15.0,
      tenureMonths: 48,
      pastMonthsRange: [9, 20],
    },
    {
      type: 'VEHICLE',
      lenderName: 'Tata Motor Finance Commercial',
      minPrincipal: 500000,
      maxPrincipal: 1200000,
      minRate: 9.8,
      maxRate: 11.2,
      tenureMonths: 36,
      pastMonthsRange: [6, 15],
    },
  ],
};

export function generateLoans(userId: string, persona: UserPersona): GeneratedLoan[] {
  const templates = PERSONA_LOAN_TEMPLATES[persona] || [];
  if (templates.length === 0) return [];

  // Decide loan count based on persona:
  // STUDENT: 45% has 1 loan, 55% 0
  // FREELANCER: 50% has 1 loan, 50% 0
  // WORKING_PROFESSIONAL: 70% has 1-2 loans
  // BUSINESS_OWNER: 80% has 1-2 loans
  let targetCount = 0;
  const roll = Math.random();

  if (persona === 'STUDENT') {
    targetCount = roll < 0.45 ? 1 : 0;
  } else if (persona === 'FREELANCER') {
    targetCount = roll < 0.5 ? 1 : 0;
  } else if (persona === 'WORKING_PROFESSIONAL') {
    targetCount = roll < 0.3 ? 0 : roll < 0.8 ? 1 : 2;
  } else if (persona === 'BUSINESS_OWNER') {
    targetCount = roll < 0.2 ? 0 : roll < 0.7 ? 1 : 2;
  }

  if (targetCount === 0) return [];

  const loans: GeneratedLoan[] = [];
  const selectedTemplates = [...templates].slice(0, targetCount);

  for (const template of selectedTemplates) {
    const loanId = randomUUID();
    const principal = round2(randomInRange(template.minPrincipal, template.maxPrincipal, 0));
    const interestRate = round2(randomInRange(template.minRate, template.maxRate, 1));
    const tenureMonths = template.tenureMonths;

    // Start date in past
    const pastMonths = randomInt(template.pastMonthsRange[0], template.pastMonthsRange[1]);
    const startDate = monthsAgo(pastMonths);
    const endDate = addMonths(startDate, tenureMonths);

    const { monthlyEmi, schedule, outstandingBalance, nextPaymentDate } = generateAmortizationSchedule(
      principal,
      interestRate,
      tenureMonths,
      startDate
    );

    const repayments = createRepaymentsFromSchedule(loanId, schedule);

    const isFullyPaid = outstandingBalance <= 0;

    loans.push({
      id: loanId,
      userId,
      type: template.type,
      lenderName: template.lenderName,
      principal,
      interestRate,
      tenureMonths,
      monthlyEmi,
      startDate,
      endDate,
      outstandingBalance,
      nextPaymentDate: isFullyPaid ? null : nextPaymentDate,
      status: isFullyPaid ? 'REPAID' : 'ACTIVE',
      isDemo: true,
      repayments,
    });
  }

  return loans;
}
