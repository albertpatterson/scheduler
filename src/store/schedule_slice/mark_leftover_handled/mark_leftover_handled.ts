import { createAsyncThunk } from '@reduxjs/toolkit';
import { scheduledTodosClient } from 'api/scheduled_todo_client/scheduled_todo_client';
import { loadLeftoverTodos } from '../load_leftover_todos/load_leftover_todos';

export interface MarkLeftoverHandledRejectValue {
  error: Error;
}

export interface MarkLeftoverHandledThunkApiConfig {
  rejectValue: MarkLeftoverHandledRejectValue;
}

export const markLeftoverHandled = createAsyncThunk<
  void,
  void,
  MarkLeftoverHandledThunkApiConfig
>('scheduledTodos/markLeftoverHandled', async (_, thunkApi) => {
  const markResult = await scheduledTodosClient.markLeftoverHandled();

  await thunkApi.dispatch(loadLeftoverTodos());

  return markResult;
});
