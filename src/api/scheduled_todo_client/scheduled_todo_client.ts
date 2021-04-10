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
    if (dateNumber === 0) {
      return Promise.resolve([
        {
          title: 'testin 1',
          description: 'asdf',
          estimate: 1,
          priority: 1,
          start: 12,
        },
        {
          title: 'testin 2',
          description: 'asdf',
          estimate: 1,
          priority: 1,
          start: 12,
        },
      ]);
    }

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

    if (
      latestDayWithSchedule === null ||
      latestDayWithSchedule.leftoversHandled
    ) {
      return {
        scheduledTodos: [],
      };
    }

    const lastScheduledTodos = await this.get(latestDayWithSchedule.dateNumber);

    // add "done" property
    const leftoverTodos = lastScheduledTodos.filter((todo) => true);
    return {
      scheduledTodos: leftoverTodos,
    };
  }

  async markLeftoverHandled(): Promise<void> {
    const today = getTodayDayNumber();
    const latestDayWithSchedule = await daysWithScheduleClient.getLatestDayWithSchedule(
      today
    );

    if (!latestDayWithSchedule) {
      return;
    }

    return daysWithScheduleClient.markLeftoverHandled(
      latestDayWithSchedule?.dateNumber
    );
  }
}

export const scheduledTodosClient = new ScheduledTodosClient();

export default scheduledTodosClient;
