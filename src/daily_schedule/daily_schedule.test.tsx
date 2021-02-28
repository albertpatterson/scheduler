import React, { ReactElement } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import DailySchedule from './daily_schedule';
import configureStore from 'redux-mock-store';
import {
  addTodoAtEnd,
  removeScheduledTodo,
  updateScheduledTodo,
} from '../store/scheduleSlice/scheduleSlice';
import { Provider } from 'react-redux';
import { ScheduledTodo, Todo } from '../types';
import { ScheduleSlice } from '../store/scheduleSlice/scheduleSlice';
import getTodoCardMocks from '../todo_card/testing/todo_card_mocks';
import getTodoEditorMocks from '../todo_editor/testing/todo_editor_mocks';
import thunk from 'redux-thunk';
import * as dispatch_async_thunk from '../store/dispatch_async_thunk';

jest.mock('../todo_editor/todo_editor');
jest.mock('../todo_card/todo_card');

const mockStore = configureStore([thunk]);

const FIRST_START = new Date('1/1/2020');

const TEST_SCHEDULED_TODO: ScheduledTodo = {
  title: 'test scheduled todo title',
  description: 'test scheduled todo description',
  priority: 100,
  estimate: 750,
  start: FIRST_START,
};

const TEST_TODO: Todo = {
  title: 'test todo title',
  description: 'test todo description',
  priority: 10,
  estimate: 60,
};

describe('Daily Schedule', () => {
  let wrappedComponent: ReactElement;
  let store = mockStore({});
  let dispatchAsyncThunkSpy: jest.SpiedFunction<
    typeof dispatch_async_thunk.dispatchAsyncThunk
  >;

  beforeEach(() => {
    dispatchAsyncThunkSpy = jest.spyOn(
      dispatch_async_thunk,
      'dispatchAsyncThunk'
    );

    const scheduleSlice: ScheduleSlice = {
      scheduledTodos: [TEST_SCHEDULED_TODO],
    };
    const initialState = { schedule: scheduleSlice };
    store = mockStore(initialState);

    wrappedComponent = (
      <Provider store={store}>
        <DailySchedule />
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
    screen.getByText(TEST_SCHEDULED_TODO.title);
  });

  test('adds a scheduled todo item', async () => {
    getTodoCardMocks();

    const todoEditorMocks = getTodoEditorMocks();

    render(wrappedComponent);

    fireEvent.click(screen.getByRole('button', { name: /new task/i }));

    await waitFor(() => screen.getByText(todoEditorMocks.placeholderText));

    todoEditorMocks.doSubmit(TEST_TODO);

    await waitFor(() =>
      expect(dispatchAsyncThunkSpy).toHaveBeenCalledWith(
        expect.any(Function),
        addTodoAtEnd,
        {
          todo: TEST_TODO,
        }
      )
    );
  });

  test('cancels adding a scheduled todo item', async () => {
    getTodoCardMocks();

    const todoEditorMocks = getTodoEditorMocks();

    render(wrappedComponent);

    fireEvent.click(screen.getByRole('button', { name: /new task/i }));

    await waitFor(() => screen.getByText(todoEditorMocks.placeholderText));

    todoEditorMocks.doCancel();

    await waitFor(() =>
      expect(screen.queryByText(todoEditorMocks.placeholderText)).toBe(null)
    );

    expect(dispatchAsyncThunkSpy).not.toHaveBeenCalledWith(
      expect.any(Function),
      addTodoAtEnd,
      expect.any(Object)
    );
  });

  test('edits a scheduled todo item', async () => {
    const todoCardMocks = getTodoCardMocks();
    const todoEditorMocks = getTodoEditorMocks();

    render(wrappedComponent);

    todoCardMocks.clickAction('Edit');

    await waitFor(() => screen.getByText(todoEditorMocks.placeholderText));

    todoEditorMocks.doSubmit(TEST_TODO);

    const newScheduledTodo = { ...TEST_SCHEDULED_TODO, ...TEST_TODO };

    await waitFor(() =>
      expect(dispatchAsyncThunkSpy).toHaveBeenCalledWith(
        expect.any(Function),
        updateScheduledTodo,
        {
          updatedScheduledTodo: newScheduledTodo,
          index: 0,
        }
      )
    );
  });

  test('removes a scheduled todo item', async () => {
    const todoCardMocks = getTodoCardMocks();

    render(wrappedComponent);

    todoCardMocks.clickAction('Remove');

    await waitFor(() =>
      expect(dispatchAsyncThunkSpy).toHaveBeenCalledWith(
        expect.any(Function),
        removeScheduledTodo,
        expect.objectContaining({ index: 0 })
      )
    );
  });
});
