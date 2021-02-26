import React, { ReactElement } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Backlog from './backlog';
import configureStore from 'redux-mock-store';
import {
  addBacklogTodo,
  BacklogSlice,
  removeBacklogTodo,
  updateBacklogTodo,
} from '../store/backlogSlice';
import { Provider } from 'react-redux';
import { Todo } from '../types';

import getTodoCardMocks from '../todo_card/testing/todo_card_mocks';
import getTodoEditorMocks from '../todo_editor/testing/todo_editor_mocks';

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

  beforeEach(() => {
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
    screen.getByText(mockTodo.title);
  });

  test('adds a backlog item', async () => {
    getTodoCardMocks();

    const todoEditorMocks = getTodoEditorMocks();

    render(wrappedComponent);

    const actions = store.getActions();
    expect(actions).toEqual([]);

    fireEvent.click(screen.getByRole('button', { name: /new task/i }));

    await waitFor(() => screen.getByText(todoEditorMocks.placeholderText));

    todoEditorMocks.doSubmit(mockTodo);

    await waitFor(() => expect(actions).toEqual([addBacklogTodo(mockTodo)]));
  });

  test('cancels adding a backlog item', async () => {
    getTodoCardMocks();

    const todoEditorMocks = getTodoEditorMocks();

    render(wrappedComponent);

    const actions = store.getActions();
    expect(actions).toEqual([]);

    fireEvent.click(screen.getByRole('button', { name: /new task/i }));

    await waitFor(() => screen.getByText(todoEditorMocks.placeholderText));

    todoEditorMocks.doCancel();

    await waitFor(() =>
      expect(screen.queryByText(todoEditorMocks.placeholderText)).toBe(null)
    );

    expect(actions).toEqual([]);
  });

  test('edits a backlog item', async () => {
    const todoCardMocks = getTodoCardMocks();
    const todoEditorMocks = getTodoEditorMocks();

    render(wrappedComponent);

    const actions = store.getActions();
    expect(actions).toEqual([]);

    todoCardMocks.clickAction('Edit');

    await waitFor(() => screen.getByText(todoEditorMocks.placeholderText));

    todoEditorMocks.doSubmit(mockTodo);

    await waitFor(() =>
      expect(actions).toEqual([
        updateBacklogTodo({ newTodo: mockTodo, index: 0 }),
      ])
    );
  });

  test('removes a backlog item', async () => {
    const todoCardMocks = getTodoCardMocks();

    render(wrappedComponent);

    const actions = store.getActions();
    expect(actions).toEqual([]);

    todoCardMocks.clickAction('Remove');

    await waitFor(() => expect(actions).toEqual([removeBacklogTodo(0)]));
  });
});
