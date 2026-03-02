import { useCallback } from 'react';
import { fetchHolidays, Holiday } from '@/lib/holidays';
import { addDays, isWeekend, differenceInCalendarDays, format } from 'date-fns';

export interface Suggestion {
  start: string; // ISO
  end: string; // ISO
  daysTaken: number; // N days from allowance
  spanDays: number; // total calendar days
  gain: number; // spanDays - daysTaken
  description?: string;
}

function iso(date: Date) {
  return format(date, 'yyyy-MM-dd');
}

function isHoliday(date: Date, holidaySet: Set<string>) {
  return holidaySet.has(iso(date));
}

export function useVacationCalculator() {
  const generateSuggestions = useCallback(
    async (year: number, splits: number[], bankHours = 0, workHoursPerDay = 8): Promise<Record<string, Suggestion[]>> => {
      const holidays: Holiday[] = await fetchHolidays(year, 'BR');
      const holidaySet = new Set(holidays.map((h) => h.date));

      const bankDays = Math.floor(bankHours / workHoursPerDay);
      const results: Record<string, Suggestion[]> = {};

      const startOfYear = new Date(year, 0, 1);
      const endOfYear = new Date(year, 11, 31);

      // Helper: count working days from start to end (inclusive)
      function countWorkingDays(start: Date, end: Date): number {
        let count = 0;
        let current = new Date(start);
        while (current <= end) {
          if (!isWeekend(current) && !isHoliday(current, holidaySet)) {
            count += 1;
          }
          current = addDays(current, 1);
        }
        return count;
      }

      // Helper: find the end date that consumes exactly N working days from start
      function findEndDateForWorkingDays(start: Date, workingDaysNeeded: number): Date | null {
        let workingDaysConsumed = 0;
        let current = new Date(start);
        let lastValidDay: Date | null = null;

        while (current <= endOfYear && workingDaysConsumed < workingDaysNeeded) {
          if (!isWeekend(current) && !isHoliday(current, holidaySet)) {
            workingDaysConsumed += 1;
            if (workingDaysConsumed === workingDaysNeeded) {
              return current;
            }
            lastValidDay = current;
          }
          current = addDays(current, 1);
        }
        return null; // Could not find enough working days
      }

      // Generate suggestions for each split
      for (const split of splits) {
        const workingDaysNeeded = Math.max(0, split - bankDays);
        const suggestions: Suggestion[] = [];

        if (workingDaysNeeded === 0) {
          // If bank days cover all, suggest today (or first business day) with full span as gain
          const today = new Date(year, 0, 2); // Start from Jan 2
          if (!isWeekend(today) && !isHoliday(today, holidaySet)) {
            suggestions.push({
              start: iso(today),
              end: iso(today),
              daysTaken: 0,
              spanDays: 1,
              gain: 1,
            });
          }
        } else {
          // For each possible start date (working day only)
          for (let d = new Date(startOfYear); d <= endOfYear; d = addDays(d, 1)) {
            if (isWeekend(d) || isHoliday(d, holidaySet)) continue;

            const endDate = findEndDateForWorkingDays(d, workingDaysNeeded);
            if (endDate) {
              const span = differenceInCalendarDays(endDate, d) + 1;
              const gain = span - workingDaysNeeded;

              suggestions.push({
                start: iso(d),
                end: iso(endDate),
                daysTaken: workingDaysNeeded,
                spanDays: span,
                gain,
              });
            }

            if (suggestions.length >= 500) break; // Limit results
          }
        }

        // Sort by gain (descending) and then by span (ascending)
        suggestions.sort((a, b) => b.gain - a.gain || a.spanDays - b.spanDays);
        const key = String(split);
        results[key] = (results[key] || []).concat(suggestions.slice(0, 10));
      }

      return results;
    },
    []
  );

  return { generateSuggestions };
}
