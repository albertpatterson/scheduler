import React from 'react';
import { act } from 'react-dom/test-utils';
import TodoCard, { TodoCardAction, TodoCardProps } from '../todo_card';

interface Mocks {
  placeholderText: string;
  clickAction: (label: string) => void;
}

export default function getTodoCardMocks(): Mocks {
  const placeholderText = 'mock todo card';
  const output: Mocks = {
    placeholderText,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    clickAction: (name: string) => {
      throw new Error('clickAction not set (did the mock initialiaze?');
    },
  };
  (TodoCard as jest.Mock).mockImplementation((props: TodoCardProps) => {
    output.clickAction = (name: string) => {
      act(() => {
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
      });
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
