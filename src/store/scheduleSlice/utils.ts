import { ScheduledTodo, Todo } from '../../types';
import { getNowMinute } from '../../utils/utils';

export function addScheduledTodo(
  newScheduledTodo: ScheduledTodo,
  currentScheduledTodos: ScheduledTodo[]
): ScheduledTodo[] {
  const updatedScheduledTodos = [...currentScheduledTodos, newScheduledTodo];
  return getAlignedScheduledTodos(updatedScheduledTodos);
}

export function addTodoAtEnd(
  newTodo: Todo,
  currentScheduledTodos: ScheduledTodo[]
): ScheduledTodo[] {
  const newScheduledTodo = {
    ...newTodo,
    start: getNextStartTime(currentScheduledTodos),
  };

  return addScheduledTodo(newScheduledTodo, currentScheduledTodos);
}

function getNextStartTime(scheduledTodos: ScheduledTodo[]): number {
  let latestAvailableStart = getNowMinute();

  for (const scheduledTodo of scheduledTodos) {
    const nextAvailableStart = scheduledTodo.start + scheduledTodo.estimate;
    if (nextAvailableStart > latestAvailableStart) {
      latestAvailableStart = nextAvailableStart;
    }
  }

  return latestAvailableStart;
}

export function removeScheduledTodo(
  index: number,
  currentScheduledTodos: ScheduledTodo[]
): ScheduledTodo[] {
  const updatedScheduledTodos = currentScheduledTodos.slice();
  const removed = updatedScheduledTodos.splice(index, 1);
  // move the new todo to the front if the first was removed... will require more thought once todos can be completed
  if (index === 0) {
    updatedScheduledTodos[0] = {
      ...updatedScheduledTodos[0],
      start: removed[0].start,
    };
  }
  return getAlignedScheduledTodos(updatedScheduledTodos);
}

function getAlignedScheduledTodos(scheduledTodos: ScheduledTodo[]) {
  const scheduledTodosSorted = scheduledTodos.sort(sortByStartDesc);

  const scheduledTodosSortedAligned = alignStarts(scheduledTodosSorted);

  return scheduledTodosSortedAligned;
}

export function updateScheduledTodo(
  updatedScheduledTodo: ScheduledTodo,
  updateIndex: number,
  currentScheduledTodos: ScheduledTodo[]
): ScheduledTodo[] {
  const updatedScheduledTodos = currentScheduledTodos.slice();
  updatedScheduledTodos.splice(updateIndex, 1, updatedScheduledTodo);

  const previousScheduledTodo = currentScheduledTodos[updateIndex];
  if (
    previousScheduledTodo.start === updatedScheduledTodo.start &&
    previousScheduledTodo.estimate === updatedScheduledTodo.estimate
  ) {
    // no other times will have changed
    return updatedScheduledTodos;
  }

  return getAlignedScheduledTodos(updatedScheduledTodos);
}

function alignStarts(sortedScheduledTodos: ScheduledTodo[]) {
  if (sortedScheduledTodos.length < 2) {
    return sortedScheduledTodos;
  }

  const aligned = sortedScheduledTodos.slice(0, 1);

  let lastAvailableStart = sortedScheduledTodos[0].start;

  for (let index = 1; index < sortedScheduledTodos.length; index++) {
    const previousScheduledTodo = sortedScheduledTodos[index - 1];
    const currentScheduledTodos = sortedScheduledTodos[index];
    const nextAvailableStart = calculateFinish(
      lastAvailableStart,
      previousScheduledTodo.estimate
    );
    const start = nextAvailableStart;
    aligned.push({
      ...currentScheduledTodos,
      start,
    });

    lastAvailableStart = nextAvailableStart;
  }

  return aligned;
}

function sortByStartDesc(t1: ScheduledTodo, t2: ScheduledTodo) {
  const v1 = t1.start;
  const v2 = t2.start;
  return v1 > v2 ? 1 : v1 === v2 ? 0 : -1;
}

export function calculateFinish(start: number, estimate: number): number {
  return start + estimate;
}
