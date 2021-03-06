export function isSameDay(d1: Date, d2: Date): boolean {
  return getDayString(d1) === getDayString(d2);
}

export function getDayString(date: Date): string {
  return `${date.getMonth()}-${date.getDate()}-${date.getFullYear()}`;
}
