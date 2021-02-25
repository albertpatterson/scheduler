import React, { FunctionComponent, ReactElement } from 'react';
import { ScheduledTodo } from '../types';
import { TodoCard } from '../todo_card/todo_card';
import './daily_schedule.css';
import Typography from '@material-ui/core/Typography';
import { useSelector } from 'react-redux';
import { SELECTORS } from '../store/selectors';

export interface DailyScheduleProps {
  date?: Date;
}

export const DailySchedule: FunctionComponent<DailyScheduleProps> = (
  props: DailyScheduleProps
) => {
  const scheduledTodos = useSelector(SELECTORS.schedule.scheduledTodos);

  return (
    <>
      <Typography variant="h2" align="center" paragraph>
        {parseDate(props.date)}
      </Typography>
      <ul className="scheduled-todo-list">
        {scheduledTodos.map(createScheduledTodoView)}
      </ul>
    </>
  );
};

function createScheduledTodoView(scheduledTodo: ScheduledTodo): ReactElement {
  const key = scheduledTodo.title + scheduledTodo.description;
  const actions = [
    {
      name: 'Mark Complete',
      execute: () => {
        console.log(scheduledTodo.title + ' complete!');
      },
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
