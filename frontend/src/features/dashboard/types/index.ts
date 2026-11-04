import type { Insight, CalendarEvent } from '@/types';

export interface BriefingData {
  greeting: string;
  headline: string;
  summary: string;
  safeToSpend: number;
  safeToSpendNote: string;
  momentum: number;
}

export type DashboardTab = 'briefing' | 'calendar' | 'reports' | 'journey';

export interface DashboardReportCategory {
  label: string;
  amount: number;
  color: string;
}

export interface DashboardReportsData {
  monthlySavings: number;
  monthlySpending: number;
  categories: DashboardReportCategory[];
}

export type { Insight, CalendarEvent };

