import { Todo } from '../types';

interface GetBacklogTodosResponse {
  backlogTodos: Todo[];
}

const LOCAL_STORAGE_BACKLOG_KEY = 'scheduler-backlog-data';

function getLocalStorageBacklogData(): Todo[] {
  const data = localStorage.getItem(LOCAL_STORAGE_BACKLOG_KEY);
  if (!data) {
    return [];
  }
  return JSON.parse(data);
}

function setLocalStorageBacklogData(backlogTodos: Todo[]) {
  const stringified = JSON.stringify(backlogTodos);
  localStorage.setItem(LOCAL_STORAGE_BACKLOG_KEY, stringified);
}

class BacklogTodosClient {
  get(): Promise<GetBacklogTodosResponse> {
    return Promise.resolve({
      backlogTodos: getLocalStorageBacklogData(),
    });
  }

  put(updatedTodos: Todo[]): Promise<Record<string, never>> {
    setLocalStorageBacklogData(updatedTodos.slice());
    return Promise.resolve({});
  }
}

export const backlogTodosClient = new BacklogTodosClient();

export default backlogTodosClient;
