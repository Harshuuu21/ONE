export type UserPersona = 'STUDENT' | 'WORKING_PROFESSIONAL' | 'FREELANCER' | 'BUSINESS_OWNER';

export type DemoDataStatus = 'NOT_INITIALIZED' | 'INITIALIZING' | 'COMPLETED' | 'FAILED';

export interface GeneratedTransaction {
  id: string;
  userId: string;
  transactionRef: string;
  title: string;
  merchant: string;
  amount: number;
  category: string;
  type: 'INCOME' | 'EXPENSE';
  paymentMethod: 'UPI' | 'CARD' | 'BANK_TRANSFER' | 'CASH';
  date: Date;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  note?: string;
  isDemo: boolean;
}

export interface GeneratedGoal {
  id: string;
  userId: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  deadline: Date;
  status: 'IN_PROGRESS' | 'COMPLETED';
  progressPercentage: number;
  isDemo: boolean;
}

export interface GeneratedLoanRepayment {
  id: string;
  loanId: string;
  installmentNumber: number;
  amount: number;
  principalComponent: number;
  interestComponent: number;
  remainingBalance: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'PAID' | 'SCHEDULED' | 'OVERDUE';
  isDemo: boolean;
}

export interface GeneratedLoan {
  id: string;
  userId: string;
  type: 'PERSONAL' | 'EDUCATION' | 'VEHICLE' | 'BUSINESS' | 'HOME';
  lenderName: string;
  principal: number;
  interestRate: number;
  tenureMonths: number;
  monthlyEmi: number;
  startDate: Date;
  endDate: Date;
  outstandingBalance: number;
  nextPaymentDate: Date | null;
  status: 'ACTIVE' | 'REPAID' | 'DEFAULTED';
  isDemo: boolean;
  repayments: GeneratedLoanRepayment[];
}

export interface SimulatedMember {
  id: string;
  name: string;
  avatar: string;
  role: 'ADMIN' | 'MEMBER' | 'MODERATOR';
  joinedAt: string;
  totalContributed: number;
}

export interface GeneratedContribution {
  id: string;
  communityId: string;
  contributorName: string;
  isUserContribution: boolean;
  amount: number;
  date: Date;
  note?: string;
  isDemo: boolean;
}

export interface GeneratedCommunity {
  id: string;
  userId: string;
  name: string;
  description: string;
  category: string;
  adminName: string;
  memberCount: number;
  membersSnapshot: SimulatedMember[];
  sharedGoal: string;
  targetAmount: number;
  totalContributions: number;
  progress: number;
  isDemo: boolean;
  contributions: GeneratedContribution[];
}

export interface GeneratedDataSet {
  persona: UserPersona;
  generatorVersion: string;
  generatedAt: Date;
  initialBalance: number;
  closingBalance: number;
  totalIncome: number;
  totalExpenses: number;
  transactions: GeneratedTransaction[];
  goals: GeneratedGoal[];
  loans: GeneratedLoan[];
  communities: GeneratedCommunity[];
}

export interface DemoDataStatusResponse {
  isInitialized: boolean;
  status: DemoDataStatus;
  persona?: UserPersona;
  generatedAt?: string;
  generatorVersion?: string;
  recordCounts?: {
    transactions: number;
    goals: number;
    loans: number;
    communities: number;
  };
}

export interface DemoDataSummaryResponse {
  persona: UserPersona;
  status: DemoDataStatus;
  generatedAt: string;
  generatorVersion: string;
  financials: {
    initialBalance: number;
    closingBalance: number;
    totalIncome: number;
    totalExpenses: number;
    netSavings: number;
    savingsRatePercentage: number;
  };
  metrics: {
    transactionsCount: number;
    completedTransactionsCount: number;
    goalsCount: number;
    activeLoansCount: number;
    totalLoanDebt: number;
    monthlyEmiTotal: number;
    communitiesCount: number;
  };
  topCategories: Array<{
    category: string;
    totalSpent: number;
    percentage: number;
  }>;
  goals: GeneratedGoal[];
  loans: GeneratedLoan[];
  communities: GeneratedCommunity[];
  recentTransactions: GeneratedTransaction[];
}

export interface PersonaConfig {
  incomeRange: { min: number; max: number };
  initialBalanceRange: { min: number; max: number };
  incomeSources: Array<{
    title: string;
    merchant: string;
    category: string;
    frequencyDays: number;
    minAmount: number;
    maxAmount: number;
    paymentMethod: 'BANK_TRANSFER' | 'UPI';
  }>;
  recurringExpenses?: Array<{
    title: string;
    merchant: string;
    category: string;
    frequencyDays: number;
    minAmount: number;
    maxAmount: number;
    paymentMethod: 'BANK_TRANSFER' | 'UPI';
  }>;
  expenseCategories: Array<{
    category: string;
    weight: number;
    merchants: string[];
    minAmount: number;
    maxAmount: number;
  }>;
  preferredGoals: string[];
  loanProbability: number;
  preferredLoans: Array<{
    type: 'PERSONAL' | 'EDUCATION' | 'VEHICLE' | 'BUSINESS';
    lenderName: string;
    principalMin: number;
    principalMax: number;
    rateMin: number;
    rateMax: number;
    tenureMonths: number;
  }>;
  preferredCommunities: Array<{
    name: string;
    category: string;
    description: string;
    sharedGoal: string;
    targetAmount: number;
  }>;
}
