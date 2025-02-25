declare module 'date-fns' {
  export function formatDistanceToNow(
    date: Date | number,
    options?: {
      includeSeconds?: boolean;
      addSuffix?: boolean;
      locale?: Locale;
    }
  ): string;

  export function parseISO(dateString: string): Date;

  export function format(
    date: Date | number,
    format: string,
    options?: {
      locale?: Locale;
      weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
      firstWeekContainsDate?: number;
      useAdditionalWeekYearTokens?: boolean;
      useAdditionalDayOfYearTokens?: boolean;
    }
  ): string;

  export function isValid(date: any): boolean;

  export function addDays(date: Date | number, amount: number): Date;
  export function addHours(date: Date | number, amount: number): Date;
  export function addMinutes(date: Date | number, amount: number): Date;
  
  export function differenceInDays(
    dateLeft: Date | number,
    dateRight: Date | number
  ): number;

  export function differenceInHours(
    dateLeft: Date | number,
    dateRight: Date | number
  ): number;

  export function differenceInMinutes(
    dateLeft: Date | number,
    dateRight: Date | number
  ): number;

  export interface Locale {
    code?: string;
    formatDistance?: (...args: Array<any>) => any;
    formatRelative?: (...args: Array<any>) => any;
    localize?: {
      ordinalNumber: (...args: Array<any>) => any;
      era: (...args: Array<any>) => any;
      quarter: (...args: Array<any>) => any;
      month: (...args: Array<any>) => any;
      day: (...args: Array<any>) => any;
      dayPeriod: (...args: Array<any>) => any;
    };
    formatLong?: {
      date: (...args: Array<any>) => any;
      time: (...args: Array<any>) => any;
      dateTime: (...args: Array<any>) => any;
    };
    match?: {
      ordinalNumber: (...args: Array<any>) => any;
      era: (...args: Array<any>) => any;
      quarter: (...args: Array<any>) => any;
      month: (...args: Array<any>) => any;
      day: (...args: Array<any>) => any;
      dayPeriod: (...args: Array<any>) => any;
    };
    options?: {
      weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
      firstWeekContainsDate?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
    };
  }
}
