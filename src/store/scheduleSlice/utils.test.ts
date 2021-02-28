import { ScheduledTodo, Todo } from '../../types';
import {
  addScheduledTodo,
  addTodoAtEnd,
  removeScheduledTodo,
  updateScheduledTodo,
  calculateFinish,
} from './utils';

const FIRST_START = new Date('1/1/2020');
const FIRST_ESTIMATE = 30;
const SECOND_START = calculateFinish(FIRST_START, FIRST_ESTIMATE);
const SECOND_ESTIMATE = 45;
const THIRD_START = calculateFinish(SECOND_START, SECOND_ESTIMATE);
const THIRD_ESTIMATE = 15;

const TEST_SCHEDULED_TODOS: ScheduledTodo[] = [
  {
    title: 'test scheduled todo 0 title',
    description: 'test scheduled todo 0 description',
    priority: 0,
    estimate: FIRST_ESTIMATE,
    start: FIRST_START,
  },
  {
    title: 'test scheduled todo 1 title',
    description: 'test scheduled todo 1 description',
    priority: 1,
    estimate: SECOND_ESTIMATE,
    start: SECOND_START,
  },
  {
    title: 'test scheduled todo 2 title',
    description: 'test scheduled todo 2 description',
    priority: 2,
    estimate: THIRD_ESTIMATE,
    start: THIRD_START,
  },
];

const TEST_SCHEDULED_TODO: ScheduledTodo = {
  title: 'test scheduled todo title',
  description: 'test scheduled todo description',
  priority: 100,
  estimate: 750,
  start: FIRST_START,
};

const TEST_TODO: Todo = {
  title: 'test todo title',
  description: 'test todo description',
  priority: 10,
  estimate: 60,
};

function verifyScheduledTodoOrderAndContent(
  expectedTodos: Todo[],
  expectedStartTimes: Date[],
  actualScheduledTodos: ScheduledTodo[]
) {
  expect(expectedTodos.length).toBe(expectedStartTimes.length);
  expect(actualScheduledTodos.length).toBe(expectedStartTimes.length);

  for (let index = 0; index < expectedTodos.length; index++) {
    const expectedTodo = expectedTodos[index];
    const expectedStartTime = expectedStartTimes[index];
    const actualScheduledTodo = actualScheduledTodos[index];

    expect(actualScheduledTodo.title).toBe(expectedTodo.title);
    expect(actualScheduledTodo.description).toBe(expectedTodo.description);
    expect(actualScheduledTodo.priority).toBe(expectedTodo.priority);
    expect(actualScheduledTodo.estimate).toBe(expectedTodo.estimate);
    expect(actualScheduledTodo.start).toEqual(expectedStartTime);
  }
}

describe('addScheduledTodo', () => {
  test('adds a scheduled todo and realigns', () => {
    const updatedScheduledTodos = addScheduledTodo(
      TEST_SCHEDULED_TODO,
      TEST_SCHEDULED_TODOS
    );

    const expectedTodoOrder = [
      TEST_SCHEDULED_TODOS[0],
      TEST_SCHEDULED_TODO,
      ...TEST_SCHEDULED_TODOS.slice(1),
    ];

    const expectedStartTimes = [
      FIRST_START,
      calculateFinish(FIRST_START, TEST_SCHEDULED_TODOS[0].estimate),
      calculateFinish(
        FIRST_START,
        TEST_SCHEDULED_TODOS[0].estimate + TEST_SCHEDULED_TODO.estimate
      ),
      calculateFinish(
        FIRST_START,
        TEST_SCHEDULED_TODOS[0].estimate +
          TEST_SCHEDULED_TODO.estimate +
          TEST_SCHEDULED_TODOS[1].estimate
      ),
    ];

    verifyScheduledTodoOrderAndContent(
      expectedTodoOrder,
      expectedStartTimes,
      updatedScheduledTodos
    );
  });
});

describe('addTodoAtEnd', () => {
  test('adds a todo at the end', () => {
    const updatedScheduledTodos = addTodoAtEnd(TEST_TODO, TEST_SCHEDULED_TODOS);

    const expectedTodoOrder = [...TEST_SCHEDULED_TODOS, TEST_TODO];

    const expectedStartTimes = [
      ...TEST_SCHEDULED_TODOS.map((scheduledTodo) => scheduledTodo.start),
      calculateFinish(THIRD_START, TEST_SCHEDULED_TODOS[2].estimate),
    ];

    verifyScheduledTodoOrderAndContent(
      expectedTodoOrder,
      expectedStartTimes,
      updatedScheduledTodos
    );
  });
});

describe('removeScheduledTodo', () => {
  test('removes a todo and realigns', () => {
    const removedIndex = 1;
    const updatedScheduledTodos = removeScheduledTodo(
      removedIndex,
      TEST_SCHEDULED_TODOS
    );

    const expectedTodoOrder = TEST_SCHEDULED_TODOS.slice();
    expectedTodoOrder.splice(removedIndex, 1);

    const expectedStartTimes = [
      FIRST_START,
      calculateFinish(FIRST_START, TEST_SCHEDULED_TODOS[0].estimate),
    ];

    verifyScheduledTodoOrderAndContent(
      expectedTodoOrder,
      expectedStartTimes,
      updatedScheduledTodos
    );
  });
});

describe('updateScheduledTodo', () => {
  test('updates a todo and realigns', () => {
    const updateIndex = 1;
    const updatedScheduledTodos = updateScheduledTodo(
      TEST_SCHEDULED_TODO,
      updateIndex,
      TEST_SCHEDULED_TODOS
    );

    const expectedTodoOrder = [
      TEST_SCHEDULED_TODOS[0],
      TEST_SCHEDULED_TODO,
      TEST_SCHEDULED_TODOS[2],
    ];

    const expectedStartTimes = [
      FIRST_START,
      calculateFinish(FIRST_START, TEST_SCHEDULED_TODOS[0].estimate),
      calculateFinish(
        FIRST_START,
        TEST_SCHEDULED_TODOS[0].estimate + TEST_SCHEDULED_TODO.estimate
      ),
    ];

    verifyScheduledTodoOrderAndContent(
      expectedTodoOrder,
      expectedStartTimes,
      updatedScheduledTodos
    );
  });
});
