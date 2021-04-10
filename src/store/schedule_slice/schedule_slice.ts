import { createSlice } from '@reduxjs/toolkit';
import { ScheduledTodo } from '../../types';
import { loadScheduledTodos } from './load_scheduled_todos/load_scheduled_todos';
import { loadLeftoverTodos } from './load_leftover_todos/load_leftover_todos';
import { markLeftoverHandled } from './mark_leftover_handled/mark_leftover_handled';
import { updateScheduledTodos } from './update_scheduled_todos/update_scheduled_todos_base';
import { saveScheduledTodos } from './update_scheduled_todos/save_scheduled_todos/save_scheduled_todos';

const DEFAULT_LOAD_SCHEDULED_TODO_ERROR_MESSAGE =
  'An error occured loading scheduled todos';

const DEFAULT_LOAD_LEFTOVER_TODO_ERROR_MESSAGE =
  'An error occured loading leftover todos';

const DEFAULT_MARK_LEFTOVER_HANDLED_ERROR_MESSAGE =
  'An error occurd making leftover todos as handled';

const DEFAULT_SAVE_SCHEDULED_TODO_ERROR_MESSAGE =
  'An error occured saving scheduled todos';

const DEFAULT_UPDATE_SCHEDULED_TODO_ERROR_MESSAGE =
  'An error occured updateding scheduled todos';

export interface ScheduleSlice {
  dateNumber?: number;
  scheduledTodos: ScheduledTodo[];
  leftoverTodos: ScheduledTodo[];
  loadError?: string;
  loadLeftoverError?: string;
  saveError?: string;
  updateError?: string;
  markLeftoverError?: string;
}
export interface PartialStoreType {
  schedule: ScheduleSlice;
}

const initialState: ScheduleSlice = {
  scheduledTodos: [],
  leftoverTodos: [],
};

export const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadScheduledTodos.fulfilled, (state, action) => {
      const { dateNumber, scheduledTodos } = action.payload;
      setScheduledTodos(state, dateNumber, scheduledTodos);
      setLoadError(state, undefined);
    });

    builder.addCase(loadScheduledTodos.rejected, (state, action) => {
      if (action.payload) {
        const { dateNumber, error } = action.payload;
        setScheduledTodos(state, dateNumber, []);
        setLoadError(state, error.message);
      } else {
        clearScheduledTodos(state);
        setLoadError(state, DEFAULT_LOAD_SCHEDULED_TODO_ERROR_MESSAGE);
      }
    });

    builder.addCase(loadLeftoverTodos.fulfilled, (state, action) => {
      const { scheduledTodos } = action.payload;
      setLeftoverTodos(state, scheduledTodos);
      setLoadLeftoverError(state, undefined);
    });

    builder.addCase(loadLeftoverTodos.rejected, (state, action) => {
      setLeftoverTodos(state, []);

      if (action.payload) {
        const { error } = action.payload;
        setLoadLeftoverError(state, error.message);
      } else {
        setLoadLeftoverError(state, DEFAULT_LOAD_LEFTOVER_TODO_ERROR_MESSAGE);
      }
    });

    builder.addCase(markLeftoverHandled.fulfilled, (state) => {
      setMarkLeftoverHandledError(state, undefined);
    });

    builder.addCase(markLeftoverHandled.rejected, (state, action) => {
      setLeftoverTodos(state, []);

      if (action.payload) {
        const { error } = action.payload;
        setMarkLeftoverHandledError(state, error.message);
      } else {
        setMarkLeftoverHandledError(
          state,
          DEFAULT_MARK_LEFTOVER_HANDLED_ERROR_MESSAGE
        );
      }
    });

    builder.addCase(updateScheduledTodos.fulfilled, (state, action) => {
      const { dateNumber, scheduledTodos } = action.payload;
      setScheduledTodos(state, dateNumber, scheduledTodos);
      setUpdateError(state, undefined);
    });

    builder.addCase(updateScheduledTodos.rejected, (state, action) => {
      if (action.payload?.error) {
        const { error } = action.payload;
        setUpdateError(state, error.message);
      } else {
        setUpdateError(state, DEFAULT_UPDATE_SCHEDULED_TODO_ERROR_MESSAGE);
      }
    });

    builder.addCase(saveScheduledTodos.fulfilled, (state) => {
      setSaveError(state, undefined);
    });

    builder.addCase(saveScheduledTodos.rejected, (state, action) => {
      if (action.payload) {
        const { error } = action.payload;
        setSaveError(state, error.message);
      } else {
        setSaveError(state, DEFAULT_SAVE_SCHEDULED_TODO_ERROR_MESSAGE);
      }
    });
  },
});

function setScheduledTodos(
  state: ScheduleSlice,
  dateNumber: number,
  scheduledTodos: ScheduledTodo[]
) {
  state.dateNumber = dateNumber;
  state.scheduledTodos = scheduledTodos;
}

function setLeftoverTodos(
  state: ScheduleSlice,
  scheduledTodos: ScheduledTodo[]
) {
  state.leftoverTodos = scheduledTodos;
}

function clearScheduledTodos(state: ScheduleSlice) {
  state.dateNumber = undefined;
  state.scheduledTodos = [];
}

function setSaveError(state: ScheduleSlice, saveError?: string) {
  state.saveError = saveError;
}

function setLoadError(state: ScheduleSlice, loadError?: string) {
  state.loadError = loadError;
}

function setLoadLeftoverError(state: ScheduleSlice, loadError?: string) {
  state.loadLeftoverError = loadError;
}

function setMarkLeftoverHandledError(
  state: ScheduleSlice,
  markLeftoverError?: string
) {
  state.markLeftoverError = markLeftoverError;
}

function setUpdateError(state: ScheduleSlice, updateError?: string) {
  state.updateError = updateError;
}

export * from './load_scheduled_todos/load_scheduled_todos';
export * from './update_scheduled_todos/update_scheduled_todos';
export * from './update_scheduled_todos/save_scheduled_todos/save_scheduled_todos';

export default scheduleSlice.reducer;
