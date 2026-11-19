import { SpendingCategory } from '../spending-categorization/types/index.js';

export type PeriodFilter =
  | 'THIS_WEEK'
  | 'THIS_MONTH'
  | 'LAST_MONTH'
  | 'LAST_3_MONTHS'
  | 'THIS_YEAR'
  | 'CUSTOM';

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface CategorySpendingItem {
  categoryId: SpendingCategory;
  displayName: string;
  icon: string;
  chartColor: string;
  grossSpend: number;
  refunds: number;
  netSpend: number;
  percentage: number;
  transactionCount: number;
}

export interface SpendingDistributionResponse {
  period: PeriodFilter;
  startDate: string;
  endDate: string;
  totalNetSpend: number;
  totalIncome: number;
  totalTransactions: number;
  categories: CategorySpendingItem[];
}

export interface SpendingSummaryResponse {
  period: PeriodFilter;
  startDate: string;
  endDate: string;
  totalSpend: number;
  totalIncome: number;
  netSavings: number;
  savingsRate: number; // Percentage 0 - 100
  topCategory: {
    categoryId: SpendingCategory;
    displayName: string;
    amount: number;
    percentage: number;
  } | null;
  averageDailySpend: number;
  eligibleTransactionCount: number;
}

export interface IngestTransactionInput {
  amount: number;
  title?: string;
  merchantName?: string;
  upiId?: string;
  upiHolderName?: string;
  merchantId?: string;
  mcc?: string | number;
  bankDescription?: string;
  transactionRef?: string;
  sourceTransactionId?: string;
  source?: 'ACCOUNT_AGGREGATOR' | 'BANK_FEED' | 'MANUAL' | 'PAYMENT_GATEWAY' | 'UPI';
  type?: 'EXPENSE' | 'INCOME' | 'TRANSFER';
  status?: 'COMPLETED' | 'PENDING' | 'FAILED' | 'REVERSED' | 'REFUNDED';
  isConfirmedPayment?: boolean;
  date?: string | Date;
  note?: string;
  linkedBankAccountId?: string;
  accountId?: string;
}

export interface CategoryCorrectionRequest {
  newCategory: SpendingCategory;
  rememberMerchantMapping?: boolean;
}

export interface CategoryCorrectionResponse {
  transactionId: string;
  previousCategory: string;
  originalPredictedCategory: string;
  finalCategory: SpendingCategory;
  isManuallyCorrected: boolean;
  correctionTimestamp: string;
  merchantMappingCreated: boolean;
  merchantIdentifier?: string;
  message: string;
}

export interface UserMerchantMappingDto {
  id: string;
  userId: string;
  merchantIdentifier?: string;
  merchantKey: string;
  assignedCategory: SpendingCategory;
  confirmationCount: number;
  lastConfirmedAt: string;
  isAmbiguousPersonalVpa: boolean;
}
