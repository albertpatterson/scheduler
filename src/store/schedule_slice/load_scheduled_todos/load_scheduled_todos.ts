import { createAsyncThunk, AsyncThunkAction } from '@reduxjs/toolkit';
import { ScheduledTodo } from '../../../types';
import { scheduledTodosClient } from 'api/scheduled_todo_client/scheduled_todo_client';
import { getTodayDayNumber } from 'utils/utils';
import { PartialStoreType } from '../schedule_slice';

interface LoadScheduledTodosSuccessValue {
  dateNumber: number;
  scheduledTodos: ScheduledTodo[];
}

type LoadScheduledTodosPayloadCreatorInput = number;

interface LoadScheduledTodosRejectValue {
  dateNumber: number;
  error: Error;
}

interface LoadScheduledTodosThunkApiConfig {
  rejectValue: LoadScheduledTodosRejectValue;
}

export const loadScheduledTodos = createAsyncThunk<
  LoadScheduledTodosSuccessValue,
  LoadScheduledTodosPayloadCreatorInput,
  LoadScheduledTodosThunkApiConfig
>(
  'scheduledTodos/loadScheduledTodos',
  async (dateNumber: number, thunkApi) => {
    try {
      const response = await scheduledTodosClient.get(dateNumber);
      return {
        dateNumber: dateNumber,
        scheduledTodos: response,
      };
    } catch (error) {
      return thunkApi.rejectWithValue({ dateNumber, error });
    }
  },
  {
    condition: (dateNumber, thunkAPi) => {
      const state = thunkAPi.getState();
      const { schedule } = state as PartialStoreType;
      if (schedule.dateNumber && schedule.dateNumber === dateNumber) {
        return false;
      }

      return true;
    },
  }
);

export const loadScheduledTodosToday = (): AsyncThunkAction<
  LoadScheduledTodosSuccessValue,
  LoadScheduledTodosPayloadCreatorInput,
  LoadScheduledTodosThunkApiConfig
> => {
  const dateNumber = getTodayDayNumber();
  return loadScheduledTodos(dateNumber);
};
