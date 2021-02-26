import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Todo } from '../types';

export interface BacklogSlice {
  backlogTodos: Todo[];
}

const mockTotos: Todo[] = [
  {
    title: 'task 1',
    description: 'the first task',
    estimate: 30,
    priority: 0,
  },
  {
    title: 'task 2',
    description: 'the second task',
    estimate: 60,
    priority: 1,
  },
  {
    title: 'task 3',
    description: 'the third task',
    estimate: 90,
    priority: 2,
  },
];

const initialState: BacklogSlice = {
  backlogTodos: mockTotos,
};

export const backlogSlice = createSlice({
  name: 'backlog',
  initialState,
  reducers: {
    addBacklogTodo: addBacklogTodoReducer,
    removeBacklogTodo: removeBacklogTodoReducer,
    updateBacklogTodo: updateBacklogTodoReducer,
  },
});

function addBacklogTodoReducer(
  state: BacklogSlice,
  action: PayloadAction<Todo>
) {
  const newTodo: Todo = action.payload;
  state.backlogTodos.push(newTodo);
}

function removeBacklogTodoReducer(
  state: BacklogSlice,
  action: PayloadAction<number>
) {
  const index: number = action.payload;
  state.backlogTodos.splice(index, 1);
}

export interface BackLogUpdate {
  newTodo: Todo;
  index: number;
}
function updateBacklogTodoReducer(
  state: BacklogSlice,
  action: PayloadAction<BackLogUpdate>
) {
  const update: BackLogUpdate = action.payload;
  state.backlogTodos.splice(update.index, 0, update.newTodo);
}

export const {
  addBacklogTodo,
  removeBacklogTodo,
  updateBacklogTodo,
} = backlogSlice.actions;
export default backlogSlice.reducer;
