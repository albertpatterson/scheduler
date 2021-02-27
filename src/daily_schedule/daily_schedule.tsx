import React, { FunctionComponent, ReactElement, useState } from 'react';
import { ScheduledTodo, Todo } from '../types';
import { TodoCard } from '../todo_card/todo_card';
import './daily_schedule.css';
import Typography from '@material-ui/core/Typography';
import { useSelector, useDispatch } from 'react-redux';
import { SELECTORS } from '../store/selectors';
import {
  addScheduledTodo,
  addScheduledTodoAtEnd,
  removeScheduledTodo,
  updateScheduledTodo,
} from '../store/scheduleSlice/scheduleSlice';
import { addBacklogTodo } from '../store/backlogSlice';
import { TodoEditor, EditMode, EditorView } from '../todo_editor/todo_editor';
import Button from '@material-ui/core/Button';

const mockScheduledTotos: ScheduledTodo[] = [
  {
    start: new Date(Date.now()),
    title: 'task 1',
    description: 'the first task',
    estimate: 30,
    priority: 0,
  },
  {
    start: new Date(Date.now() + 30 * 60 * 1e3),
    title: 'task 2',
    description: 'the second task',
    estimate: 60,
    priority: 1,
  },
  {
    start: new Date(Date.now() + (30 + 60) * 60 * 1e3),
    title: 'task 3',
    description: 'the third task',
    estimate: 90,
    priority: 2,
  },
];
export interface DailyScheduleProps {
  date?: Date;
}

let added = false;

export const DailySchedule: FunctionComponent<DailyScheduleProps> = (
  props: DailyScheduleProps
) => {
  const scheduledTodos = useSelector(SELECTORS.schedule.scheduledTodos);

  const dispatch = useDispatch();

  setTimeout(() => {
    if (!added) {
      added = true;

      for (const scheduledTodo of mockScheduledTotos) {
        dispatch(addScheduledTodo(scheduledTodo));
      }
    }
  });

  const [showTodoEditor, setShowTodoEditor] = useState(false);

  function openTodoEditor() {
    setShowTodoEditor(true);
  }

  function closeTodoEditor() {
    setShowTodoEditor(false);
  }

  const smallScreen = true;

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
    dispatch(removeScheduledTodo(index));
  };

  const moveToBacklog = (index: number) => {
    removeTodo(index);
    dispatch(addBacklogTodo(scheduledTodos[index]));
  };

  function handleEditTodoSubmit(todo: Todo) {
    closeTodoEditor();
    if (editingTodoIndex === null) {
      dispatch(addScheduledTodoAtEnd(todo));
    } else {
      const currentScheduledTodo = scheduledTodos[editingTodoIndex];
      const updatedScheduledTodo = { ...currentScheduledTodo, ...todo };
      dispatch(
        updateScheduledTodo({
          newScheduledTodo: updatedScheduledTodo,
          index: editingTodoIndex,
        })
      );
    }
  }

  return (
    <>
      <Typography variant="h2" align="center" paragraph>
        {parseDate(props.date)}
      </Typography>
      <ul className="scheduled-todo-list">
        {scheduledTodos.map((scheduledTodo, index) =>
          createScheduledTodoView(
            scheduledTodo,
            () => editTodo(index),
            () => moveToBacklog(index),
            () => removeTodo(index)
          )
        )}
      </ul>
      <div className="controls-row-schedule">
        <Button color="primary" onClick={createTodo}>
          New Task
        </Button>
      </div>
      {showTodoEditor && (
        <TodoEditor
          handleSubmit={handleEditTodoSubmit}
          handleCancel={closeTodoEditor}
          mode={EditMode.CREATE}
          initialTodo={
            editingTodoIndex === null
              ? undefined
              : scheduledTodos[editingTodoIndex]
          }
          view={EditorView.DIALOG}
          fullscreen={smallScreen}
        ></TodoEditor>
      )}
    </>
  );
};

function createScheduledTodoView(
  scheduledTodo: ScheduledTodo,
  editTodo: () => void,
  moveToBacklog: () => void,
  remove: () => void
): ReactElement {
  const key = scheduledTodo.title + scheduledTodo.description;
  const actions = [
    {
      name: 'Mark Complete',
      execute: () => {
        console.log(scheduledTodo.title + ' complete!');
      },
    },
    {
      name: 'Edit',
      execute: editTodo,
    },
    {
      name: 'Move to Backlog',
      execute: moveToBacklog,
    },
    {
      name: 'Remove',
      execute: remove,
    },
  ];
  return (
    <div key={key} className="scheduled-todo-view">
      <div className="scheduled-todo-start">
        {parseStartTime(scheduledTodo.start)}
      </div>
      <div className="scheduled-todo-card">
        <TodoCard todo={scheduledTodo} actions={actions}></TodoCard>
      </div>
    </div>
  );
}

function parseStartTime(start: Date) {
  const rawHours = start.getHours();
  const hours = rawHours > 12 ? rawHours - 12 : rawHours;
  const ampm = rawHours > 11 ? 'pm' : 'am';
  const paddedMins = `0${start.getMinutes()}`.slice(-2);

  return `${hours}:${paddedMins} ${ampm}`;
}

function parseDate(date?: Date) {
  const todayLabel = 'Today';

  if (!date) {
    return todayLabel;
  }

  const today = new Date();
  const dateYear = date.getFullYear();
  const dateMonth = date.getMonth();
  const dateDay = date.getDate();
  const isDateToday =
    dateYear === today.getFullYear() &&
    dateMonth === today.getMonth() &&
    dateDay === today.getDate();

  return isDateToday ? todayLabel : `${dateMonth + 1}/${dateDay}/${dateYear}`;
}

export default DailySchedule;
