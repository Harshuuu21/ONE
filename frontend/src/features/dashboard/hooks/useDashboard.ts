'use client';

import { useState } from 'react';
import { DashboardService } from '../services/dashboard.service';
import type { DashboardTab, BriefingData, Insight, CalendarEvent, DashboardReportsData } from '../types';

export function useDashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('briefing');
  const briefing: BriefingData = DashboardService.getBriefing();
  const insights: Insight[] = DashboardService.getInsights();
  const calendar: CalendarEvent[] = DashboardService.getCalendarEvents();
  const reports: DashboardReportsData = DashboardService.getReports();

  return {
    activeTab,
    setActiveTab,
    briefing,
    insights,
    calendar,
    reports,
  };
}

