import React, { FunctionComponent, useState } from 'react';
import { Todo } from '../types';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TodoEditorBase from './todo_editor_base';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import './todo_editor.css';

export enum EditMode {
  CREATE,
  EDIT,
}

export enum EditorView {
  DIALOG,
  PAGE,
}

export interface TodoEditorProps {
  initialTodo?: Todo;
  handleSubmit: (todo: Todo) => void;
  handleCancel: () => void;
  mode?: EditMode;
  view?: EditorView;
}

const CREATE_TODO_TITLE = 'Create a Task';
const EDIT_TODO_TITLE = 'Edit a Task';

export const TEST_IDS = {
  todoEditorSubmitButton: 'todoEditorSubmitButton',
  todoEditorCancelButton: 'todoEditorCancelButton',
};

export const TodoEditor: FunctionComponent<TodoEditorProps> = (
  props: TodoEditorProps
) => {
  const [currentTodo, setCurrentTodo] = useState(props.initialTodo || null);

  const handleTodoChange = (todo: Todo | null) => {
    // console.log('handle todo change', todo);
    setCurrentTodo(todo);
  };

  const title =
    props.mode === EditMode.CREATE ? CREATE_TODO_TITLE : EDIT_TODO_TITLE;
  const submitDisabled = !currentTodo;

  const ChosenEditorView: FunctionComponent<TodoEditorViewProps> =
    props.view === EditorView.DIALOG ? TodoEditorDialog : TodoEditorPage;

  return (
    <ChosenEditorView
      initialTodo={props.initialTodo}
      title={title}
      handleTodoChange={handleTodoChange}
      submitDisabled={submitDisabled}
      handleSubmit={() => {
        if (currentTodo) {
          props.handleSubmit(currentTodo);
        }
      }}
      handleCancel={props.handleCancel}
    ></ChosenEditorView>
  );
};

interface TodoEditorViewProps {
  initialTodo?: Todo;
  title: string;
  handleTodoChange: (todo: Todo | null) => void;
  submitDisabled: boolean;
  handleSubmit: () => void;
  handleCancel: () => void;
}

const TodoEditorPage: FunctionComponent<TodoEditorViewProps> = (
  props: TodoEditorViewProps
) => {
  // console.log('submit disabled', props.submitDisabled, props);

  return (
    <>
      <Typography variant="h4" align="center" paragraph>
        {props.title}
      </Typography>
      <TodoEditorBase
        initialTodo={props.initialTodo}
        handleTodoChange={props.handleTodoChange}
      ></TodoEditorBase>
      <div className="action-button-group-container">
        <Button
          color="primary"
          disabled={props.submitDisabled}
          onClick={props.handleSubmit}
          data-testid={TEST_IDS.todoEditorSubmitButton}
        >
          SUBMIT
        </Button>
        <Button
          color="secondary"
          onClick={props.handleCancel}
          data-testid={TEST_IDS.todoEditorCancelButton}
        >
          CANCEL
        </Button>
      </div>
    </>
  );
};

const TodoEditorDialog: FunctionComponent<TodoEditorViewProps> = (
  props: TodoEditorViewProps
) => {
  return (
    <Dialog aria-labelledby={props.title} open={true}>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <TodoEditorBase
          initialTodo={props.initialTodo}
          handleTodoChange={props.handleTodoChange}
        ></TodoEditorBase>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          disabled={props.submitDisabled}
          onClick={props.handleSubmit}
          data-testid={TEST_IDS.todoEditorSubmitButton}
        >
          SUBMIT
        </Button>
        <Button
          color="secondary"
          onClick={props.handleCancel}
          data-testid={TEST_IDS.todoEditorCancelButton}
        >
          CANCEL
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TodoEditor;
