import { ScheduledTodo } from 'types';
import { addTodoAtEnd, DATE_NOT_SET_MESSAGE } from './update_scheduled_todos';
import { PartialStoreType } from 'store/schedule_slice/schedule_slice';
import * as utils from 'utils/utils';
import * as updateScheduledTodosBaseThunks from './update_scheduled_todos_base';
import { AsyncThunkAction } from '@reduxjs/toolkit';
import {
  UpdateThenSaveScheduledTodosThunkApiConfig,
  UpdateScheduledTodosPayloadCreatorInput,
} from './update_scheduled_todos_base';

const TEST_TODO = {
  title: 'test scheduled todo',
  description: 'test scheduled todo description',
  estimate: 1,
  priority: 1,
};

const TEST_START_MINUTE = 111;

const TEST_SCHEDULED_TODO = {
  start: TEST_START_MINUTE,
  ...TEST_TODO,
};

const INITIAL_STATE_NO_DATE_NUMBER: PartialStoreType = {
  schedule: {
    scheduledTodos: [],
    leftoverTodos: [],
  },
};

const TEST_DATE_NUMBER = 111;

const INITIAL_STATE: PartialStoreType = {
  schedule: {
    ...INITIAL_STATE_NO_DATE_NUMBER.schedule,
    dateNumber: TEST_DATE_NUMBER,
  },
};

const TEST_SCHEDULED_TODOS: ScheduledTodo[] = [TEST_SCHEDULED_TODO];

const TEST_UPDATED_DATA = {
  dateNumber: TEST_DATE_NUMBER,
  scheduledTodos: TEST_SCHEDULED_TODOS,
};

describe('adding a todo at end', () => {
  const getTestState = (initialState = INITIAL_STATE) => {
    const dispatch = jest.fn();
    const getState = jest.fn().mockReturnValue(initialState);

    const addTodoAtEndData = { todo: TEST_TODO };

    const action = addTodoAtEnd(addTodoAtEndData);

    return { dispatch, getState, action };
  };

  test('fails if the dateNumber is not set', async () => {
    const { dispatch, getState, action } = getTestState(
      INITIAL_STATE_NO_DATE_NUMBER
    );

    jest.spyOn(updateScheduledTodosBaseThunks, 'updateThenSaveScheduledTodos');

    await action(dispatch, getState, null);

    const errorData = expect.objectContaining({
      error: new Error(DATE_NOT_SET_MESSAGE),
    });

    expect(
      updateScheduledTodosBaseThunks.updateThenSaveScheduledTodos
    ).toHaveBeenCalledWith(errorData);
  });

  test('successfully updates and saves', async () => {
    const { dispatch, getState, action } = getTestState();

    const updateScheduledTodosBaseThunksMockReturnValue = {} as AsyncThunkAction<
      Record<string, never>,
      UpdateScheduledTodosPayloadCreatorInput,
      UpdateThenSaveScheduledTodosThunkApiConfig
    >;
    jest
      .spyOn(updateScheduledTodosBaseThunks, 'updateThenSaveScheduledTodos')
      .mockReturnValue(updateScheduledTodosBaseThunksMockReturnValue);

    jest.spyOn(utils, 'getNowMinute').mockReturnValue(TEST_START_MINUTE);

    await action(dispatch, getState, null);

    const pendingAction = expect.objectContaining({
      type: addTodoAtEnd.pending.type,
    });

    const fulfilledAction = expect.objectContaining({
      type: addTodoAtEnd.fulfilled.type,
    });

    expect(dispatch).toHaveBeenCalledTimes(3);

    expect(dispatch).toHaveBeenNthCalledWith(1, pendingAction);
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      updateScheduledTodosBaseThunksMockReturnValue
    );
    expect(dispatch).toHaveBeenNthCalledWith(3, fulfilledAction);

    expect(
      updateScheduledTodosBaseThunks.updateThenSaveScheduledTodos
    ).toHaveBeenCalledWith({ data: TEST_UPDATED_DATA });
  });
});
