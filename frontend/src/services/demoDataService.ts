import { AuthApi } from '@/features/authentication/services/authApi';

export type UserPersona = 'STUDENT' | 'WORKING_PROFESSIONAL' | 'FREELANCER' | 'BUSINESS_OWNER';

export interface DemoDataStatusResponse {
  isInitialized: boolean;
  status: 'NOT_INITIALIZED' | 'INITIALIZING' | 'COMPLETED' | 'FAILED';
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

export interface DemoTransaction {
  id: string;
  userId?: string;
  transactionRef: string;
  title: string;
  merchant: string;
  amount: number;
  category: string;
  type: 'INCOME' | 'EXPENSE';
  paymentMethod: 'UPI' | 'CARD' | 'BANK_TRANSFER' | 'CASH';
  date: string | Date;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  note?: string;
  isDemo: boolean;
}

export interface DemoGoal {
  id: string;
  userId?: string;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  deadline?: string | Date;
  status: 'IN_PROGRESS' | 'COMPLETED';
  progressPercentage: number;
  isDemo: boolean;
}

export interface DemoLoan {
  id: string;
  type: 'PERSONAL' | 'EDUCATION' | 'VEHICLE' | 'BUSINESS' | 'HOME';
  lenderName: string;
  principal: number;
  interestRate: number;
  tenureMonths: number;
  monthlyEmi: number;
  startDate: string | Date;
  endDate: string | Date;
  outstandingBalance: number;
  nextPaymentDate?: string | Date | null;
  status: 'ACTIVE' | 'REPAID' | 'DEFAULTED';
  isDemo: boolean;
  repayments?: any[];
}

export interface DemoCommunity {
  id: string;
  name: string;
  description: string;
  category: string;
  adminName: string;
  memberCount: number;
  membersSnapshot: Array<{
    id: string;
    name: string;
    avatar: string;
    role: string;
    totalContributed: number;
  }>;
  sharedGoal: string;
  targetAmount: number;
  totalContributions: number;
  progress: number;
  isDemo: boolean;
  contributions?: any[];
}

export interface DemoDataSummaryResponse {
  persona: UserPersona;
  status: 'COMPLETED';
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
  goals: DemoGoal[];
  loans: DemoLoan[];
  communities: DemoCommunity[];
  recentTransactions: DemoTransaction[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Fallback deterministic local dataset in case backend is offline
function createFallbackSummary(persona: UserPersona = 'WORKING_PROFESSIONAL'): DemoDataSummaryResponse {
  const initialBalance = 84500;
  const totalIncome = 135000;
  const totalExpenses = 58240;
  const closingBalance = initialBalance + totalIncome - totalExpenses;
  const netSavings = totalIncome - totalExpenses;

  return {
    persona,
    status: 'COMPLETED',
    generatedAt: new Date().toISOString(),
    generatorVersion: '1.0.0',
    financials: {
      initialBalance,
      closingBalance,
      totalIncome,
      totalExpenses,
      netSavings,
      savingsRatePercentage: Math.round((netSavings / totalIncome) * 100),
    },
    metrics: {
      transactionsCount: 56,
      completedTransactionsCount: 54,
      goalsCount: 3,
      activeLoansCount: 1,
      totalLoanDebt: 320000,
      monthlyEmiTotal: 14200,
      communitiesCount: 2,
    },
    topCategories: [
      { category: 'Rent', totalSpent: 28000, percentage: 48 },
      { category: 'Food & Dining', totalSpent: 12400, percentage: 21 },
      { category: 'Groceries', totalSpent: 8600, percentage: 15 },
      { category: 'Transport', totalSpent: 5200, percentage: 9 },
      { category: 'Subscriptions', totalSpent: 4040, percentage: 7 },
    ],
    goals: [
      {
        id: 'goal-emergency-1',
        title: '6-Month Runway Reserve',
        description: 'Safe liquid emergency corpus',
        targetAmount: 300000,
        currentAmount: 185000,
        category: 'Emergency',
        status: 'IN_PROGRESS',
        progressPercentage: 62,
        isDemo: true,
      },
      {
        id: 'goal-travel-1',
        title: 'Tokyo Autumn Holiday',
        description: 'Direct flights and traditional ryokan fund',
        targetAmount: 200000,
        currentAmount: 110000,
        category: 'Travel',
        status: 'IN_PROGRESS',
        progressPercentage: 55,
        isDemo: true,
      },
      {
        id: 'goal-vehicle-1',
        title: 'Electric Vehicle Deposit',
        description: 'Target downpayment for EV',
        targetAmount: 250000,
        currentAmount: 75000,
        category: 'Vehicle',
        status: 'IN_PROGRESS',
        progressPercentage: 30,
        isDemo: true,
      },
    ],
    loans: [
      {
        id: 'loan-car-1',
        type: 'VEHICLE',
        lenderName: 'HDFC Auto Loan',
        principal: 500000,
        interestRate: 8.75,
        tenureMonths: 48,
        monthlyEmi: 12385,
        startDate: '2025-06-15',
        endDate: '2029-06-15',
        outstandingBalance: 320000,
        nextPaymentDate: new Date(Date.now() + 14 * 86400000).toISOString(),
        status: 'ACTIVE',
        isDemo: true,
      },
    ],
    communities: [
      {
        id: 'comm-tech-1',
        name: 'Bengaluru Techies Savings Circle',
        description: 'High-yield liquid pooling and tax strategy collective',
        category: 'Wealth Building',
        adminName: 'Vikram Sen',
        memberCount: 16,
        membersSnapshot: [
          { id: '1', name: 'Vikram Sen', avatar: '', role: 'ADMIN', totalContributed: 45000 },
          { id: '2', name: 'Neha Deshmukh', avatar: '', role: 'MEMBER', totalContributed: 35000 },
          { id: '3', name: 'Karan Malhotra', avatar: '', role: 'MEMBER', totalContributed: 25000 },
        ],
        sharedGoal: 'Collective High-Yield Liquid Buffer',
        targetAmount: 500000,
        totalContributions: 285000,
        progress: 57,
        isDemo: true,
      },
      {
        id: 'comm-travel-1',
        name: 'Global Nomads Travel Fund',
        description: 'Curated circle pooling travel points and villa bookings',
        category: 'Travel',
        adminName: 'Rohan Mehra',
        memberCount: 11,
        membersSnapshot: [
          { id: '1', name: 'Rohan Mehra', avatar: '', role: 'ADMIN', totalContributed: 30000 },
          { id: '2', name: 'Pooja Varma', avatar: '', role: 'MEMBER', totalContributed: 20000 },
        ],
        sharedGoal: 'Japan Autumn Collaborative Retreat',
        targetAmount: 300000,
        totalContributions: 145000,
        progress: 48,
        isDemo: true,
      },
    ],
    recentTransactions: [
      {
        id: 'tx-1',
        transactionRef: 'TXN-DEMO-001',
        title: 'Monthly Net Salary',
        merchant: 'TechCorp India Pvt Ltd',
        amount: 95000,
        category: 'Salary',
        type: 'INCOME',
        paymentMethod: 'BANK_TRANSFER',
        date: new Date(Date.now() - 2 * 86400000).toISOString(),
        status: 'COMPLETED',
        note: 'Direct credit via NEFT',
        isDemo: true,
      },
      {
        id: 'tx-2',
        transactionRef: 'TXN-DEMO-002',
        title: 'Apartment Rent Transfer',
        merchant: 'Prestige Residency',
        amount: 28000,
        category: 'Rent',
        type: 'EXPENSE',
        paymentMethod: 'BANK_TRANSFER',
        date: new Date(Date.now() - 3 * 86400000).toISOString(),
        status: 'COMPLETED',
        isDemo: true,
      },
      {
        id: 'tx-3',
        transactionRef: 'TXN-DEMO-003',
        title: 'Groceries at Blinkit',
        merchant: 'Blinkit',
        amount: 1420,
        category: 'Groceries',
        type: 'EXPENSE',
        paymentMethod: 'UPI',
        date: new Date(Date.now() - 4 * 86400000).toISOString(),
        status: 'COMPLETED',
        isDemo: true,
      },
      {
        id: 'tx-4',
        transactionRef: 'TXN-DEMO-004',
        title: 'Dining at Blue Tokai',
        merchant: 'Blue Tokai Coffee',
        amount: 540,
        category: 'Food',
        type: 'EXPENSE',
        paymentMethod: 'UPI',
        date: new Date(Date.now() - 5 * 86400000).toISOString(),
        status: 'COMPLETED',
        isDemo: true,
      },
    ],
  };
}

export class DemoDataService {
  private static getHeaders(): Record<string, string> {
    const token = AuthApi.getAccessToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  /**
   * Initializes demo financial data for the authenticated user
   */
  static async initialize(persona?: UserPersona, force?: boolean): Promise<DemoDataSummaryResponse> {
    try {
      const res = await fetch(`${API_BASE}/demo-data/initialize`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ persona, force }),
        credentials: 'include',
      });
      const json = await res.json();
      if (res.ok && json.success && json.data) {
        return json.data;
      }
    } catch (err) {
      console.warn('[DemoDataService] Backend unavailable, using local mock summary:', err);
    }
    return createFallbackSummary(persona);
  }

  /**
   * Checks demo data status and record counts
   */
  static async getStatus(): Promise<DemoDataStatusResponse> {
    try {
      const res = await fetch(`${API_BASE}/demo-data/status`, {
        headers: this.getHeaders(),
        credentials: 'include',
      });
      const json = await res.json();
      if (res.ok && json.success && json.data) {
        return json.data;
      }
    } catch (err) {
      console.warn('[DemoDataService] Status check fallback:', err);
    }
    return {
      isInitialized: true,
      status: 'COMPLETED',
      persona: 'WORKING_PROFESSIONAL',
      recordCounts: {
        transactions: 56,
        goals: 3,
        loans: 1,
        communities: 2,
      },
    };
  }

  /**
   * Fetches full summary metrics, goals, loans, and recent transactions
   */
  static async getSummary(): Promise<DemoDataSummaryResponse> {
    try {
      const res = await fetch(`${API_BASE}/demo-data/summary`, {
        headers: this.getHeaders(),
        credentials: 'include',
      });
      const json = await res.json();
      if (res.ok && json.success && json.data) {
        return json.data;
      }
    } catch (err) {
      console.warn('[DemoDataService] Summary fetch fallback:', err);
    }
    return createFallbackSummary();
  }

  /**
   * Safely purges only demo records and regenerates fresh demo data
   */
  static async reset(persona?: UserPersona): Promise<DemoDataSummaryResponse> {
    try {
      const res = await fetch(`${API_BASE}/demo-data/reset`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ persona, confirmReset: true }),
        credentials: 'include',
      });
      const json = await res.json();
      if (res.ok && json.success && json.data) {
        return json.data;
      }
    } catch (err) {
      console.warn('[DemoDataService] Reset fallback:', err);
    }
    return createFallbackSummary(persona);
  }
}
