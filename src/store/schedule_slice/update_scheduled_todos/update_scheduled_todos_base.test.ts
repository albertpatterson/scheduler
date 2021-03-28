import { ScheduledTodo } from 'types';
import { PartialStoreType } from 'store/schedule_slice/schedule_slice';
import * as saveScheduledTodosThunks from './save_scheduled_todos/save_scheduled_todos';
import {
  updateThenSaveScheduledTodos,
  UpdateScheduledTodosPayloadCreatorInput,
} from './update_scheduled_todos_base';
import { AsyncThunkAction } from '@reduxjs/toolkit';
import {
  SaveScheduledTodosPayloadCreatorInput,
  SaveScheduledTodosThunkApiConfig,
} from './save_scheduled_todos/save_scheduled_todos';

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

describe('updating and then saving todos', () => {
  const getTestState = (
    initialState = INITIAL_STATE,
    input: UpdateScheduledTodosPayloadCreatorInput
  ) => {
    const dispatch = jest.fn();
    const getState = jest.fn().mockReturnValue(initialState);

    const action = updateThenSaveScheduledTodos(input);

    return { dispatch, getState, action };
  };

  test('fails if the input contains an error', async () => {
    const testError = 'testing error';

    const input = {
      error: new Error(testError),
    };

    const { dispatch, getState, action } = getTestState(
      INITIAL_STATE_NO_DATE_NUMBER,
      input
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch.mockReturnValue(
      Promise.resolve({ payload: { error: testError } })
    );

    jest.spyOn(saveScheduledTodosThunks, 'saveScheduledTodos');

    await action(dispatch, getState, null);

    const pendingAction = expect.objectContaining({
      type: updateThenSaveScheduledTodos.pending.type,
    });

    const rejectedAction = expect.objectContaining({
      type: updateThenSaveScheduledTodos.rejected.type,
      payload: { error: testError },
    });

    expect(dispatch).toHaveBeenCalledTimes(3);

    expect(dispatch).toHaveBeenNthCalledWith(1, pendingAction);
    expect(dispatch).toHaveBeenNthCalledWith(3, rejectedAction);

    expect(saveScheduledTodosThunks.saveScheduledTodos).not.toHaveBeenCalled();
  });

  test('successfully updates and saves', async () => {
    const input = {
      data: TEST_UPDATED_DATA,
    };

    const { dispatch, getState, action } = getTestState(
      INITIAL_STATE_NO_DATE_NUMBER,
      input
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch.mockReturnValue(Promise.resolve({ payload: TEST_UPDATED_DATA }));

    const saveScheduledTodosThunksMockReturnValue = {} as AsyncThunkAction<
      Record<string, never>,
      SaveScheduledTodosPayloadCreatorInput,
      SaveScheduledTodosThunkApiConfig
    >;
    jest
      .spyOn(saveScheduledTodosThunks, 'saveScheduledTodos')
      .mockReturnValue(saveScheduledTodosThunksMockReturnValue);

    await action(dispatch, getState, null);

    const pendingAction = expect.objectContaining({
      type: updateThenSaveScheduledTodos.pending.type,
    });

    const fulfilledAction = expect.objectContaining({
      type: updateThenSaveScheduledTodos.fulfilled.type,
    });

    expect(dispatch).toHaveBeenCalledTimes(4);

    expect(dispatch).toHaveBeenNthCalledWith(1, pendingAction);
    expect(dispatch).toHaveBeenNthCalledWith(
      3,
      saveScheduledTodosThunksMockReturnValue
    );
    expect(dispatch).toHaveBeenNthCalledWith(4, fulfilledAction);

    expect(saveScheduledTodosThunks.saveScheduledTodos).toHaveBeenCalledWith(
      TEST_UPDATED_DATA
    );
  });
});
