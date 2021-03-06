import { MS_IN_MIN, MS_IN_DAY } from '../constants';

export function isSameDay(d1: Date, d2: Date): boolean {
  return getDayString(d1) === getDayString(d2);
}

export function getDayString(dateRep: Date | number): string {
  const date = typeof dateRep === 'number' ? getDate(dateRep) : dateRep;
  return `${date.getMonth()}-${date.getDate()}-${date.getFullYear()}`;
}

export function getDayNumber(date: Date): number {
  return Math.floor(date.valueOf() / MS_IN_DAY);
}

export function getDate(dayNumber: number): Date {
  const now = new Date();
  const timeZoneOffset = now.getTimezoneOffset() * MS_IN_MIN;
  return new Date(dayNumber * MS_IN_DAY + timeZoneOffset);
}

export function getTodayDateNumber(): number {
  return getDayNumber(new Date());
}
