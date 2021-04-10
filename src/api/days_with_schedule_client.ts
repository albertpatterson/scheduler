const LOCAL_STORAGE_SCHEDULE_DAYS_KEY = 'scheduler-schedules-days';

export interface DayWithSchedule {
  dateNumber: number;
  leftoversHandled: boolean;
}

const daysWithSchedule = [{ dateNumber: 0, leftoversHandled: false }];

function getLocalStorageDaysWithSchedule(): DayWithSchedule[] {
  // const data = localStorage.getItem(LOCAL_STORAGE_SCHEDULE_DAYS_KEY);
  // if (!data) {
  //   return [];
  // }
  // const parsed = JSON.parse(data);

  // return parsed;
  return daysWithSchedule;
}

function getLocalStorageLatestDayWithSchedule(
  beforeDateNumber?: number
): DayWithSchedule | null {
  const daysWithSchedule = getLocalStorageDaysWithSchedule();

  if (beforeDateNumber === undefined) {
    return daysWithSchedule.length > 0 ? daysWithSchedule[0] : null;
  }

  for (const dayWithSchedule of daysWithSchedule) {
    if (dayWithSchedule.dateNumber < beforeDateNumber) {
      return dayWithSchedule;
    }
  }

  return null;
}

function addLocalStorageDaysWithSchedule(dateNumber: number) {
  const currentDaysWithSchedule = getLocalStorageDaysWithSchedule();

  const updatedDaysWithSchedules: DayWithSchedule[] = [];

  let index = 0;
  for (const dayWithSchedule of currentDaysWithSchedule) {
    if (dayWithSchedule.dateNumber > dateNumber) {
      updatedDaysWithSchedules.push(dayWithSchedule);
    } else if (dayWithSchedule.dateNumber === dateNumber) {
      return;
    } else {
      updatedDaysWithSchedules.push({ dateNumber, leftoversHandled: false });
      break;
    }
    index++;
  }

  updatedDaysWithSchedules.push(...currentDaysWithSchedule.slice(index));

  setLocalStorageDaysWithSchedule(updatedDaysWithSchedules);
}

function markLeftoversAsHandledLocalStorage(dateNumber: number) {
  // const currentDaysWithSchedule = getLocalStorageDaysWithSchedule();

  // const dayWithSchedule = currentDaysWithSchedule.find(
  //   (dayWithSchedule) => dayWithSchedule.dateNumber === dateNumber
  // );
  // if (dayWithSchedule) {
  //   dayWithSchedule.leftoversHandled = true;
  //   setLocalStorageDaysWithSchedule(currentDaysWithSchedule);
  // }
  daysWithSchedule[0].leftoversHandled = true;
}

function setLocalStorageDaysWithSchedule(dayWithSchedule: DayWithSchedule[]) {
  const stringifiedUpdatedDaysWithSchedules = JSON.stringify(dayWithSchedule);
  localStorage.setItem(
    LOCAL_STORAGE_SCHEDULE_DAYS_KEY,
    stringifiedUpdatedDaysWithSchedules
  );
}

class DaysWithScheduleClient {
  getDaysWithSchedule(): Promise<DayWithSchedule[]> {
    return Promise.resolve(getLocalStorageDaysWithSchedule());
  }

  addDayWithSchedule(dateNumber: number): Promise<void> {
    addLocalStorageDaysWithSchedule(dateNumber);
    return Promise.resolve();
  }

  markLeftoverHandled(dateNumber: number): Promise<void> {
    markLeftoversAsHandledLocalStorage(dateNumber);
    return Promise.resolve();
  }

  getLatestDayWithSchedule(
    beforeDateNumber?: number
  ): Promise<DayWithSchedule | null> {
    return Promise.resolve(
      getLocalStorageLatestDayWithSchedule(beforeDateNumber)
    );
  }
}

export const daysWithScheduleClient = new DaysWithScheduleClient();

export default daysWithScheduleClient;
