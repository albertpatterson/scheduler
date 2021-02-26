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
import { addBacklogTodo } from '../store/backlogSlice';
import Button from '@material-ui/core/Button';
import TodoEditor, { EditMode, EditorView } from '../todo_editor/todo_editor';

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

  function handleAddTodoSubmit(todo: Todo) {
    closeTodoEditor();
    dispatch(addBacklogTodo(todo));
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

  const mainPage = (
    <>
      <div className="controls-row">
        <div className="control">
          <Button color="primary" onClick={openTodoEditor}>
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
      <ul className="todo-list">{backlogTodos.map(createTodoView)}</ul>
      {showTodoEditorDialog && (
        <TodoEditor
          handleSubmit={handleAddTodoSubmit}
          handleCancel={closeTodoEditor}
          view={EditorView.DIALOG}
          mode={EditMode.CREATE}
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
          handleSubmit={handleAddTodoSubmit}
          handleCancel={closeTodoEditor}
          view={EditorView.PAGE}
          mode={EditMode.CREATE}
        ></TodoEditor>
      )}
    </>
  );
};

function createTodoView(todo: Todo): ReactElement {
  const key = todo.title + todo.description;
  const actions = [
    {
      name: 'Do Today',
      execute: () => {
        console.log(todo.title + ' Do Today!');
      },
    },
    {
      name: 'Delete',
      execute: () => {
        console.log(todo.title + ' Delete');
      },
    },
  ];
  return (
    <div key={key} className="todo-view">
      <TodoCard todo={todo} actions={actions}></TodoCard>
    </div>
  );
}

export default Backlog;
