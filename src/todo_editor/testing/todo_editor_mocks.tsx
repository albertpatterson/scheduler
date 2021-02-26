import TodoEditor, { TodoEditorProps } from '../../todo_editor/todo_editor';
import { Todo } from '../../types';
import { act } from 'react-dom/test-utils';

interface Mocks {
  placeholderText: string;
  doSubmit: (todo: Todo) => void;
  doCancel: () => void;
}

export default function getTodoEditorMocks(): Mocks {
  const placeholderText = 'mock todo editor';
  const output: Mocks = {
    placeholderText,
    doSubmit: () => {
      throw new Error('doSubmit not set (did the mock initialiaze?');
    },
    doCancel: () => {
      throw new Error('doCancel not set (did the mock initialiaze?');
    },
  };
  (TodoEditor as jest.Mock).mockImplementation((props: TodoEditorProps) => {
    output.doSubmit = (todo: Todo) =>
      act(() => {
        props.handleSubmit(todo);
      });
    output.doCancel = () =>
      act(() => {
        props.handleCancel();
      });
    return placeholderText;
  });

  return output;
}
