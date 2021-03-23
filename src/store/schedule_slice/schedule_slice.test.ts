/* eslint-disable @typescript-eslint/no-explicit-any */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { AnyAction, AsyncThunkAction } from '@reduxjs/toolkit';
import * as utils from './utils';
import { ScheduledTodo } from 'types';

import {
  PartialStoreType,
  loadScheduledTodos,
  scheduleSlice,
  ScheduleSlice,
  addTodoAtEnd,
  addScheduledTodo,
} from './schedule_slice';

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

const mockStore = configureMockStore([thunk]);

const TODO = {
  title: 'test  todo',
  description: 'test todo description',
  estimate: 1,
  priority: 1,
};

const SCHEDULED_TODO = {
  start: 0,
  title: 'test scheduled todo',
  description: 'test scheduled todo description',
  estimate: 1,
  priority: 1,
};

const TEST_ERROR = 'testing error';
const TEST_INTERNAL_ERROR = 'testing internal error';

describe('schedule slice', () => {
  // let scheduledTodosClientMock: ScheduledTodosClientMock;

  // beforeEach(() => {
  //   scheduledTodosClientMock = scheduledTodosClient as ScheduledTodosClientMock;
  //   initializeMock(scheduledTodosClientMock);
  // });

  // test('applies the mock', async () => {
  //   const out = await scheduledTodosClient.get(0);
  //   expect(scheduledTodosClient.get).toHaveBeenCalledTimes(1);
  //   expect(out).toEqual([]);
  // });

  // test('updates the mock', async () => {
  //   const testTodos = [
  //     {
  //       title: 'test scheduled todo title',
  //       description: 'test scheduled todo description',
  //       priority: 100,
  //       estimate: 750,
  //       start: 1e3 * 60 * 9,
  //     },
  //   ];
  //   scheduledTodosClientMock.setGetImpl(testTodos);

  //   const out = await scheduledTodosClient.get(0);
  //   expect(scheduledTodosClient.get).toHaveBeenCalledTimes(1);
  //   expect(out).toBe(testTodos);
  // });

  // test('named exports', () => {
  //   const s = new ScheduledTodosClient();
  //   expect(ScheduledTodosClient).toHaveBeenCalledTimes(1);
  //   expect(s).toEqual({});

  //   const out = { pickle: 0 };
  //   (ScheduledTodosClient as jest.Mock).mockReturnValue(out);
  //   const s2 = new ScheduledTodosClient();
  //   expect(ScheduledTodosClient).toHaveBeenCalledTimes(2);
  //   expect(s2).toEqual(out);
  // });

  describe('loading scheduled todos', () => {
    describe('success', () => {
      test('loadScheduledTodos loads scheduled todos successfully', async () => {
        const testDateNumber = 111;
        const testScheduledTodos: ScheduledTodo[] = [SCHEDULED_TODO];

        const initialState: PartialStoreType = {
          schedule: {
            scheduledTodos: [],
          },
        };
        const dispatch = jest.fn();
        const getState = jest.fn().mockReturnValue(initialState);

        const action = loadScheduledTodos(testDateNumber);
        (scheduledTodosClient.get as jest.Mock).mockReturnValue(
          Promise.resolve(testScheduledTodos)
        );
        await action(dispatch, getState, null);

        expect(scheduledTodosClient.get).toHaveBeenCalledWith(testDateNumber);

        const pendingAction = expect.objectContaining({
          payload: undefined,
          type: 'scheduledTodos/loadScheduledTodos/pending',
        });

        const fulfilledAction = expect.objectContaining({
          payload: {
            dateNumber: testDateNumber,
            scheduledTodos: testScheduledTodos,
          },
          type: 'scheduledTodos/loadScheduledTodos/fulfilled',
        });

        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(dispatch).toHaveBeenNthCalledWith(1, pendingAction);
        expect(dispatch).toHaveBeenNthCalledWith(2, fulfilledAction);
      });

      test('updates the state once async thunk is fulfilled', () => {
        const testDateNumber = 1111;

        const initialState: ScheduleSlice = {
          scheduledTodos: [],
          loadError: 'test loading error',
        };

        const loadedScheduledTodos = [SCHEDULED_TODO];
        const action = {
          payload: {
            dateNumber: testDateNumber,
            scheduledTodos: loadedScheduledTodos,
          },
          type: 'scheduledTodos/loadScheduledTodos/fulfilled',
        };

        const newState = scheduleSlice.reducer(initialState, action);

        expect(newState).toEqual({
          dateNumber: testDateNumber,
          scheduledTodos: loadedScheduledTodos,
          loadError: undefined,
        });
      });
    });

    describe('failure', () => {
      test('loadScheduledTodos handles get scheuled todos error', async () => {
        const testDateNumber = 111;
        const testError = 'test error';

        const initialState: PartialStoreType = {
          schedule: {
            scheduledTodos: [],
          },
        };
        const dispatch = jest.fn();
        const getState = jest.fn().mockReturnValue(initialState);

        (scheduledTodosClient.get as jest.Mock).mockReturnValue(
          Promise.reject(testError)
        );

        const action = loadScheduledTodos(testDateNumber);
        await action(dispatch, getState, null);

        expect(scheduledTodosClient.get).toHaveBeenCalledWith(testDateNumber);

        const pendingAction = expect.objectContaining({
          payload: undefined,
          type: 'scheduledTodos/loadScheduledTodos/pending',
        });

        const rejectedAction = expect.objectContaining({
          payload: {
            dateNumber: testDateNumber,
            error: testError,
          },
          type: 'scheduledTodos/loadScheduledTodos/rejected',
        });

        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(dispatch).toHaveBeenNthCalledWith(1, pendingAction);
        expect(dispatch).toHaveBeenNthCalledWith(2, rejectedAction);
      });

      test('updates the state once async thunk is rejected', () => {
        const testDateNumber = 1111;
        const testLoadingError = 'test loading error';

        const initialState: ScheduleSlice = {
          scheduledTodos: [SCHEDULED_TODO],
        };

        const action = {
          payload: {
            error: { message: testLoadingError },
            dateNumber: testDateNumber,
            scheduledTodos: [],
          },
          type: 'scheduledTodos/loadScheduledTodos/rejected',
        };

        const newState = scheduleSlice.reducer(initialState, action);

        expect(newState).toEqual({
          dateNumber: testDateNumber,
          scheduledTodos: [],
          loadError: testLoadingError,
        });
      });
    });
  });

  describe('updating scheduled todos', () => {
    function testUpdateScheduledTodos<A, B, C>(
      asyncThunkName: string,
      internalUtilFunctionName: string,
      asyncThunkAction: AsyncThunkAction<A, B, C>,
      expectedPutDateNumber: number,
      expectedPutScheduledTodos: any[],
      expectedSuccessActions: AnyAction[],
      expectedFailureActions: AnyAction[],
      expectedInternalFailureActions: AnyAction[]
    ) {
      function getStore() {
        const initialState: PartialStoreType = {
          schedule: {
            dateNumber: 0,
            scheduledTodos: [],
          },
        };

        return mockStore(initialState);
      }

      async function dispatchAndAsssertActions(
        expectedActions: AnyAction[],
        skipPutAssertions = false
      ) {
        const store = getStore();

        await store.dispatch<any>(asyncThunkAction);

        const actions = store.getActions();

        expect(actions.length).toBe(expectedActions.length);

        for (const action of expectedActions) {
          expect(actions).toContainEqual(action);
        }

        if (skipPutAssertions) {
          return;
        }

        expect(scheduledTodosClient.put).toHaveBeenCalledWith(
          expectedPutDateNumber,
          expectedPutScheduledTodos
        );
      }

      test(`${asyncThunkName} success`, async () => {
        (scheduledTodosClient.put as jest.Mock).mockReturnValue(
          Promise.resolve()
        );

        dispatchAndAsssertActions(expectedSuccessActions);
      });

      test(`${asyncThunkName} request failure`, async () => {
        (scheduledTodosClient.put as jest.Mock).mockReturnValue(
          Promise.reject(TEST_ERROR)
        );

        dispatchAndAsssertActions(expectedFailureActions);
      });

      test(`${asyncThunkName} internal failure`, async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore: test function type safe
        jest.spyOn(utils, internalUtilFunctionName).mockImplementation(() => {
          throw new Error(TEST_INTERNAL_ERROR);
        });

        dispatchAndAsssertActions(expectedInternalFailureActions, true);
      });
    }

    describe('addTodoAtEnd', () => {
      const expectedSuccessActions: AnyAction[] = [
        expect.objectContaining({
          type: 'scheduledTodos/addTodoAtEnd/pending',
        }),
        expect.objectContaining({
          type: 'scheduledTodos/addTodoAtEnd/fulfilled',
        }),
        expect.objectContaining({
          type: 'schedule/setScheduledTodos',
          payload: [expect.objectContaining(TODO)],
        }),
        expect.objectContaining({
          type: 'scheduledTodos/saveScheduledTodos/pending',
        }),
        expect.objectContaining({
          type: 'scheduledTodos/saveScheduledTodos/fulfilled',
        }),
      ];

      const expectedFailureActions: AnyAction[] = [
        expect.objectContaining({
          type: 'scheduledTodos/addTodoAtEnd/pending',
        }),
        expect.objectContaining({
          type: 'scheduledTodos/addTodoAtEnd/fulfilled',
        }),
        expect.objectContaining({
          type: 'schedule/setScheduledTodos',
          payload: [expect.objectContaining(TODO)],
        }),
        expect.objectContaining({
          type: 'scheduledTodos/saveScheduledTodos/pending',
        }),
        expect.objectContaining({
          type: 'scheduledTodos/saveScheduledTodos/rejected',
          error: expect.objectContaining({ message: TEST_ERROR }),
        }),
      ];

      const expectedInternalFailureActions: AnyAction[] = [
        expect.objectContaining({
          type: 'scheduledTodos/addTodoAtEnd/pending',
        }),
        expect.objectContaining({
          type: 'scheduledTodos/addTodoAtEnd/rejected',
          error: expect.objectContaining({ message: TEST_INTERNAL_ERROR }),
        }),
        expect.objectContaining({
          type: 'schedule/setUpdateFailure',
          payload: TEST_INTERNAL_ERROR,
        }),
      ];

      testUpdateScheduledTodos(
        'addTodoAtEnd',
        'addTodoAtEnd',
        addTodoAtEnd({ todo: TODO }),
        0,
        [expect.objectContaining(TODO)],
        expectedSuccessActions,
        expectedFailureActions,
        expectedInternalFailureActions
      );
    });

    describe('addScheduledTodo', () => {
      const expectedSuccessActions: AnyAction[] = [
        expect.objectContaining({
          type: 'scheduledTodos/addScheduledTodo/pending',
        }),
        expect.objectContaining({
          type: 'scheduledTodos/addScheduledTodo/fulfilled',
        }),
        expect.objectContaining({
          type: 'schedule/setScheduledTodos',
          payload: [expect.objectContaining(TODO)],
        }),
        expect.objectContaining({
          type: 'scheduledTodos/saveScheduledTodos/pending',
        }),
        expect.objectContaining({
          type: 'scheduledTodos/saveScheduledTodos/fulfilled',
        }),
      ];

      const expectedFailureActions: AnyAction[] = [
        expect.objectContaining({
          type: 'scheduledTodos/addScheduledTodo/pending',
        }),
        expect.objectContaining({
          type: 'scheduledTodos/addScheduledTodo/fulfilled',
        }),
        expect.objectContaining({
          type: 'schedule/setScheduledTodos',
          payload: [expect.objectContaining(TODO)],
        }),
        expect.objectContaining({
          type: 'scheduledTodos/saveScheduledTodos/pending',
        }),
        expect.objectContaining({
          type: 'scheduledTodos/saveScheduledTodos/rejected',
          error: expect.objectContaining({ message: TEST_ERROR }),
        }),
      ];

      const expectedInternalFailureActions: AnyAction[] = [
        expect.objectContaining({
          type: 'scheduledTodos/addScheduledTodo/pending',
        }),
        expect.objectContaining({
          type: 'scheduledTodos/addScheduledTodo/rejected',
          error: expect.objectContaining({ message: TEST_INTERNAL_ERROR }),
        }),
        expect.objectContaining({
          type: 'schedule/setUpdateFailure',
          payload: TEST_INTERNAL_ERROR,
        }),
      ];

      testUpdateScheduledTodos(
        'addScheduledTodo',
        'addScheduledTodo',
        addScheduledTodo({ scheduledTodo: { start: 0, ...TODO } }),
        0,
        [expect.objectContaining(TODO)],
        expectedSuccessActions,
        expectedFailureActions,
        expectedInternalFailureActions
      );
    });
  });
});
