import axios from 'axios';

export interface Holiday {
  date: string; // ISO yyyy-mm-dd
  localName: string;
  name: string;
  countryCode: string;
}

export async function fetchHolidays(year: number, country = 'BR'): Promise<Holiday[]> {
  try {
    const res = await axios.get<Holiday[]>(`https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`);
    return res.data || [];
  } catch (err) {
    // Fallback: return empty array and let consumer handle
    return [];
  }
}

export function holidayDatesSet(holidays: Holiday[]) {
  return new Set(holidays.map((h) => h.date));
}
