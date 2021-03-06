import React, {
  FunctionComponent,
  ReactElement,
  useState,
  useEffect,
} from 'react';
import { ScheduledTodo, Todo } from '../types';
import { TodoCard } from '../todo_card/todo_card';
import './daily_schedule.css';
import Typography from '@material-ui/core/Typography';
import { useSelector, useDispatch } from 'react-redux';
import { SELECTORS } from '../store/selectors';
import {
  addTodoAtEnd,
  removeScheduledTodo,
  updateScheduledTodo,
  loadScheduledTodos,
} from '../store/scheduleSlice/scheduleSlice';
import { dispatchAsyncThunk } from '../store/dispatch_async_thunk';
import { addBacklogTodo } from '../store/backlogSlice/backlogSlice';
import { TodoEditor, EditMode, EditorView } from '../todo_editor/todo_editor';
import Button from '@material-ui/core/Button';
import { getTodayDateNumber, getDayNumber, getDate } from '../utils/utils';

export interface DailyScheduleProps {
  dateNumber?: number;
}

export const DailySchedule: FunctionComponent<DailyScheduleProps> = (
  props: DailyScheduleProps
) => {
  const newDate = new Date();
  const dayNumber = getDayNumber(newDate);
  const reformedDate = getDate(dayNumber);
  console.log('dates', { newDate, dayNumber, reformedDate });

  const todoDateNumber = props.dateNumber || getTodayDateNumber();

  const scheduledTodos = useSelector(SELECTORS.schedule.scheduledTodos);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatchAsyncThunk(dispatch, loadScheduledTodos, todoDateNumber);
  }, [todoDateNumber]);

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
    dispatchAsyncThunk(dispatch, removeScheduledTodo, { index });
  };

  const moveToBacklog = (index: number) => {
    removeTodo(index);
    dispatchAsyncThunk(dispatch, addBacklogTodo, {
      newTodo: scheduledTodos[index],
    });
  };

  function handleEditTodoSubmit(todo: Todo) {
    closeTodoEditor();
    if (editingTodoIndex === null) {
      dispatchAsyncThunk(dispatch, addTodoAtEnd, { todo });
    } else {
      const currentScheduledTodo = scheduledTodos[editingTodoIndex];
      const updatedScheduledTodo = { ...currentScheduledTodo, ...todo };
      dispatchAsyncThunk(dispatch, updateScheduledTodo, {
        updatedScheduledTodo,
        index: editingTodoIndex,
      });
    }
  }

  return (
    <>
      <Typography variant="h2" align="center" paragraph>
        {parseDate(todoDateNumber)}
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

function parseDate(dateNumber: number) {
  const todayLabel = 'Today';

  if (dateNumber === getTodayDateNumber()) {
    return todayLabel;
  }

  const date = getDate(dateNumber);
  const dateYear = date.getFullYear();
  const dateMonth = date.getMonth();
  const dateDay = date.getDate();

  return `${dateMonth + 1}/${dateDay}/${dateYear}`;
}

export default DailySchedule;
