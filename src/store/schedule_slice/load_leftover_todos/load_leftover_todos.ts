import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  scheduledTodosClient,
  LeftoverTodosData,
} from 'api/scheduled_todo_client/scheduled_todo_client';

type LoadLeftoverTodosPayloadCreatorInput = void;

interface LoadLeftoverTodosRejectValue {
  error: Error;
}

interface LoadLeftoverTodosThunkApiConfig {
  rejectValue: LoadLeftoverTodosRejectValue;
}

export const loadLeftoverTodos = createAsyncThunk<
  LeftoverTodosData,
  LoadLeftoverTodosPayloadCreatorInput,
  LoadLeftoverTodosThunkApiConfig
>('scheduledTodos/loadLeftoverTodos', async (_, thunkApi) => {
  try {
    const response = await scheduledTodosClient.getLeftover();
    return response;
  } catch (error) {
    return thunkApi.rejectWithValue({ error });
  }
});
