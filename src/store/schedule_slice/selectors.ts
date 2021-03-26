import { PartialStoreType } from './schedule_slice';
import { ScheduledTodo } from '../../types';

export const SELECTORS = {
  dateNumber: (state: PartialStoreType): number | undefined =>
    state.schedule.dateNumber,
  scheduledTodos: (state: PartialStoreType): ScheduledTodo[] =>
    state.schedule.scheduledTodos,
  loadError: (state: PartialStoreType): string | undefined =>
    state.schedule.loadError,
  saveError: (state: PartialStoreType): string | undefined =>
    state.schedule.saveError,
};
