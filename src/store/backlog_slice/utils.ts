import { Todo } from '../../types';

export function addBacklogTodo(
  newTodo: Todo,
  currentBacklogTodos: Todo[]
): Todo[] {
  return [...currentBacklogTodos, newTodo];
}

export function removeBacklogTodo(
  index: number,
  currentBacklogTodos: Todo[]
): Todo[] {
  const updatedBacklogTodos = currentBacklogTodos.slice();
  updatedBacklogTodos.splice(index, 1);

  return updatedBacklogTodos;
}

export function updateBacklogTodo(
  updatedTodo: Todo,
  index: number,
  currentBacklogTodos: Todo[]
): Todo[] {
  const updatedBacklogTodos = currentBacklogTodos.slice();
  updatedBacklogTodos.splice(index, 1, updatedTodo);

  return updatedBacklogTodos;
}
