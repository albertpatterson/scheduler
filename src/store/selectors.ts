import { RootState } from './store';
import { Todo } from '../types';
import {
  SELECTORS as SCHEDULE_SELECTORS,
  ERROR_SELECTORS as ERROR_SCHEDULE_SELECTORS,
  ErrorSelector as ErrorScheduleSelector,
} from './schedule_slice/selectors';
export const SELECTORS = {
  schedule: SCHEDULE_SELECTORS,
  backlog: {
    backlogTodos: (state: RootState): Todo[] => state.backlog.backlogTodos,
  },
};

export const ERROR_SELECTORS = {
  ...ERROR_SCHEDULE_SELECTORS,
};

export type ErrorSelector = ErrorScheduleSelector;
