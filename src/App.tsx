import React, { ReactElement } from 'react';
import './App.css';
import { Switch, Route } from 'react-router-dom';
import { Header } from './header/header';
import DailySchedule from './daily_schedule/daily_schedule';
import Backlog from './backlog/backlog';
import 'fontsource-roboto';
import Container from '@material-ui/core/Container';

function App(): ReactElement {
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
      </Container>
    </>
  );
}

export default App;
