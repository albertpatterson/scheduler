import { ScheduledTodo } from 'types';
import { saveScheduledTodos } from './save_scheduled_todos';
import { PartialStoreType } from '../../schedule_slice';
import { scheduledTodosClient } from 'api/scheduled_todo_client/scheduled_todo_client';

jest.mock('api/scheduled_todo_client/scheduled_todo_client', () => {
  const scheduledTodosClient = {
    get: jest.fn(),
    put: jest.fn(),
  };
  return {
    __esModule: true,
    default: scheduledTodosClient,
    scheduledTodosClient,
  };
});

const SCHEDULED_TODO = {
  start: 0,
  title: 'test scheduled todo',
  description: 'test scheduled todo description',
  estimate: 1,
  priority: 1,
};

const INITIAL_STATE: PartialStoreType = {
  schedule: {
    scheduledTodos: [],
    leftoverTodos: [],
  },
};

const TEST_DATE_NUMBER = 111;
const TEST_SCHEDULED_TODOS: ScheduledTodo[] = [SCHEDULED_TODO];

const TEST_SAVE_DATA = {
  dateNumber: TEST_DATE_NUMBER,
  scheduledTodos: TEST_SCHEDULED_TODOS,
};

describe('saving scheduled todos', () => {
  const getTestState = () => {
    const dispatch = jest.fn();
    const getState = jest.fn().mockReturnValue(INITIAL_STATE);

    const action = saveScheduledTodos(TEST_SAVE_DATA);

    return { dispatch, getState, action };
  };

  test('saves scheduled todos successfully', async () => {
    const { dispatch, getState, action } = getTestState();

    (scheduledTodosClient.put as jest.Mock).mockReturnValue(Promise.resolve());

    await action(dispatch, getState, null);

    const pendingAction = expect.objectContaining({
      type: 'scheduledTodos/saveScheduledTodos/pending',
    });

    const fulfilledAction = expect.objectContaining({
      type: 'scheduledTodos/saveScheduledTodos/fulfilled',
    });

    expect(dispatch).toHaveBeenCalledTimes(2);

    expect(dispatch).toHaveBeenNthCalledWith(1, pendingAction);
    expect(dispatch).toHaveBeenNthCalledWith(2, fulfilledAction);
  });

  test('handles save errors', async () => {
    const { dispatch, getState, action } = getTestState();

    const testError = 'testing error';

    (scheduledTodosClient.put as jest.Mock).mockReturnValue(
      Promise.reject(testError)
    );

    await action(dispatch, getState, null);

    const pendingAction = expect.objectContaining({
      type: 'scheduledTodos/saveScheduledTodos/pending',
    });

    const rejectedAction = expect.objectContaining({
      type: 'scheduledTodos/saveScheduledTodos/rejected',
      error: { message: testError },
    });

    expect(dispatch).toHaveBeenCalledTimes(2);

    expect(dispatch).toHaveBeenNthCalledWith(1, pendingAction);
    expect(dispatch).toHaveBeenNthCalledWith(2, rejectedAction);
  });
});
