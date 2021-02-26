import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ScheduledTodo } from '../types';

export interface ScheduleSlice {
  scheduledTodos: ScheduledTodo[];
}

const initialState: ScheduleSlice = {
  scheduledTodos: [],
};

export const backlogSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    addSchedultedTodo: addSchedultedTodoReducer,
    removeSchedultedTodo: removeSchedultedTodoReducer,
    updateSchedultedTodo: updateSchedultedTodoReducer,
  },
});

function addSchedultedTodoReducer(
  state: ScheduleSlice,
  action: PayloadAction<ScheduledTodo>
) {
  const newScheduledTodo: ScheduledTodo = action.payload;
  state.scheduledTodos.push(newScheduledTodo);
}

function removeSchedultedTodoReducer(
  state: ScheduleSlice,
  action: PayloadAction<number>
) {
  const index: number = action.payload;
  state.scheduledTodos.splice(index, 1);
}

export interface BackLogUpdate {
  newScheduledTodo: ScheduledTodo;
  index: number;
}
function updateSchedultedTodoReducer(
  state: ScheduleSlice,
  action: PayloadAction<BackLogUpdate>
) {
  const update: BackLogUpdate = action.payload;
  state.scheduledTodos.splice(update.index, 1, update.newScheduledTodo);
}

export const {
  addSchedultedTodo,
  removeSchedultedTodo,
  updateSchedultedTodo,
} = backlogSlice.actions;

export default backlogSlice.reducer;
