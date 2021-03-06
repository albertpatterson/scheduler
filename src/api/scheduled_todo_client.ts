import { ScheduledTodo } from '../types';
import { getDayString } from '../utils/utils';

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
  dateNumber: number,
  scheduledTodo: ScheduledTodo[]
) {
  const stringified = JSON.stringify(scheduledTodo);
  const key = getLocalStorageScheduleKey(dateNumber);
  localStorage.setItem(key, stringified);
}

interface GetScheduledTodosResponse {
  dateNumber: number;
  scheduledTodos?: ScheduledTodo[];
}

class ScheduledTodosClient {
  get(dateNumber: number): Promise<GetScheduledTodosResponse> {
    return Promise.resolve({
      dateNumber,
      scheduledTodos: getLoclStorageScheduledTodos(dateNumber),
    });
  }

  put(
    dateNumber: number,
    scheduledTodos: ScheduledTodo[]
  ): Promise<Record<string, never>> {
    setLocalStorageBacklogData(dateNumber, scheduledTodos);
    return Promise.resolve({});
  }
}

export const scheduledTodosClient = new ScheduledTodosClient();

export default scheduledTodosClient;
