import { ScheduledTodo } from '../../types';
import { getDayString } from '../../utils/utils';
import { daysWithScheduleClient } from '../days_with_schedule_client';
import { getTodayDayNumber } from 'utils/utils';

const LOCAL_STORAGE_SCHEDULE_KEY_PREFIX = 'scheduler-scheduled-';
function getLocalStorageScheduleKey(dateNumber: number) {
  return LOCAL_STORAGE_SCHEDULE_KEY_PREFIX + getDayString(dateNumber);
}

function getLoclStorageScheduledTodos(dateNumber: number): ScheduledTodo[] {
  const key = getLocalStorageScheduleKey(dateNumber);
  const data = localStorage.getItem(key);
  if (!data) {
    return [];
  }
  const parsed = JSON.parse(data);

  return parsed;
}

function setLocalStorageBacklogData(
  dateNumber: number,
  scheduledTodo: ScheduledTodo[]
) {
  const stringified = JSON.stringify(scheduledTodo);
  const key = getLocalStorageScheduleKey(dateNumber);
  localStorage.setItem(key, stringified);
}

export interface LeftoverTodosData {
  scheduledTodos: ScheduledTodo[];
}

export class ScheduledTodosClient {
  get(dateNumber: number): Promise<ScheduledTodo[]> {
    return Promise.resolve(getLoclStorageScheduledTodos(dateNumber));
  }

  put(
    dateNumber: number,
    scheduledTodos: ScheduledTodo[]
  ): Promise<Record<string, never>> {
    setLocalStorageBacklogData(dateNumber, scheduledTodos);
    return Promise.resolve({});
  }

  async getLeftover(): Promise<LeftoverTodosData> {
    const today = getTodayDayNumber();
    const latestDayWithSchedule = await daysWithScheduleClient.getLatestDayWithSchedule(
      today
    );

    if (latestDayWithSchedule === null) {
      return {
        scheduledTodos: [],
      };
    }

    const lastScheduledTodos = await this.get(latestDayWithSchedule);

    // add "done" property
    const leftoverTodos = lastScheduledTodos.filter((todo) => false);
    return {
      scheduledTodos: leftoverTodos,
    };
  }
}

export const scheduledTodosClient = new ScheduledTodosClient();

export default scheduledTodosClient;
