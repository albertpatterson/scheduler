import { RootState } from './store';
import { Todo } from '../types';
import { SELECTORS as SCHEDULE_SELECTORS } from './schedule_slice/selectors';
export const SELECTORS = {
  schedule: SCHEDULE_SELECTORS,
  backlog: {
    backlogTodos: (state: RootState): Todo[] => state.backlog.backlogTodos,
  },
};
