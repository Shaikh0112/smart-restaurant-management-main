// RESPONSIBILITY: cashier_reports_date_utils module logic and UI.
export const MS_PER_DAY = 86_400_000 as const;

/**
 * Returns the start of the current day in local time.
 */
export function getLocalMidnight(date: Date = new Date()): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

/**
 * Parses an ISO date string (YYYY-MM-DD) into a robust local midnight timestamp.
 */
export function getStartOfDayFromLocalString(dateString: string): number {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year || new Date().getFullYear(), (month || 1) - 1, day || 1).getTime();
}

/**
 * Returns a robust ISO date string for local timezone (YYYY-MM-DD).
 */
export function getLocalIsoDateString(date: Date = new Date()): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
