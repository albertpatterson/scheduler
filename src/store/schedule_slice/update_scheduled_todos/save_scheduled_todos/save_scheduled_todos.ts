import { createAsyncThunk } from '@reduxjs/toolkit';
import { ScheduledTodo } from '../../../../types';
import { scheduledTodosClient } from 'api/scheduled_todo_client/scheduled_todo_client';

export type SaveScheduledTodosSuccessValue = Record<string, never>;

export interface SaveScheduledTodosPayloadCreatorInput {
  dateNumber: number;
  scheduledTodos: ScheduledTodo[];
}

export interface SaveScheduledTodosRejectValue {
  dateNumber?: number;
  error: Error;
}

export interface SaveScheduledTodosThunkApiConfig {
  rejectValue: SaveScheduledTodosRejectValue;
}

export const saveScheduledTodos = createAsyncThunk<
  SaveScheduledTodosSuccessValue,
  SaveScheduledTodosPayloadCreatorInput,
  SaveScheduledTodosThunkApiConfig
>(
  'scheduledTodos/saveScheduledTodos',
  async (data: SaveScheduledTodosPayloadCreatorInput) => {
    const saveResult = await scheduledTodosClient.put(
      data.dateNumber,
      data.scheduledTodos
    );
    return saveResult;
  }
);
