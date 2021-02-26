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
import TodoEditor, { TodoEditorProps } from '../todo_editor/todo_editor';
import { Todo } from '../types';
import { act } from 'react-dom/test-utils';
import TodoCard, {
  TodoCardAction,
  TodoCardProps,
} from '../todo_card/todo_card';

const mockStore = configureStore();

jest.mock('../todo_editor/todo_editor');

function getTodoEditorMocks() {
  const placeholderText = 'mock todo editor';
  const output: {
    placeholderText: string;
    doSubmit: (todo: Todo) => void;
    doCancel: () => void;
  } = {
    placeholderText,
    doSubmit: () => {
      throw new Error('doSubmit not set (did the mock initialiaze?');
    },
    doCancel: () => {
      throw new Error('doCancel not set (did the mock initialiaze?');
    },
  };
  (TodoEditor as jest.Mock).mockImplementation((props: TodoEditorProps) => {
    output.doSubmit = props.handleSubmit;
    output.doCancel = props.handleCancel;
    return placeholderText;
  });

  return output;
}

jest.mock('../todo_card/todo_card');
function getTodoCardMocks() {
  const placeholderText = 'mock todo card';
  const output: {
    placeholderText: string;
    clickAction: (label: string) => void;
  } = {
    placeholderText,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    clickAction: (name: string) => {
      throw new Error('clickAction not set (did the mock initialiaze?');
    },
  };
  (TodoCard as jest.Mock).mockImplementation((props: TodoCardProps) => {
    output.clickAction = (name: string) => {
      let action: TodoCardAction | undefined;
      if (props.actions) {
        action = props.actions.find(
          (action: TodoCardAction) => action.name === name
        );
      }
      if (!action) {
        throw new Error(`action "${name}" not found`);
      }
      action.execute();
    };
    return (
      <>
        <span>{placeholderText}</span>
        <span>{props.todo.title}</span>
      </>
    );
  });

  return output;
}

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

    act(() => {
      todoEditorMocks.doSubmit(mockTodo);
    });

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

    act(() => {
      todoEditorMocks.doCancel();
    });

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

    act(() => {
      todoCardMocks.clickAction('Edit');
    });

    await waitFor(() => screen.getByText(todoEditorMocks.placeholderText));

    act(() => {
      todoEditorMocks.doSubmit(mockTodo);
    });

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

    act(() => {
      todoCardMocks.clickAction('Remove');
    });

    await waitFor(() => expect(actions).toEqual([removeBacklogTodo(0)]));
  });
});
