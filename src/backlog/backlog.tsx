import React, { ChangeEvent, FunctionComponent, ReactElement } from 'react';
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
import { useSelector } from 'react-redux';

export type BacklogProps = unknown;

enum SortByOption {
  TITLE,
  DESCRIPTION,
  ESTIMATE,
  PRIORITY,
}

export const Backlog: FunctionComponent<BacklogProps> = () => {
  const [searchFilter, setSearchFilter] = React.useState<string | null>(null);
  const [sortBy, setSortBy] = React.useState<SortByOption | null>(null);

  const backlogTodos = useSelector(SELECTORS.backlog.backlogTodos);

  function handleChangeSortBy(event: ChangeEvent<{ value: unknown }>) {
    const value = (event.target.value as SortByOption) ?? null;
    setSortBy(value);
  }

  function handleChangeSearchFilter(event: ChangeEvent<{ value: unknown }>) {
    const value = (event.target.value as string) ?? null;
    setSearchFilter(value);
  }

  return (
    <>
      <div className="search-sort-bar">
        <div className="search-bar">
          <SearchIcon />
          <InputBase
            className="search-input"
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
            value={searchFilter ?? undefined}
            onChange={handleChangeSearchFilter}
          />
        </div>
        <div className="sort-by-select">
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
