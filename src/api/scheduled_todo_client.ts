import { ScheduledTodo } from '../types';

const mockScheduledTotos: ScheduledTodo[] = [
  {
    start: new Date(Date.now()),
    title: 'task 1',
    description: 'the first task',
    estimate: 30,
    priority: 0,
  },
  {
    start: new Date(Date.now() + 30 * 60 * 1e3),
    title: 'task 2',
    description: 'the second task',
    estimate: 60,
    priority: 1,
  },
  {
    start: new Date(Date.now() + (30 + 60) * 60 * 1e3),
    title: 'task 3',
    description: 'the third task',
    estimate: 90,
    priority: 2,
  },
];

interface GetScheduledTodosResponse {
  date: Date;
  scheduledTodos?: ScheduledTodo[];
  status: number;
  error: string | null;
}

interface PutScheduledTodosResponse {
  date: Date;
  scheduledTodos: ScheduledTodo[];
  status: number;
  error: string | null;
}

class ScheduledTodosClient {
  get(date: Date): Promise<GetScheduledTodosResponse> {
    return Promise.resolve({
      date,
      scheduledTodos: mockScheduledTotos,
      status: 200,
      error: null,
    });
  }

  put(
    date: Date,
    scheduledTodos: ScheduledTodo[]
  ): Promise<PutScheduledTodosResponse | Error> {
    // return Promise.resolve({
    //   date,
    //   scheduledTodos: scheduledTodos,
    //   status: 200,
    //   error: null,
    // });
    return Promise.reject(new Error('not a valid user'));
  }
}

export const scheduledTodosClient = new ScheduledTodosClient();

export default scheduledTodosClient;
