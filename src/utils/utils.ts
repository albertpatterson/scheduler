import { MS_IN_MIN, MS_IN_DAY } from '../constants';

export function isSameDay(d1: Date, d2: Date): boolean {
  return getDayString(d1) === getDayString(d2);
}

export function getDayString(dateRep: Date | number): string {
  const date = typeof dateRep === 'number' ? getDate(dateRep) : dateRep;
  return `${date.getMonth()}-${date.getDate()}-${date.getFullYear()}`;
}

export function getDayNumber(date: Date): number {
  const timezoneOffset = getTimezoneOffset();

  return Math.floor((date.valueOf() - timezoneOffset) / MS_IN_DAY);
}

export function getDate(dayNumber: number): Date {
  const timezoneOffset = getTimezoneOffset();
  const offsetDate = new Date(dayNumber * MS_IN_DAY + timezoneOffset);
  return offsetDate;
}

export function getTodayDateNumber(): number {
  return getDayNumber(new Date());
}

export function getNowMinute(): number {
  const date = new Date();
  return date.getHours() * 60 + date.getMinutes();
}

function getTimezoneOffset() {
  return new Date().getTimezoneOffset() * MS_IN_MIN;
}
