import { promises } from 'dns';
import { ScheduledTodo } from '../types';
import { getDayString } from '../utils/utils';

const LOCAL_STORAGE_SCHEDULE_KEY_PREFIX = 'scheduler-scheduled-';
function getLocalStorageScheduleKey(date: Date) {
  return LOCAL_STORAGE_SCHEDULE_KEY_PREFIX + getDayString(date);
}

function getLoclStorageScheduledTodos(date: Date): ScheduledTodo[] {
  const key = getLocalStorageScheduleKey(date);
  const data = localStorage.getItem(key);
  if (!data) {
    return [];
  }
  const parsed = JSON.parse(data);
  return parsed
    .map(parseScheduledTodo)
    .filter((item: ScheduledTodo | null) => Boolean(item));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseScheduledTodo(data: any): ScheduledTodo | null {
  if (
    typeof data.description !== 'string' ||
    typeof data.priority !== 'number' ||
    typeof data.estimate !== 'number' ||
    typeof data.title !== 'string' ||
    typeof data.start !== 'string'
  ) {
    return null;
  }

  return {
    ...data,
    start: new Date(data.start),
  };
}

function setLocalStorageBacklogData(
  date: Date,
  scheduledTodo: ScheduledTodo[]
) {
  const stringified = JSON.stringify(scheduledTodo);
  const key = getLocalStorageScheduleKey(date);
  localStorage.setItem(key, stringified);
}

interface GetScheduledTodosResponse {
  date: Date;
  scheduledTodos?: ScheduledTodo[];
}

class ScheduledTodosClient {
  get(date: Date): Promise<GetScheduledTodosResponse> {
    return Promise.resolve({
      date,
      scheduledTodos: getLoclStorageScheduledTodos(date),
    });
  }

  put(
    date: Date,
    scheduledTodos: ScheduledTodo[]
  ): Promise<Record<string, never>> {
    setLocalStorageBacklogData(date, scheduledTodos);
    return Promise.resolve({});
  }
}

export const scheduledTodosClient = new ScheduledTodosClient();

export default scheduledTodosClient;
