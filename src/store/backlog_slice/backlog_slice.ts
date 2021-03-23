import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Todo } from '../../types';
import { backlogTodosClient } from '../../api/backlog_todo_client';
import * as utils from './utils';

export interface BacklogSlice {
  backlogTodos: Todo[];
}

const initialState: BacklogSlice = {
  backlogTodos: [],
};

export const loadBacklogTodos = createAsyncThunk(
  'scheduledTodos/loadScheduledTodos',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (data: Record<string, never>) => {
    const response = await backlogTodosClient.get();
    return { backlogTodos: response.backlogTodos };
  }
);

export const saveBacklogTodos = createAsyncThunk(
  'backlogTodos/saveBacklogTodos',
  async (data: { updatedBacklogTodos: Todo[] }) => {
    await backlogTodosClient.put(data.updatedBacklogTodos);
  }
);

function createUpdateThenSaveAsyncThunk<T>(
  updateName: string,
  updatedBacklogTodosCreator: (data: T, currentBacklogTodos: Todo[]) => Todo[]
) {
  return createAsyncThunk(
    `backlogTodos/${updateName}`,
    async (data: T, thunkApi) => {
      const { backlog } = thunkApi.getState() as { backlog: BacklogSlice };

      const currentBacklogTodos = backlog.backlogTodos;

      try {
        const updatedBacklogTodos = updatedBacklogTodosCreator(
          data,
          currentBacklogTodos
        );

        thunkApi.dispatch(setBacklogTodos(updatedBacklogTodos));
        thunkApi.dispatch(
          saveBacklogTodos({
            updatedBacklogTodos,
          })
        );
      } catch (error) {
        console.log(error);
      }
    }
  );
}

export interface addBacklogTodoData {
  newTodo: Todo;
}
export const addBacklogTodo = createUpdateThenSaveAsyncThunk<addBacklogTodoData>(
  'addBacklogTodo',
  (data, currentBacklogTodos) =>
    utils.addBacklogTodo(data.newTodo, currentBacklogTodos)
);

export interface RemoveBacklogTodoData {
  index: number;
}
export const removeBacklogTodo = createUpdateThenSaveAsyncThunk<RemoveBacklogTodoData>(
  'removeBacklogTodo',
  (data, currentBacklogTodos) =>
    utils.removeBacklogTodo(data.index, currentBacklogTodos)
);

export interface UpdateBacklogTodoData {
  updatedTodo: Todo;
  index: number;
}
export const updateBacklogTodo = createUpdateThenSaveAsyncThunk<UpdateBacklogTodoData>(
  'updateBacklogTodo',
  (data, currentBacklogTodos) =>
    utils.updateBacklogTodo(data.updatedTodo, data.index, currentBacklogTodos)
);

export const backlogSlice = createSlice({
  name: 'backlog',
  initialState,
  reducers: {
    setBacklogTodos: setBacklogTodosReducer,
  },
  extraReducers: (builder) => {
    builder.addCase(loadBacklogTodos.fulfilled, (state, action) => {
      const { backlogTodos } = action.payload;
      state.backlogTodos = backlogTodos || [];
    });
  },
});

function setBacklogTodosReducer(
  state: BacklogSlice,
  action: PayloadAction<Todo[]>
) {
  state.backlogTodos = action.payload;
}
const { setBacklogTodos } = backlogSlice.actions;

export default backlogSlice.reducer;
