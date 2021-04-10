import React, { FunctionComponent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SELECTORS } from 'store/selectors';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { addTodoAtEnd } from 'store/schedule_slice/update_scheduled_todos/update_scheduled_todos';
import { markLeftoverHandled } from 'store/schedule_slice/mark_leftover_handled/mark_leftover_handled';
import { addBacklogTodo } from 'store/backlog_slice/backlog_slice';
import { dispatchAsyncThunk } from '../store/dispatch_async_thunk';

export const LeftoverTodosDialog: FunctionComponent = () => {
  const dispatch = useDispatch();

  const leftoverTodos = useSelector(SELECTORS.schedule.leftoverTodos);

  const open = leftoverTodos.length !== 0;

  const scheduleToday = async () => {
    for (const leftoverTodo of leftoverTodos) {
      await dispatchAsyncThunk(dispatch, addTodoAtEnd, {
        todo: leftoverTodo,
      });
    }

    await dispatch(markLeftoverHandled());
  };

  const moveToBacklog = async () => {
    for (const leftoverTodo of leftoverTodos) {
      await dispatchAsyncThunk(dispatch, addBacklogTodo, {
        newTodo: leftoverTodo,
      });
    }

    await dispatch(markLeftoverHandled());
  };

  return (
    <Dialog
      open={open}
      aria-labelledby="Leftover Todos"
      aria-describedby="alert indicating that there are leftover todos"
    >
      <DialogTitle id="leftover-todos-dialog-title">Leftover Todos</DialogTitle>
      <DialogContent>
        <DialogContentText id="leftover-todos-dialog-description">
          There are todos leftover from the previous schedule.
        </DialogContentText>

        <DialogActions>
          <Button onClick={scheduleToday} color="primary">
            Schedule Today
          </Button>
          <Button onClick={moveToBacklog} color="primary" autoFocus>
            Move to backlog
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
