import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ScheduledTodo, Todo } from '../../types';
import { original } from 'immer';
export interface ScheduleSlice {
  scheduledTodos: ScheduledTodo[];
}
import * as utils from './utils';

const initialState: ScheduleSlice = {
  scheduledTodos: [],
};

export const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    addScheduledTodo: addScheduledTodoReducer,
    addScheduledTodoAtEnd: addScheduledTodoAtEndReducer,
    removeScheduledTodo: removeScheduledTodoReducer,
    updateScheduledTodo: updateScheduledTodoReducer,
  },
});

function addScheduledTodoReducer(
  state: ScheduleSlice,
  action: PayloadAction<ScheduledTodo>
) {
  const newScheduledTodo: ScheduledTodo = action.payload;
  const currentScheduledTodos = original(state.scheduledTodos) || [];
  const updatedScheduledTodos = utils.addScheduledTodo(
    newScheduledTodo,
    currentScheduledTodos
  );
  state.scheduledTodos = updatedScheduledTodos;
}

function addScheduledTodoAtEndReducer(
  state: ScheduleSlice,
  action: PayloadAction<Todo>
) {
  const newTodo: Todo = action.payload;
  const currentScheduledTodos = original(state.scheduledTodos) || [];
  const updatedScheduledTodos = utils.addScheduledTodoAtEnd(
    newTodo,
    currentScheduledTodos
  );
  state.scheduledTodos = updatedScheduledTodos;
}

function removeScheduledTodoReducer(
  state: ScheduleSlice,
  action: PayloadAction<number>
) {
  const index: number = action.payload;
  const currentScheduledTodos = original(state.scheduledTodos) || [];
  const updatedScheduledTodos = utils.removeScheduledTodo(
    index,
    currentScheduledTodos
  );
  state.scheduledTodos = updatedScheduledTodos;
}

export interface ScheduleUpdate {
  newScheduledTodo: ScheduledTodo;
  index: number;
}
function updateScheduledTodoReducer(
  state: ScheduleSlice,
  action: PayloadAction<ScheduleUpdate>
) {
  const { newScheduledTodo, index } = action.payload;
  const currentScheduledTodos = original(state.scheduledTodos) || [];
  const updatedScheduledTodos = utils.updateScheduledTodo(
    newScheduledTodo,
    index,
    currentScheduledTodos
  );
  state.scheduledTodos = updatedScheduledTodos;
}

export const {
  addScheduledTodo,
  addScheduledTodoAtEnd,
  removeScheduledTodo,
  updateScheduledTodo,
} = scheduleSlice.actions;

export default scheduleSlice.reducer;
