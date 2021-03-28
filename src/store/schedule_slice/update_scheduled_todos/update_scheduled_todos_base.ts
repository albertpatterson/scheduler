import { createAsyncThunk } from '@reduxjs/toolkit';
import { ScheduledTodo } from '../../../types';
import {
  saveScheduledTodos,
  SaveScheduledTodosRejectValue,
  SaveScheduledTodosSuccessValue,
} from './save_scheduled_todos/save_scheduled_todos';

interface DateNumberAndScheduledTodos {
  dateNumber: number;
  scheduledTodos: ScheduledTodo[];
}

export interface UpdateScheduledTodosPayloadCreatorInput {
  error?: Error;
  data?: DateNumberAndScheduledTodos;
}

interface UpdateScheduledTodosRejectValue {
  dateNumber?: number;
  error: Error;
}
interface LoadScheduledTodosThunkApiConfig {
  rejectValue: UpdateScheduledTodosRejectValue;
}

export const updateScheduledTodos = createAsyncThunk<
  DateNumberAndScheduledTodos,
  UpdateScheduledTodosPayloadCreatorInput,
  LoadScheduledTodosThunkApiConfig
>(
  'scheduledTodos/updateScheduledTodos',
  async (input: UpdateScheduledTodosPayloadCreatorInput, thunkApi) => {
    if (input.error) {
      return thunkApi.rejectWithValue({ error: input.error });
    }

    if (input.data) {
      return { ...input.data };
    }

    return thunkApi.rejectWithValue({
      error: new Error('No data provided to save.'),
    });
  }
);

export interface UpdateThenSaveScheduledTodosThunkApiConfig {
  rejectValue: UpdateScheduledTodosRejectValue | SaveScheduledTodosRejectValue;
}

export const updateThenSaveScheduledTodos = createAsyncThunk<
  SaveScheduledTodosSuccessValue,
  UpdateScheduledTodosPayloadCreatorInput,
  UpdateThenSaveScheduledTodosThunkApiConfig
>(
  'scheduledTodos/updateThenSaveScheduledTodos',
  async (data: UpdateScheduledTodosPayloadCreatorInput, thunkApi) => {
    const updateResult = await thunkApi.dispatch(updateScheduledTodos(data));

    if (!updateResult.payload) {
      return thunkApi.rejectWithValue({
        error: new Error('no update todos payload'),
      });
    }

    const updateRejection = updateResult.payload as UpdateScheduledTodosRejectValue;

    if (updateRejection.error) {
      return thunkApi.rejectWithValue({ error: updateRejection.error });
    }

    const updatedData = updateResult.payload as DateNumberAndScheduledTodos;

    const saveScheduledTodosData = {
      ...updatedData,
    };

    const saveScheduledTodosResult = await thunkApi.dispatch(
      saveScheduledTodos(saveScheduledTodosData)
    );

    if (saveScheduledTodosResult.payload) {
      const saveScheduledTodosRejection = saveScheduledTodosResult.payload as SaveScheduledTodosRejectValue;
      if (saveScheduledTodosRejection.error) {
        return thunkApi.rejectWithValue(saveScheduledTodosRejection);
      }

      const saveScheduledTodosSuccess = saveScheduledTodosResult.payload as SaveScheduledTodosSuccessValue;
      return saveScheduledTodosSuccess;
    }

    return thunkApi.rejectWithValue({
      error: new Error('no save todos payload'),
    });
  }
);
