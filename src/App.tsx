import React, { ReactElement, useState, useEffect } from 'react';
import './App.css';
import { Switch, Route } from 'react-router-dom';
import { Header } from './header/header';
import DailySchedule from './daily_schedule/daily_schedule';
import Backlog from './backlog/backlog';
import 'fontsource-roboto';
import Container from '@material-ui/core/Container';
import ErrorSnackbar from 'error_snackbar/error_snackbar';
import { getTodayDayNumber } from 'utils/utils';
import { dispatchAsyncThunk } from 'store/dispatch_async_thunk';
import { useDispatch } from 'react-redux';
import { loadScheduledTodos } from 'store/schedule_slice/load_scheduled_todos/load_scheduled_todos';
import { loadLeftoverTodos } from 'store/schedule_slice/load_leftover_todos/load_leftover_todos';

function App(): ReactElement {
  const [todayDateNumber, setTodayDateNumber] = useState(getTodayDayNumber());

  const dispatch = useDispatch();

  useEffect(() => {
    dispatchAsyncThunk(dispatch, loadScheduledTodos, todayDateNumber);
    dispatchAsyncThunk(dispatch, loadLeftoverTodos, undefined);
  }, [todayDateNumber]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTodayDateNumber(getTodayDayNumber());
    }, 60 * 1e3);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Header></Header>
      <Container>
        <Switch>
          <Route path="/daily_schedule">
            <DailySchedule></DailySchedule>
          </Route>
          <Route path="/backlog">
            <Backlog></Backlog>
          </Route>
          <Route path="/">
            <DailySchedule></DailySchedule>
          </Route>
        </Switch>
        <ErrorSnackbar />
      </Container>
    </>
  );
}

export default App;
