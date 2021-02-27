import { ScheduledTodo, Todo } from '../../types';
import { MS_IN_MIN } from '../../constants';

export function addScheduledTodo(
  newScheduledTodo: ScheduledTodo,
  currentScheduledTodos: ScheduledTodo[]
): ScheduledTodo[] {
  const updatedScheduledTodos = [...currentScheduledTodos, newScheduledTodo];
  return getAlignedScheduledTodos(updatedScheduledTodos);
}

export function addScheduledTodoAtEnd(
  newTodo: Todo,
  currentScheduledTodos: ScheduledTodo[]
): ScheduledTodo[] {
  const newScheduledTodo = {
    ...newTodo,
    start: new Date(getNextStartTime(currentScheduledTodos)),
  };

  return addScheduledTodo(newScheduledTodo, currentScheduledTodos);
}

function getNextStartTime(scheduledTodos: ScheduledTodo[]) {
  if (scheduledTodos.length === 0) {
    return new Date();
  }

  let latestAvailableStart = Date.now();

  for (const scheduledTodo of scheduledTodos) {
    const nextAvailableStart =
      scheduledTodo.start.valueOf() + scheduledTodo.estimate * MS_IN_MIN;
    if (nextAvailableStart > latestAvailableStart) {
      latestAvailableStart = nextAvailableStart;
    }
  }

  return new Date(latestAvailableStart);
}

export function removeScheduledTodo(
  index: number,
  currentScheduledTodos: ScheduledTodo[]
): ScheduledTodo[] {
  const updatedScheduledTodos = currentScheduledTodos.slice();
  updatedScheduledTodos.splice(index, 1);
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
  const v1 = t1.start.valueOf();
  const v2 = t2.start.valueOf();
  return v1 > v2 ? 1 : v1 === v2 ? 0 : -1;
}

export function calculateFinish(startTime: Date, estimate: number): Date {
  return new Date(startTime.valueOf() + estimate * MS_IN_MIN);
}
