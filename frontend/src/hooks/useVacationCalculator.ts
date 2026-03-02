import { useCallback } from 'react';
import { Holiday } from '@/lib/holidays';
import { addDays, isWeekend, differenceInCalendarDays } from 'date-fns';
import {
  VacationOptions,
  Suggestion,
  WorkingDays,
  SearchPeriod,
  LocationInfo,
} from '@/types/vacation';

// helper for working‑day mask
function isWorkingDay(date: Date, mask: WorkingDays): boolean {
  const d = date.getDay();
  switch (d) {
    case 0:
      return mask.sun;
    case 1:
      return mask.mon;
    case 2:
      return mask.tue;
    case 3:
      return mask.wed;
    case 4:
      return mask.thu;
    case 5:
      return mask.fri;
    case 6:
      return mask.sat;
  }
  return false;
}

export function useVacationCalculator(
  national: Holiday[],
  getStateHolidays: (state?: string) => Holiday[],
  getMunicipalHolidays: (state?: string, city?: string) => Holiday[],
) {
  /**
   * Given the current options, compute a merged holiday list (unique by date).
   */
  const mergeHolidays = (opts: VacationOptions): Holiday[] => {
    const map = new Map<string, Holiday>();
    national.concat(
      getStateHolidays(opts.location.state),
      getMunicipalHolidays(opts.location.state, opts.location.city),
      opts.customHolidays,
    ).forEach(h => map.set(h.date, h));
    return Array.from(map.values());
  };

  const generateSuggestions = useCallback(
    async (opts: VacationOptions): Promise<Record<string, Suggestion[]>> => {
      const allHolidays = mergeHolidays(opts);
      const holidaySet = new Set(allHolidays.map(h => h.date));

      const startDate =
        opts.searchPeriod.type === 'custom' && opts.searchPeriod.start
          ? new Date(opts.searchPeriod.start)
          : new Date();
      const endDate =
        opts.searchPeriod.type === 'custom' && opts.searchPeriod.end
          ? new Date(opts.searchPeriod.end)
          : addDays(startDate, 365);

      const bankDays = opts.bankDays;

      const grouped: Record<string, Suggestion[]> = {};

      function isHoliday(date: Date): boolean {
        return holidaySet.has(date.toISOString().slice(0, 10));
      }

      function findEnd(start: Date, need: number): Date | null {
        let count = 0;
        let cur = new Date(start);
        while (cur <= endDate) {
          if (isWorkingDay(cur, opts.workingDays) && !isHoliday(cur)) {
            count += 1;
            if (count === need) return cur;
          }
          cur = addDays(cur, 1);
        }
        return null;
      }

      opts.splits.forEach(split => {
        const key = String(split);
        grouped[key] = [];
        const need = Math.max(0, split - bankDays);
        for (let d = new Date(startDate); d <= endDate; d = addDays(d, 1)) {
          if (!isWorkingDay(d, opts.workingDays)) continue;
          if (isHoliday(d)) continue;
          if (need === 0) {
            const span = 1;
            grouped[key].push({ start: d.toISOString().slice(0, 10), end: d.toISOString().slice(0, 10), workingDaysConsumed: 0, calendarSpan: span, gain: span });
          } else {
            const end = findEnd(d, need);
            if (end) {
              const span = differenceInCalendarDays(end, d) + 1;
              grouped[key].push({ start: d.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10), workingDaysConsumed: need, calendarSpan: span, gain: span - need });
            }
          }
          if (grouped[key].length >= 10) break; // limit per split
        }
        grouped[key].sort((a, b) => b.gain - a.gain || a.calendarSpan - b.calendarSpan);
      });

      return grouped;
    },
    [national, getStateHolidays, getMunicipalHolidays],
  );

  return { generateSuggestions };
}
