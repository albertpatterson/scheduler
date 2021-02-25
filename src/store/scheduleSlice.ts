import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ScheduledTodo } from '../types';

export interface ScheduleSlice {
  scheduledTodos: ScheduledTodo[];
}

const mockScheduledTotos: ScheduledTodo[] = [
  {
    start: new Date(Date.now()),
    title: 'task 1',
    description: 'the first task',
    estimate: 30,
    priority: 0,
  },
  {
    start: new Date(Date.now() + 30 * 60 * 1e3),
    title: 'task 2',
    description: 'the second task',
    estimate: 60,
    priority: 1,
  },
  {
    start: new Date(Date.now() + (30 + 60) * 60 * 1e3),
    title: 'task 3',
    description: 'the third task',
    estimate: 90,
    priority: 2,
  },
];

const initialState: ScheduleSlice = {
  scheduledTodos: mockScheduledTotos,
};

export const backlogSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    add: addReducer,
    remove: removeReducer,
    update: updateReducer,
  },
});

function addReducer(
  state: ScheduleSlice,
  action: PayloadAction<ScheduledTodo>
) {
  const newScheduledTodo: ScheduledTodo = action.payload;
  state.scheduledTodos.push(newScheduledTodo);
}

function removeReducer(state: ScheduleSlice, action: PayloadAction<number>) {
  const index: number = action.payload;
  state.scheduledTodos.splice(index, 1);
}

export interface BackLogUpdate {
  newScheduledTodo: ScheduledTodo;
  index: number;
}
function updateReducer(
  state: ScheduleSlice,
  action: PayloadAction<BackLogUpdate>
) {
  const update: BackLogUpdate = action.payload;
  state.scheduledTodos.splice(update.index, 0, update.newScheduledTodo);
}

export const { add, remove, update } = backlogSlice.actions;
export default backlogSlice.reducer;
