import { scheduleSlice, ScheduleSlice } from './schedule_slice';
import { ScheduledTodo } from 'types';
import { loadScheduledTodos } from './load_scheduled_todos';
import { updateScheduledTodos } from './update_scheduled_todos/update_scheduled_todos_base';
import { saveScheduledTodos } from './update_scheduled_todos/save_scheduled_todos/save_scheduled_todos';

const UNINITIALIZED_STATE: ScheduleSlice = {
  scheduledTodos: [],
};

const TEST_TODO = {
  title: 'test scheduled todo',
  description: 'test scheduled todo description',
  estimate: 1,
  priority: 1,
};

const TEST_START_MINUTE = 123;

const TEST_SCHEDULED_TODO = {
  start: TEST_START_MINUTE,
  ...TEST_TODO,
};

const TEST_SCHEDULED_TODOS: ScheduledTodo[] = [TEST_SCHEDULED_TODO];

const TEST_DATE_NUMBER = 456;

const INITIALIZED_STATE: ScheduleSlice = {
  dateNumber: TEST_DATE_NUMBER,
  scheduledTodos: TEST_SCHEDULED_TODOS,
};

describe('loadScheduledTodos', () => {
  describe('when fulfilled', () => {
    test('sets the dateNumber and scheduledTodos and clears load error', () => {
      const initialState = {
        ...UNINITIALIZED_STATE,
        loadError: 'testing',
      };
      const action = {
        type: loadScheduledTodos.fulfilled.type,
        payload: INITIALIZED_STATE,
      };
      const expectedState = INITIALIZED_STATE;

      const actualState = scheduleSlice.reducer(initialState, action);

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('when rejected', () => {
    test('sets the dateNumber and loadError', () => {
      const initialState = UNINITIALIZED_STATE;

      const testError = 'testing load error';

      const action = {
        type: loadScheduledTodos.rejected.type,
        payload: {
          dateNumber: TEST_DATE_NUMBER,
          error: { message: testError },
        },
      };

      const expectedState = {
        dateNumber: TEST_DATE_NUMBER,
        loadError: testError,
        scheduledTodos: [],
      };

      const actualState = scheduleSlice.reducer(initialState, action);

      expect(actualState).toEqual(expectedState);
    });
  });
});

describe('updateScheduledTodos', () => {
  describe('when fulfilled', () => {
    test('sets the scheduledTodos and clears updateError', () => {
      const initialState = {
        dateNumber: TEST_DATE_NUMBER,
        scheduledTodos: [],
        updateError: 'testing',
      };

      const action = {
        type: updateScheduledTodos.fulfilled.type,
        payload: INITIALIZED_STATE,
      };
      const expectedState = INITIALIZED_STATE;

      const actualState = scheduleSlice.reducer(initialState, action);

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('when rejected', () => {
    test('sets the updateError and does not change scheduledTodos', () => {
      const initialState = INITIALIZED_STATE;

      const testError = 'testing update error';

      const action = {
        type: updateScheduledTodos.rejected.type,
        payload: {
          dateNumber: TEST_DATE_NUMBER,
          error: { message: testError },
        },
      };

      const expectedState = {
        ...INITIALIZED_STATE,
        updateError: testError,
      };

      const actualState = scheduleSlice.reducer(initialState, action);

      expect(actualState).toEqual(expectedState);
    });
  });
});

describe('saveScheduledTodos', () => {
  describe('when fulfilled', () => {
    test('clears saveError', () => {
      const initialState = {
        ...INITIALIZED_STATE,
        saveError: 'testing',
      };

      const action = {
        type: saveScheduledTodos.fulfilled.type,
        payload: INITIALIZED_STATE,
      };
      const expectedState = INITIALIZED_STATE;

      const actualState = scheduleSlice.reducer(initialState, action);

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('when rejected', () => {
    test('sets the save error', () => {
      const initialState = INITIALIZED_STATE;

      const testError = 'testing save error';

      const action = {
        type: saveScheduledTodos.rejected.type,
        payload: {
          dateNumber: TEST_DATE_NUMBER,
          error: { message: testError },
        },
      };

      const expectedState = {
        ...INITIALIZED_STATE,
        saveError: testError,
      };

      const actualState = scheduleSlice.reducer(initialState, action);

      expect(actualState).toEqual(expectedState);
    });
  });
});
