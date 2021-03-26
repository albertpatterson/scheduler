import React, { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import ReactDOM from 'react-dom';
import { createMemoryHistory, MemoryHistory } from 'history';
import { Router } from 'react-router-dom';

const mockBacklogText = 'testing: mock backlog';
jest.mock('./backlog/backlog', () => () => mockBacklogText);

const mockDailyScheduleText = 'testing: mock daily schedule';
jest.mock('./daily_schedule/daily_schedule', () => () => mockDailyScheduleText);

const mockErrorSnackbarText = 'testing: mock error snackbar';
jest.mock('./error_snackbar/error_snackbar', () => () => mockErrorSnackbarText);

describe('App', () => {
  let history: MemoryHistory;

  let wrappedApp: ReactElement;

  beforeEach(() => {
    history = createMemoryHistory();
    wrappedApp = (
      <Router history={history}>
        <App />
      </Router>
    );
  });

  test('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(wrappedApp, div);
  });

  test('shows today by default', () => {
    history.push('/');
    render(wrappedApp);
    const mockDailySchedule = screen.getByText(
      new RegExp(mockDailyScheduleText)
    );
    expect(mockDailySchedule).toBeInTheDocument();

    const mockBacklog = screen.queryByText(new RegExp(mockBacklogText));
    expect(mockBacklog).toBe(null);
  });

  test('shows daily_schedule for /daily_schedule', () => {
    history.push('/daily_schedule');
    render(wrappedApp);
    const mockDailySchedule = screen.getByText(
      new RegExp(mockDailyScheduleText)
    );
    expect(mockDailySchedule).toBeInTheDocument();

    const mockBacklog = screen.queryByText(new RegExp(mockBacklogText));
    expect(mockBacklog).toBe(null);
  });

  test('shows backlog for /backlog', () => {
    history.push('/backlog');
    render(wrappedApp);
    const mockDailySchedule = screen.queryByText(
      new RegExp(mockDailyScheduleText)
    );
    expect(mockDailySchedule).toBe(null);

    const mockBacklog = screen.getByText(new RegExp(mockBacklogText));
    expect(mockBacklog).toBeInTheDocument();
  });
});
