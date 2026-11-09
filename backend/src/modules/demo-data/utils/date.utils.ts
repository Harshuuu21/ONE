export function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

export function monthsAgo(months: number): Date {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date;
}

export function monthsAhead(months: number): Date {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

export function randomDateBetween(start: Date, end: Date): Date {
  const startTime = start.getTime();
  const endTime = end.getTime();
  const randomTime = startTime + Math.random() * (endTime - startTime);
  return new Date(randomTime);
}

/**
 * Distributes an array of timestamps across `daysSpan` in the past up to now,
 * with realistic clusterings (more transactions around month beginnings and weekends).
 */
export function distributeDatesOverDays(count: number, daysSpan: number = 75): Date[] {
  const dates: Date[] = [];
  const now = new Date();
  const startTime = now.getTime() - daysSpan * 24 * 60 * 60 * 1000;

  for (let i = 0; i < count; i++) {
    // Generate fractional day offset with slight bias towards recent days
    const u = Math.random();
    // Power of 1.1 gives slight recency weight
    const fraction = Math.pow(u, 0.95);
    const timeOffset = fraction * (now.getTime() - startTime);
    const date = new Date(startTime + timeOffset);

    // Randomize time of day between 8:00 AM and 11:30 PM
    const hours = Math.floor(Math.random() * 16) + 8;
    const minutes = Math.floor(Math.random() * 60);
    const seconds = Math.floor(Math.random() * 60);
    date.setHours(hours, minutes, seconds, 0);

    dates.push(date);
  }

  // Sort ascending
  return dates.sort((a, b) => a.getTime() - b.getTime());
}

