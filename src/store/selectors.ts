import { RootState } from './store';
import { ScheduledTodo, Todo } from '../types';
export const SELECTORS = {
  schedule: {
    scheduledTodos: (state: RootState): ScheduledTodo[] =>
      state.schedule.scheduledTodos,
  },
  backlog: {
    backlogTodos: (state: RootState): Todo[] => state.backlog.backlogTodos,
  },
};
