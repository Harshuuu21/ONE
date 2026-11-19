import { DateRange, PeriodFilter } from '../spending-analytics.types.js';

/**
 * Calculates start and end timestamps for financial period filters
 * Enforces consistent UTC date boundaries and timezone safety.
 */
export function calculatePeriodDateRange(
  period: PeriodFilter = 'THIS_MONTH',
  customStart?: Date | string,
  customEnd?: Date | string,
  referenceDate: Date = new Date()
): DateRange {
  const now = new Date(referenceDate);

  switch (period) {
    case 'THIS_WEEK': {
      // Start of week (Monday 00:00:00.000)
      const day = now.getDay();
      const diffToMonday = (day === 0 ? -6 : 1) - day;
      const start = new Date(now);
      start.setDate(now.getDate() + diffToMonday);
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      return { startDate: start, endDate: end };
    }

    case 'THIS_MONTH': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      return { startDate: start, endDate: end };
    }

    case 'LAST_MONTH': {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
      const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      return { startDate: start, endDate: end };
    }

    case 'LAST_3_MONTHS': {
      const start = new Date(now.getFullYear(), now.getMonth() - 2, 1, 0, 0, 0, 0);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      return { startDate: start, endDate: end };
    }

    case 'THIS_YEAR': {
      const start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
      const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      return { startDate: start, endDate: end };
    }

    case 'CUSTOM': {
      if (!customStart) {
        // Fallback to this month if custom range is missing
        return calculatePeriodDateRange('THIS_MONTH', undefined, undefined, referenceDate);
      }
      const start = new Date(customStart);
      start.setHours(0, 0, 0, 0);

      const end = customEnd ? new Date(customEnd) : new Date(now);
      end.setHours(23, 59, 59, 999);

      if (start.getTime() > end.getTime()) {
        return { startDate: end, endDate: start };
      }
      return { startDate: start, endDate: end };
    }

    default: {
      return calculatePeriodDateRange('THIS_MONTH', undefined, undefined, referenceDate);
    }
  }
}
