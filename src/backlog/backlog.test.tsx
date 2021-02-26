import React, { ReactElement } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Backlog from './backlog';
import configureStore from 'redux-mock-store';
import { addBacklogTodo, BacklogSlice } from '../store/backlogSlice';
import { Provider } from 'react-redux';
import { TodoEditorProps } from '../todo_editor/todo_editor';
import { Todo } from '../types';

const mockStore = configureStore();

let mockSubmitTodoEditor = true;
const mockTodoEditorText = 'mock todo editor';
jest.mock('../todo_editor/todo_editor', () => ({
  __esModule: true,
  EditMode: {},
  EditorView: {},
  default: (props: TodoEditorProps) => {
    setTimeout(() => {
      if (mockSubmitTodoEditor) {
        props.handleSubmit(mockTodo);
      } else {
        props.handleCancel();
      }
    });
    return mockTodoEditorText;
  },
}));

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
    render(wrappedComponent);
  });

  test('displays the backlog items', () => {
    render(wrappedComponent);
    screen.getByText(mockTodo.title);
  });

  test('adds a backlog item', async () => {
    mockSubmitTodoEditor = true;
    render(wrappedComponent);

    const actions = store.getActions();
    expect(actions).toEqual([]);

    fireEvent.click(screen.getByRole('button', { name: /new task/i }));

    await waitFor(() => screen.getByText(mockTodoEditorText));

    // submit pressed automaticall

    await waitFor(() => expect(actions).toEqual([addBacklogTodo(mockTodo)]));
  });

  test('cancels adding a backlog item', async () => {
    mockSubmitTodoEditor = false;
    render(wrappedComponent);

    const actions = store.getActions();
    expect(actions).toEqual([]);

    fireEvent.click(screen.getByRole('button', { name: /new task/i }));

    await waitFor(() => screen.getByText(mockTodoEditorText));

    // cancel pressed automaticall

    await waitFor(() =>
      expect(screen.queryByText(mockTodoEditorText)).toBe(null)
    );

    expect(actions).toEqual([]);
  });
});
