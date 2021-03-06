import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { ScheduledTodo, Todo } from '../../types';
import { scheduledTodosClient } from '../../api/scheduled_todo_client';

export interface ScheduleSlice {
  dateNumber?: number;
  scheduledTodos: ScheduledTodo[];
}
import * as utils from './utils';

const initialState: ScheduleSlice = {
  scheduledTodos: [],
};

export const loadScheduledTodos = createAsyncThunk(
  'scheduledTodos/loadScheduledTodos',
  async (dateNumber: number) => {
    const response = await scheduledTodosClient.get(dateNumber);
    return {
      dateNumber: response.dateNumber,
      scheduledTodos: response.scheduledTodos,
    };
  },
  {
    condition: (dateNumber, thunkAPi) => {
      const { schedule } = thunkAPi.getState() as { schedule: ScheduleSlice };
      if (schedule.dateNumber && schedule.dateNumber === dateNumber) {
        return false;
      }
    },
  }
);

export const saveScheduledTodos = createAsyncThunk(
  'scheduledTodos/saveScheduledTodos',
  async (data: { dateNumber: number; scheduledTodos: ScheduledTodo[] }) => {
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
  return createAsyncThunk(
    `scheduledTodos/${updateName}`,
    async (data: T, thunkApi) => {
      const { schedule } = thunkApi.getState() as { schedule: ScheduleSlice };
      if (!schedule.dateNumber) {
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
        console.log(error);
      }
    }
  );
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
  },
  extraReducers: (builder) => {
    builder.addCase(loadScheduledTodos.fulfilled, (state, action) => {
      const { dateNumber, scheduledTodos } = action.payload;
      state.scheduledTodos = scheduledTodos || [];
      state.dateNumber = dateNumber;
    });
  },
});

function setScheduledTodosReducer(
  state: ScheduleSlice,
  action: PayloadAction<ScheduledTodo[]>
) {
  state.scheduledTodos = action.payload;
}

const { setScheduledTodos } = scheduleSlice.actions;

export default scheduleSlice.reducer;
