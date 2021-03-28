const LOCAL_STORAGE_SCHEDULE_DAYS_KEY = 'scheduler-schedules-days';

function getLocalStorageDaysWithSchedule(): number[] {
  const data = localStorage.getItem(LOCAL_STORAGE_SCHEDULE_DAYS_KEY);
  if (!data) {
    return [];
  }
  const parsed = JSON.parse(data);

  return parsed;
}

function getLocalStorageLatestDayWithSchedule(
  beforeDateNumber?: number
): number | null {
  const daysWithSchedule = getLocalStorageDaysWithSchedule();

  if (beforeDateNumber === undefined) {
    return daysWithSchedule.length > 0 ? daysWithSchedule[0] : null;
  }

  for (const dayWithSchedule of daysWithSchedule) {
    if (dayWithSchedule < beforeDateNumber) {
      return dayWithSchedule;
    }
  }

  return null;
}

function addLocalStorageDaysWithSchedule(dateNumber: number) {
  const currentDaysWithSchedule = getLocalStorageDaysWithSchedule();

  const updatedDaysWithSchedules = [];

  let index = 0;
  for (const dayWithSchedule of currentDaysWithSchedule) {
    if (dayWithSchedule > dateNumber) {
      updatedDaysWithSchedules.push(dayWithSchedule);
    } else if (dayWithSchedule === dateNumber) {
      return;
    } else {
      updatedDaysWithSchedules.push(dateNumber);
      break;
    }
    index++;
  }

  updatedDaysWithSchedules.push(...currentDaysWithSchedule.slice(index));

  const stringifiedUpdatedDaysWithSchedules = JSON.stringify(
    updatedDaysWithSchedules
  );
  localStorage.setItem(
    LOCAL_STORAGE_SCHEDULE_DAYS_KEY,
    stringifiedUpdatedDaysWithSchedules
  );
}

class DaysWithScheduleClient {
  getDaysWithSchedule(): Promise<number[]> {
    return Promise.resolve(getLocalStorageDaysWithSchedule());
  }

  addDayWithSchedule(dateNumber: number) {
    addLocalStorageDaysWithSchedule(dateNumber);
    return Promise.resolve();
  }

  getLatestDayWithSchedule(beforeDateNumber?: number): Promise<number | null> {
    return Promise.resolve(
      getLocalStorageLatestDayWithSchedule(beforeDateNumber)
    );
  }
}

export const daysWithScheduleClient = new DaysWithScheduleClient();

export default daysWithScheduleClient;
