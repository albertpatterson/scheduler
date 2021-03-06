import { Todo } from '../types';

const initialTodos: Todo[] = [
  {
    title: 'task 1',
    description: 'the first task',
    estimate: 30,
    priority: 0,
  },
  {
    title: 'task 2',
    description: 'the second task',
    estimate: 60,
    priority: 1,
  },
  {
    title: 'task 3',
    description: 'the third task',
    estimate: 90,
    priority: 2,
  },
];

const data = {
  todos: initialTodos,
};

interface GetBacklogTodosResponse {
  backlogTodos: Todo[];
}

class BacklogTodosClient {
  get(): Promise<GetBacklogTodosResponse> {
    return Promise.resolve({
      backlogTodos: data.todos.slice(),
    });
  }

  put(updatedTodos: Todo[]): Promise<Record<string, never>> {
    data.todos = updatedTodos.slice();
    return Promise.resolve({});
  }
}

export const backlogTodosClient = new BacklogTodosClient();

export default backlogTodosClient;
