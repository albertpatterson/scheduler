import { createAsyncThunk } from '@reduxjs/toolkit';
import { ScheduledTodo, Todo } from '../../../types';
import * as utils from './utils/utils';
import { PartialStoreType } from '../schedule_slice';

import {
  updateThenSaveScheduledTodos,
  UpdateScheduledTodosPayloadCreatorInput,
} from './update_scheduled_todos_base';

export const DATE_NOT_SET_MESSAGE = 'date is not set';

function createUpdateAsyncThunk<T>(
  updateName: string,
  updatedScheduledTodosCreator: (
    data: T,
    currentScheduledTodos: ScheduledTodo[]
  ) => ScheduledTodo[]
) {
  const typePrefix = `scheduledTodos/${updateName}`;

  return createAsyncThunk(typePrefix, async (data: T, thunkApi) => {
    const updateScheduledTodoData: UpdateScheduledTodosPayloadCreatorInput = {};

    try {
      const { schedule } = thunkApi.getState() as PartialStoreType;
      if (schedule.dateNumber === undefined) {
        throw new Error(DATE_NOT_SET_MESSAGE);
      }

      const currentScheduledTodos = schedule.scheduledTodos || [];

      const updatedScheduledTodos = updatedScheduledTodosCreator(
        data,
        currentScheduledTodos
      );

      const updateAndSaveData = {
        dateNumber: schedule.dateNumber,
        scheduledTodos: updatedScheduledTodos,
      };

      updateScheduledTodoData.data = updateAndSaveData;
    } catch (error) {
      updateScheduledTodoData.error = error;
    }

    const action = updateThenSaveScheduledTodos(updateScheduledTodoData);

    return thunkApi.dispatch(action);
  });
}

export interface addScheduledTodoData {
  scheduledTodo: ScheduledTodo;
}

export const addScheduledTodo = createUpdateAsyncThunk<addScheduledTodoData>(
  'addScheduledTodo',
  (data, currentScheduledTodos) =>
    utils.addScheduledTodo(data.scheduledTodo, currentScheduledTodos)
);

export interface addTodoAtEndData {
  todo: Todo;
}
export const addTodoAtEnd = createUpdateAsyncThunk<addTodoAtEndData>(
  'addTodoAtEnd',
  (data, currentScheduledTodos) =>
    utils.addTodoAtEnd(data.todo, currentScheduledTodos)
);

export interface RemoveScheduledTodoData {
  index: number;
}
export const removeScheduledTodo = createUpdateAsyncThunk<RemoveScheduledTodoData>(
  'removeScheduledTodo',
  (data, currentScheduledTodos) =>
    utils.removeScheduledTodo(data.index, currentScheduledTodos)
);

export interface UpdateScheduledTodoData {
  updatedScheduledTodo: ScheduledTodo;
  index: number;
}
export const updateScheduledTodo = createUpdateAsyncThunk<UpdateScheduledTodoData>(
  'updateScheduledTodo',
  (data, currentScheduledTodos) =>
    utils.updateScheduledTodo(
      data.updatedScheduledTodo,
      data.index,
      currentScheduledTodos
    )
);
