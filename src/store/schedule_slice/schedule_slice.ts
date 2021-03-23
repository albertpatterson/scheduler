import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { ScheduledTodo, Todo } from '../../types';
import { scheduledTodosClient } from 'api/scheduled_todo_client/scheduled_todo_client';
import * as utils from './utils';

const DEFAULT_LOAD_SCHEDULED_TODO_ERROR_MESSAGE =
  'An error occured loading scheduled todos';

const DEFAULT_SAVE_SCHEDULED_TODO_ERROR_MESSAGE =
  'An error occured saving scheduled todos';

export interface ScheduleSlice {
  dateNumber?: number;
  scheduledTodos: ScheduledTodo[];
  loadError?: string;
  saveError?: string;
}

export interface PartialStoreType {
  schedule: ScheduleSlice;
}

const initialState: ScheduleSlice = {
  scheduledTodos: [],
};

interface LoadScheduledTodosSuccessValue {
  dateNumber: number;
  scheduledTodos: ScheduledTodo[];
}

type LoadScheduledTodosPayloadCreatorInput = number;

interface LoadScheduledTodosRejectValue {
  dateNumber: number;
  error: Error;
}

interface LoadScheduledTodosThunkApiConfig {
  rejectValue: LoadScheduledTodosRejectValue;
}

export const loadScheduledTodos = createAsyncThunk<
  LoadScheduledTodosSuccessValue,
  LoadScheduledTodosPayloadCreatorInput,
  LoadScheduledTodosThunkApiConfig
>(
  'scheduledTodos/loadScheduledTodos',
  async (dateNumber: number, thunkApi) => {
    try {
      const response = await scheduledTodosClient.get(dateNumber);
      return {
        dateNumber: dateNumber,
        scheduledTodos: response,
      };
    } catch (error) {
      return thunkApi.rejectWithValue({ dateNumber, error });
    }
  },
  {
    condition: (dateNumber, thunkAPi) => {
      const state = thunkAPi.getState();
      const { schedule } = state as PartialStoreType;
      if (schedule.dateNumber && schedule.dateNumber === dateNumber) {
        return false;
      }

      return true;
    },
  }
);

type SaveScheduledTodosSuccessValue = Promise<void>;

interface SaveScheduledTodosPayloadCreatorInput {
  dateNumber: number;
  scheduledTodos: ScheduledTodo[];
}

interface SaveScheduledTodosRejectValue {
  error: Error;
}

interface SaveScheduledTodosThunkApiConfig {
  rejectValue: SaveScheduledTodosRejectValue;
}

export const saveScheduledTodos = createAsyncThunk<
  SaveScheduledTodosSuccessValue,
  SaveScheduledTodosPayloadCreatorInput,
  SaveScheduledTodosThunkApiConfig
>(
  'scheduledTodos/saveScheduledTodos',
  async (data: SaveScheduledTodosPayloadCreatorInput) => {
    await scheduledTodosClient.put(data.dateNumber, data.scheduledTodos);
  }
);

function createUpdateThenSaveAsyncThunk<T>(
  updateName: string,
  updatedScheduledTodosCreator: (
    data: T,
    currentScheduledTodos: ScheduledTodo[]
  ) => ScheduledTodo[]
) {
  const typePrefix = `scheduledTodos/${updateName}`;

  return createAsyncThunk(typePrefix, async (data: T, thunkApi) => {
    const { schedule } = thunkApi.getState() as PartialStoreType;
    if (schedule.dateNumber === undefined) {
      throw new Error('date is not set');
    }

    const currentScheduledTodos = schedule.scheduledTodos || [];

    try {
      const updatedScheduledTodos = updatedScheduledTodosCreator(
        data,
        currentScheduledTodos
      );

      thunkApi.dispatch(setScheduledTodos(updatedScheduledTodos));
      thunkApi.dispatch(
        saveScheduledTodos({
          dateNumber: schedule.dateNumber,
          scheduledTodos: updatedScheduledTodos,
        })
      );
    } catch (error) {
      thunkApi.dispatch(setUpdateFailure(error.message));
      throw error;
    }
  });
}

export interface addScheduledTodoData {
  scheduledTodo: ScheduledTodo;
}
export const addScheduledTodo = createUpdateThenSaveAsyncThunk<addScheduledTodoData>(
  'addScheduledTodo',
  (data, currentScheduledTodos) =>
    utils.addScheduledTodo(data.scheduledTodo, currentScheduledTodos)
);

export interface addTodoAtEndData {
  todo: Todo;
}
export const addTodoAtEnd = createUpdateThenSaveAsyncThunk<addTodoAtEndData>(
  'addTodoAtEnd',
  (data, currentScheduledTodos) =>
    utils.addTodoAtEnd(data.todo, currentScheduledTodos)
);

export interface RemoveScheduledTodoData {
  index: number;
}
export const removeScheduledTodo = createUpdateThenSaveAsyncThunk<RemoveScheduledTodoData>(
  'removeScheduledTodo',
  (data, currentScheduledTodos) =>
    utils.removeScheduledTodo(data.index, currentScheduledTodos)
);

export interface UpdateScheduledTodoData {
  updatedScheduledTodo: ScheduledTodo;
  index: number;
}
export const updateScheduledTodo = createUpdateThenSaveAsyncThunk<UpdateScheduledTodoData>(
  'updateScheduledTodo',
  (data, currentScheduledTodos) =>
    utils.updateScheduledTodo(
      data.updatedScheduledTodo,
      data.index,
      currentScheduledTodos
    )
);

export const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    setScheduledTodos: setScheduledTodosReducer,
    setUpdateFailure: setUpdateFailureReducer,
  },
  extraReducers: (builder) => {
    builder.addCase(loadScheduledTodos.fulfilled, (state, action) => {
      const { dateNumber, scheduledTodos } = action.payload;
      state.scheduledTodos = scheduledTodos || [];
      state.dateNumber = dateNumber;
      state.loadError = undefined;
    });

    builder.addCase(loadScheduledTodos.rejected, (state, action) => {
      state.scheduledTodos = [];

      if (action.payload) {
        const { dateNumber, error } = action.payload;
        state.dateNumber = dateNumber;
        state.loadError = error.message;
      } else {
        state.dateNumber = undefined;
        state.loadError = DEFAULT_LOAD_SCHEDULED_TODO_ERROR_MESSAGE;
      }
    });

    builder.addCase(saveScheduledTodos.fulfilled, (state) => {
      state.saveError = undefined;
    });

    builder.addCase(saveScheduledTodos.rejected, (state, action) => {
      if (action.payload) {
        const { error } = action.payload;
        state.saveError = error.message;
      } else {
        state.saveError = DEFAULT_SAVE_SCHEDULED_TODO_ERROR_MESSAGE;
      }
    });
  },
});

function setScheduledTodosReducer(
  state: ScheduleSlice,
  action: PayloadAction<ScheduledTodo[]>
) {
  state.scheduledTodos = action.payload;
}

function setUpdateFailureReducer(
  state: ScheduleSlice,
  action: PayloadAction<string>
) {
  state.saveError = action.payload;
}

export const { setScheduledTodos, setUpdateFailure } = scheduleSlice.actions;

export default scheduleSlice.reducer;
