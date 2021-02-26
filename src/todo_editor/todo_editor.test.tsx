import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import TodoEditor, { EditMode, EditorView } from './todo_editor';
import { Todo } from '../types';

const testTodo: Todo = {
  title: 'test todo title',
  description: 'test todo description',
  estimate: 30,
  priority: 1,
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noOp = () => {};

describe('TodoEditor', () => {
  const testForEditorView = (editorView: EditorView) => {
    test('renders without error', () => {
      render(
        <TodoEditor handleSubmit={noOp} handleCancel={noOp} view={editorView} />
      );
      render(
        <TodoEditor
          initialTodo={testTodo}
          handleSubmit={noOp}
          handleCancel={noOp}
          view={editorView}
        />
      );

      render(
        <TodoEditor
          initialTodo={testTodo}
          handleSubmit={noOp}
          handleCancel={noOp}
          mode={EditMode.CREATE}
          view={editorView}
        />
      );
    });

    test('disables the submit button unless all fields are provided', async () => {
      render(
        <TodoEditor handleSubmit={noOp} handleCancel={noOp} view={editorView} />
      );

      const submitButton = screen.getByRole('button', {
        name: /submit/i,
      });
      expect(submitButton).toHaveAttribute('disabled');

      fireEvent.change(screen.getByLabelText(/title/i), {
        target: { value: 'test title' },
      });
      fireEvent.change(screen.getByLabelText(/description/i), {
        target: { value: 'test description' },
      });
      fireEvent.change(screen.getByLabelText(/priority/i), {
        target: { value: '1' },
      });
      fireEvent.change(screen.getByLabelText(/estimate/i), {
        target: { value: '30' },
      });

      await waitFor(() => expect(submitButton).not.toHaveAttribute('disabled'));

      fireEvent.change(screen.getByLabelText(/description/i), {
        target: { value: '' },
      });

      await waitFor(() => expect(submitButton).toHaveAttribute('disabled'));
    });

    it('provides the todo to the submit handler', async () => {
      const handleSubmitSpy = jest.fn();

      render(
        <TodoEditor
          handleSubmit={handleSubmitSpy}
          handleCancel={noOp}
          view={editorView}
        />
      );

      const testTitle = 'test title';
      fireEvent.change(screen.getByLabelText(/title/i), {
        target: { value: testTitle },
      });

      const testDescription = 'test description';
      fireEvent.change(screen.getByLabelText(/description/i), {
        target: { value: testDescription },
      });

      const testPriority = '1';
      fireEvent.change(screen.getByLabelText(/priority/i), {
        target: { value: testPriority },
      });

      const testEstimate = '30';
      fireEvent.change(screen.getByLabelText(/estimate/i), {
        target: { value: testEstimate },
      });

      const submitButton = screen.getByRole('button', {
        name: /submit/i,
      });

      fireEvent.click(submitButton);

      const expectedTodo: Todo = {
        title: testTitle,
        description: testDescription,
        priority: Number(testPriority),
        estimate: Number(testEstimate),
      };

      await waitFor(() =>
        expect(handleSubmitSpy).toHaveBeenCalledWith(expectedTodo)
      );
    });

    it('performs the cancel opperation', async () => {
      const handleCancelSpy = jest.fn();

      render(
        <TodoEditor
          handleSubmit={noOp}
          handleCancel={handleCancelSpy}
          view={editorView}
        />
      );

      const cancelButton = screen.getByRole('button', {
        name: /cancel/i,
      });

      fireEvent.click(cancelButton);

      await waitFor(() => expect(handleCancelSpy).toHaveBeenCalled());
    });
  };

  describe('Page', () => {
    testForEditorView(EditorView.PAGE);
  });

  describe('Dialog', () => {
    testForEditorView(EditorView.DIALOG);
  });
});
