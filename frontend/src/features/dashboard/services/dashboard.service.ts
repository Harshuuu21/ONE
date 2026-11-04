import { briefing, insights, calendarEvents, reports } from '@/lib/one-data';
import type { BriefingData, DashboardReportsData, CalendarEvent, Insight } from '../types';

export class DashboardService {
  static getBriefing(): BriefingData {
    return briefing;
  }

  static getInsights(): Insight[] {
    return insights;
  }

  static getCalendarEvents(): CalendarEvent[] {
    return calendarEvents;
  }

  static getReports(): DashboardReportsData {
    return reports;
  }
}

