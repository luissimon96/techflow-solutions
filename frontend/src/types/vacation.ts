export interface Holiday {
  date: string; // yyyy-MM-dd
  name: string;
}

export interface WorkingDays {
  mon: boolean;
  tue: boolean;
  wed: boolean;
  thu: boolean;
  fri: boolean;
  sat: boolean;
  sun: boolean;
}

export interface SearchPeriod {
  type: '12months' | 'custom';
  start?: string; // yyyy-MM-dd
  end?: string;
}

export interface LocationInfo {
  state?: string;
  city?: string;
}

export interface VacationOptions {
  totalDays: number;
  splits: number[];
  preset: string;
  customSplits: string;
  bankDays: number;
  workHoursPerDay: number;
  searchPeriod: SearchPeriod;
  workingDays: WorkingDays;
  location: LocationInfo;
  customHolidays: Holiday[];
}

export interface Suggestion {
  start: string;
  end: string;
  workingDaysConsumed: number;
  calendarSpan: number;
  gain: number;
}

