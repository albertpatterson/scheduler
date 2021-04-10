import React, { ReactElement } from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { PartialStoreType } from 'store/schedule_slice/schedule_slice';
import { Provider } from 'react-redux';
import { LeftoverTodosDialog } from './leftover_todos_dialog';
import { ScheduledTodo } from 'types';
import thunk from 'redux-thunk';
import { addTodoAtEnd } from 'store/schedule_slice/schedule_slice';
import * as dispatchAsyncThunk from '../store/dispatch_async_thunk';
import * as reactRedux from 'react-redux';
import { addBacklogTodo } from 'store/backlog_slice/backlog_slice';
import { Dispatch, Action } from 'redux';

const FIRST_START = 60 * 9; //9:00 AM;

const TEST_SCHEDULED_TODO: ScheduledTodo = {
  title: 'test scheduled todo title',
  description: 'test scheduled todo description',
  priority: 100,
  estimate: 750,
  start: FIRST_START,
};

const LEFTOVER_TODOS: ScheduledTodo[] = [TEST_SCHEDULED_TODO];

const INITIAL_STATE_WITH_LEFTOVER_TODOS = {
  schedule: {
    dateNumber: 0,
    scheduledTodos: [],
    leftoverTodos: LEFTOVER_TODOS,
  },
};

const INITIAL_STATE_WITHOUT_LEFTOVER_TODOS = {
  schedule: {
    ...INITIAL_STATE_WITH_LEFTOVER_TODOS.schedule,
    leftoverTodos: [],
  },
};

function getLeftoverTodosDialog() {
  return screen.queryByRole('dialog', {
    name: (content, element) => {
      return element.innerHTML.indexOf('Leftover Todos') !== -1;
    },
  });
}

function getScheduleTodosButton() {
  return screen.getByRole('button', {
    name: (content, element) => {
      return element.innerHTML.indexOf('Schedule Today') !== -1;
    },
  });
}

function getAddTodosToBacklogButton() {
  return screen.getByRole('button', {
    name: (content, element) => {
      return element.innerHTML.indexOf('Move to backlog') !== -1;
    },
  });
}

function expectLeftoverTodosDialogPresent(expectNotPresent = false) {
  const query = getLeftoverTodosDialog();

  if (expectNotPresent) {
    expect(query).toBe(null);
  } else {
    expect(query).not.toBe(null);
  }
}

async function waitForLeftoverTodosDialogPresent(expectNotPresent = false) {
  await waitFor(() => expectLeftoverTodosDialogPresent(expectNotPresent));
}

const mockStore = configureStore([thunk]);

describe('LeftoverTodosDialog', () => {
  let wrappedComponent: ReactElement;
  let dispatchAsyncThunkSpy: jest.SpiedFunction<
    typeof dispatchAsyncThunk.dispatchAsyncThunk
  >;
  let dispatchSpy: jest.FunctionLike;

  function renderForInitialState(
    initialState: PartialStoreType | (() => PartialStoreType)
  ) {
    dispatchAsyncThunkSpy = jest.spyOn(
      dispatchAsyncThunk,
      'dispatchAsyncThunk'
    );

    const store = mockStore(initialState);

    dispatchSpy = jest.fn();
    jest
      .spyOn(reactRedux, 'useDispatch')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockReturnValue(dispatchSpy as Dispatch<Action<any>>);

    wrappedComponent = (
      <Provider store={store}>
        <LeftoverTodosDialog />
      </Provider>
    );

    render(wrappedComponent);

    return store;
  }

  it('opens when there are leftover todos', async () => {
    renderForInitialState(INITIAL_STATE_WITH_LEFTOVER_TODOS);

    await waitForLeftoverTodosDialogPresent();
  });

  it('does not opens when there are no leftover todos', () => {
    renderForInitialState(INITIAL_STATE_WITHOUT_LEFTOVER_TODOS);

    expectLeftoverTodosDialogPresent(true);
  });

  it('schedules leftover todos', async () => {
    renderForInitialState(INITIAL_STATE_WITH_LEFTOVER_TODOS);

    await waitForLeftoverTodosDialogPresent();

    const scheduleTodosButton = getScheduleTodosButton();

    fireEvent.click(scheduleTodosButton);

    await waitFor(() => expect(dispatchAsyncThunkSpy).toHaveBeenCalledTimes(1));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);

    expect(dispatchAsyncThunkSpy).toHaveBeenLastCalledWith(
      dispatchSpy,
      addTodoAtEnd,
      { todo: TEST_SCHEDULED_TODO }
    );
  });

  it('moves leftover todos to backlog', async () => {
    renderForInitialState(INITIAL_STATE_WITH_LEFTOVER_TODOS);

    await waitForLeftoverTodosDialogPresent();

    const addTodosToBacklogButton = getAddTodosToBacklogButton();

    fireEvent.click(addTodosToBacklogButton);

    await waitFor(() => expect(dispatchAsyncThunkSpy).toHaveBeenCalledTimes(1));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);

    expect(dispatchAsyncThunkSpy).toHaveBeenLastCalledWith(
      dispatchSpy,
      addBacklogTodo,
      { newTodo: TEST_SCHEDULED_TODO }
    );
  });
});
