import { current } from '@reduxjs/toolkit';
import { getDayString } from '../utils/utils';

const LOCAL_STORAGE_SCHEDULE_DAYS_KEY = 'scheduler-schedules-days';
const LOCAL_STORAGE_SCHEDULE_LATEST_DAY = 'scheduler-schedules-latest-day';

function getLocalStorageDaysWithSchedule(): number[] {
  const data = localStorage.getItem(LOCAL_STORAGE_SCHEDULE_DAYS_KEY);
  if (!data) {
    return [];
  }
  const parsed = JSON.parse(data);

  return parsed;
}

function getLocalStorageLatestDayWithSchedule(): number | null {
  const data = localStorage.getItem(LOCAL_STORAGE_SCHEDULE_LATEST_DAY);
  if (!data) {
    return null;
  }
  const parsed = Number(JSON.parse(data));

  return isNaN(parsed) ? null : parsed;
}

function addLocalStorageDaysWithSchedule(dayNumber: number) {
  const currentDaysWithSchedules = getLocalStorageDaysWithSchedule();
  const updatedDaysWithSchedules = [dayNumber, ...currentDaysWithSchedules];
  const stringifiedUpdatedDaysWithSchedules = JSON.stringify(
    updatedDaysWithSchedules
  );
  localStorage.setItem(
    LOCAL_STORAGE_SCHEDULE_DAYS_KEY,
    stringifiedUpdatedDaysWithSchedules
  );

  const currentLatestDayWithSchedule = getLocalStorageLatestDayWithSchedule();
  if (
    !currentLatestDayWithSchedule ||
    dayNumber > currentLatestDayWithSchedule
  ) {
    localStorage.setItem(
      LOCAL_STORAGE_SCHEDULE_LATEST_DAY,
      JSON.stringify(dayNumber)
    );
  }
}

class DaysWithScheduleClient {
  getDaysWithSchedule(): Promise<number[]> {
    return Promise.resolve(getLocalStorageDaysWithSchedule());
  }

  addDayWithSchedule(dayNumber: number) {
    addLocalStorageDaysWithSchedule(dayNumber);
    return Promise.resolve();
  }

  getLatestDayWithSchedule(): Promise<number | null> {
    return Promise.resolve(getLocalStorageLatestDayWithSchedule());
  }
}

export const daysWithScheduleClient = new DaysWithScheduleClient();

export default daysWithScheduleClient;
