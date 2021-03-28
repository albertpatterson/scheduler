import { PartialStoreType } from './schedule_slice';
import { ScheduledTodo } from '../../types';

export type ErrorSelector = (state: PartialStoreType) => string | undefined;

type ErrorSelectors = { [key: string]: ErrorSelector };

export const ERROR_SELECTORS: ErrorSelectors = {
  loadError: (state) => state.schedule.loadError,
  saveError: (state) => state.schedule.saveError,
  loadLeftoverError: (state) => state.schedule.loadLeftoverError,
  updateError: (state) => state.schedule.updateError,
};

export const SELECTORS = {
  dateNumber: (state: PartialStoreType): number | undefined =>
    state.schedule.dateNumber,
  scheduledTodos: (state: PartialStoreType): ScheduledTodo[] =>
    state.schedule.scheduledTodos,
  ...ERROR_SELECTORS,
};
