import React from 'react';
import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import TodoCard, { TEST_IDS, TodoCardAction } from './todo_card';
import { Todo } from '../types';

const testTodo: Todo = {
  title: 'test todo title',
  description: 'test todo description',
  estimate: 30,
  priority: 1,
};

const testAction: TodoCardAction = {
  name: 'test action',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  execute: () => {},
};

describe('TodoCard', () => {
  test('renders without error', () => {
    render(<TodoCard todo={testTodo} />);
  });

  test('expands to show description', async () => {
    render(<TodoCard todo={testTodo} />);

    expect(screen.queryByText(testTodo.description)).toBe(null);

    fireEvent.click(screen.getByTestId(TEST_IDS.EXPAND_CARD_BUTTON));

    expect(screen.queryByText(testTodo.description)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId(TEST_IDS.EXPAND_CARD_BUTTON));

    await waitForElementToBeRemoved(screen.queryByText(testTodo.description));
  });

  describe('actions menu', () => {
    test('is not shown when no actions are provided', () => {
      render(<TodoCard todo={testTodo} />);
      expect(screen.queryByTestId(TEST_IDS.ACTION_MENU_ICON_BUTTON)).toBe(null);
    });

    test('is shown when actions are provided', () => {
      render(<TodoCard todo={testTodo} actions={[testAction]} />);
      expect(
        screen.queryByTestId(TEST_IDS.ACTION_MENU_ICON_BUTTON)
      ).toBeInTheDocument();
    });

    test('executs the action', () => {
      const executeSpy = jest.spyOn(testAction, 'execute');

      render(<TodoCard todo={testTodo} actions={[testAction]} />);

      fireEvent.click(screen.getByTestId(TEST_IDS.ACTION_MENU_ICON_BUTTON));

      expect(screen.queryByText(testAction.name)).toBeInTheDocument();

      fireEvent.click(screen.getByText(testAction.name));

      () => expect(executeSpy).toHaveBeenCalled();
    });
  });
});
