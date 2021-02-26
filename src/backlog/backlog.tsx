import React, {
  ChangeEvent,
  FunctionComponent,
  ReactElement,
  useState,
} from 'react';
import { Todo } from '../types';
import { TodoCard } from '../todo_card/todo_card';
import './backlog.css';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import { FormControl } from '@material-ui/core';
import { SELECTORS } from '../store/selectors';
import { useSelector, useDispatch } from 'react-redux';
import {
  addBacklogTodo,
  removeBacklogTodo,
  updateBacklogTodo,
} from '../store/backlogSlice';
import Button from '@material-ui/core/Button';
import TodoEditor, {
  EditMode,
  EditorView,
  TodoEditorProps,
} from '../todo_editor/todo_editor';

export type BacklogProps = unknown;

enum SortByOption {
  TITLE,
  DESCRIPTION,
  ESTIMATE,
  PRIORITY,
}

export const Backlog: FunctionComponent<BacklogProps> = () => {
  const dispatch = useDispatch();
  const backlogTodos = useSelector(SELECTORS.backlog.backlogTodos);

  const [searchFilter, setSearchFilter] = React.useState<string | null>(null);
  const [sortBy, setSortBy] = React.useState<SortByOption | null>(null);

  function handleChangeSortBy(event: ChangeEvent<{ value: unknown }>) {
    const value = (event.target.value as SortByOption) ?? null;
    setSortBy(value);
  }

  function handleChangeSearchFilter(event: ChangeEvent<{ value: unknown }>) {
    const value = (event.target.value as string) ?? null;
    setSearchFilter(value);
  }

  function handleEditTodoSubmit(todo: Todo) {
    closeTodoEditor();
    if (editingTodoIndex === null) {
      dispatch(addBacklogTodo(todo));
    } else {
      dispatch(updateBacklogTodo({ newTodo: todo, index: editingTodoIndex }));
      setEditingTodoIndex(null);
    }
  }

  const [showTodoEditor, setShowTodoEditor] = useState(false);

  function openTodoEditor() {
    setShowTodoEditor(true);
  }

  function closeTodoEditor() {
    setShowTodoEditor(false);
  }

  const smallScreen = true;
  const showTodoEditorDialog = showTodoEditor && !smallScreen;
  const showTodoEditorPage = showTodoEditor && smallScreen;

  const [editingTodoIndex, setEditingTodoIndex] = useState<number | null>(null);
  const editTodo = (index: number) => {
    setEditingTodoIndex(index);
    openTodoEditor();
  };

  const createTodo = () => {
    setEditingTodoIndex(null);
    openTodoEditor();
  };

  const removeTodo = (index: number) => {
    dispatch(removeBacklogTodo(index));
  };

  const doTodoToday = (index: number) => {
    removeTodo(index);
    console.log(`schedule and add todo # ${index}`);
  };

  const todoEditorBaseProps: Omit<TodoEditorProps, 'view'> = {
    handleSubmit: handleEditTodoSubmit,
    handleCancel: closeTodoEditor,
    mode: EditMode.CREATE,
    initialTodo:
      editingTodoIndex === null ? undefined : backlogTodos[editingTodoIndex],
  };

  const mainPage = (
    <>
      <div className="controls-row">
        <div className="control">
          <Button color="primary" onClick={createTodo}>
            New Task
          </Button>
        </div>
        <div className="search-bar control">
          <SearchIcon />
          <InputBase
            className="search-input"
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
            value={searchFilter ?? undefined}
            onChange={handleChangeSearchFilter}
          />
        </div>
        <div className="control">
          <FormControl>
            <InputLabel id="sort-by-select-label">Sort By</InputLabel>
            <Select
              value={sortBy ?? undefined}
              labelId="sort-by-select-label"
              className="sort-by-select-input"
              onChange={handleChangeSortBy}
            >
              <MenuItem value={undefined}>None</MenuItem>
              <MenuItem value={SortByOption.TITLE}>Title</MenuItem>
              <MenuItem value={SortByOption.DESCRIPTION}>Description</MenuItem>
              <MenuItem value={SortByOption.ESTIMATE}>Estimate</MenuItem>
              <MenuItem value={SortByOption.PRIORITY}>Priority</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      <ul className="todo-list">
        {backlogTodos.map((todo, index) =>
          createTodoView(
            todo,
            index,
            () => doTodoToday(index),
            () => editTodo(index),
            () => removeTodo(index)
          )
        )}
      </ul>
      {showTodoEditorDialog && (
        <TodoEditor
          {...todoEditorBaseProps}
          view={EditorView.DIALOG}
        ></TodoEditor>
      )}
    </>
  );

  return (
    <>
      {!showTodoEditorPage ? (
        mainPage
      ) : (
        <TodoEditor
          {...todoEditorBaseProps}
          view={EditorView.PAGE}
        ></TodoEditor>
      )}
    </>
  );
};

function createTodoView(
  todo: Todo,
  index: number,
  doTodoToday: () => void,
  editTodo: () => void,
  removeTodo: () => void
): ReactElement {
  const key = todo.title + todo.description;
  const actions = [
    {
      name: 'Do Today',
      execute: doTodoToday,
    },
    {
      name: 'Edit',
      execute: editTodo,
    },
    {
      name: 'Remove',
      execute: removeTodo,
    },
  ];
  return (
    <div key={key} className="todo-view">
      <TodoCard todo={todo} actions={actions}></TodoCard>
    </div>
  );
}

export default Backlog;
