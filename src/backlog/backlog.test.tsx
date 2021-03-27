import React, { ReactElement } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Backlog from './backlog';
import configureStore from 'redux-mock-store';
import {
  addBacklogTodo,
  BacklogSlice,
  removeBacklogTodo,
  updateBacklogTodo,
  loadBacklogTodos,
} from '../store/backlog_slice/backlog_slice';
import {
  loadScheduledTodosToday,
  addTodoAtEnd,
} from '../store/schedule_slice/schedule_slice';
import { Provider } from 'react-redux';
import { Todo } from '../types';

import getTodoCardMocks from '../todo_card/testing/todo_card_mocks';
import getTodoEditorMocks from '../todo_editor/testing/todo_editor_mocks';
import * as dispatchAsyncThunk from '../store/dispatch_async_thunk';
import * as reactRedux from 'react-redux';
import { Dispatch, Action } from 'redux';

jest.mock('../todo_editor/todo_editor');
jest.mock('../todo_card/todo_card');

const mockStore = configureStore();

const mockTodo: Todo = {
  title: 'test todo title',
  description: 'test todo description',
  estimate: 30,
  priority: 1,
};

describe('Backlog', () => {
  let wrappedComponent: ReactElement;
  let store = mockStore({});
  let dispatchAsyncThunkSpy: jest.SpiedFunction<
    typeof dispatchAsyncThunk.dispatchAsyncThunk
  >;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let dispatchSpy: Dispatch<Action<any>>;

  function expectOnlyLoadThunkDispatched() {
    expect(dispatchAsyncThunkSpy).toHaveBeenCalledTimes(1);
    expect(dispatchAsyncThunkSpy).toHaveBeenCalledWith(
      dispatchSpy,
      loadBacklogTodos,
      {}
    );
  }

  beforeEach(() => {
    dispatchAsyncThunkSpy = jest.spyOn(
      dispatchAsyncThunk,
      'dispatchAsyncThunk'
    );

    dispatchSpy = jest.fn();

    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(dispatchSpy);

    const backlogSlice: BacklogSlice = {
      backlogTodos: [mockTodo],
    };
    const initialState = { backlog: backlogSlice };
    store = mockStore(initialState);

    wrappedComponent = (
      <Provider store={store}>
        <Backlog />
      </Provider>
    );
  });

  test('renders without crashing', () => {
    getTodoCardMocks();

    render(wrappedComponent);
  });

  test('displays the backlog items', () => {
    getTodoCardMocks();

    render(wrappedComponent);

    expectOnlyLoadThunkDispatched();

    screen.getByText(mockTodo.title);
  });

  test('adds a backlog item', async () => {
    getTodoCardMocks();

    const todoEditorMocks = getTodoEditorMocks();

    render(wrappedComponent);

    expectOnlyLoadThunkDispatched();

    fireEvent.click(screen.getByRole('button', { name: /new task/i }));

    await waitFor(() => screen.getByText(todoEditorMocks.placeholderText));

    todoEditorMocks.doSubmit(mockTodo);

    await waitFor(() =>
      expect(dispatchAsyncThunkSpy).toHaveBeenCalledWith(
        dispatchSpy,
        addBacklogTodo,
        {
          newTodo: mockTodo,
        }
      )
    );
  });

  test('cancels adding a backlog item', async () => {
    getTodoCardMocks();

    const todoEditorMocks = getTodoEditorMocks();

    render(wrappedComponent);

    expectOnlyLoadThunkDispatched();

    fireEvent.click(screen.getByRole('button', { name: /new task/i }));

    await waitFor(() => screen.getByText(todoEditorMocks.placeholderText));

    todoEditorMocks.doCancel();

    await waitFor(() =>
      expect(screen.queryByText(todoEditorMocks.placeholderText)).toBe(null)
    );

    expect(dispatchAsyncThunkSpy).not.toHaveBeenCalledWith();
  });

  test('edits a backlog item', async () => {
    const todoCardMocks = getTodoCardMocks();
    const todoEditorMocks = getTodoEditorMocks();

    render(wrappedComponent);

    expectOnlyLoadThunkDispatched();

    todoCardMocks.clickAction('Edit');

    await waitFor(() => screen.getByText(todoEditorMocks.placeholderText));

    todoEditorMocks.doSubmit(mockTodo);

    await waitFor(() =>
      expect(dispatchAsyncThunkSpy).toHaveBeenCalledWith(
        dispatchSpy,
        updateBacklogTodo,
        { updatedTodo: mockTodo, index: 0 }
      )
    );
  });

  test('removes a backlog item', async () => {
    const todoCardMocks = getTodoCardMocks();

    render(wrappedComponent);

    expectOnlyLoadThunkDispatched();

    todoCardMocks.clickAction('Remove');

    await waitFor(() =>
      expect(dispatchAsyncThunkSpy).toHaveBeenCalledWith(
        dispatchSpy,
        removeBacklogTodo,
        { index: 0 }
      )
    );
  });

  describe('scheduling a backlog item', () => {
    test('addes the scheduled todo and removes the backlog item', async () => {
      const todoCardMocks = getTodoCardMocks();

      render(wrappedComponent);

      expectOnlyLoadThunkDispatched();

      dispatchAsyncThunkSpy.mockReturnValue(Promise.resolve({}));

      todoCardMocks.clickAction('Do Today');

      await waitFor(() =>
        expect(dispatchAsyncThunkSpy).toHaveBeenCalledWith(
          dispatchSpy,
          addTodoAtEnd,
          { todo: mockTodo }
        )
      );

      await waitFor(() =>
        expect(dispatchAsyncThunkSpy).toHaveBeenCalledWith(
          dispatchSpy,
          removeBacklogTodo,
          { index: 0 }
        )
      );
    });

    test('does not remove the backlog item if adding the scheduled todo fails', async () => {
      const todoCardMocks = getTodoCardMocks();

      render(wrappedComponent);

      expectOnlyLoadThunkDispatched();

      dispatchAsyncThunkSpy.mockReturnValue(Promise.reject('testing error'));

      todoCardMocks.clickAction('Do Today');

      await waitFor(() =>
        expect(dispatchAsyncThunkSpy).toHaveBeenCalledWith(
          dispatchSpy,
          loadScheduledTodosToday,
          undefined
        )
      );

      expect(dispatchAsyncThunkSpy).not.toHaveBeenCalledWith(
        dispatchSpy,
        removeBacklogTodo,
        expect.any(Object)
      );
    });
  });
});
