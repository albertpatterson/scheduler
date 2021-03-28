import React, { ReactElement } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import ReactDOM from 'react-dom';
import { createMemoryHistory, MemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import * as dispatchAsyncThunk from 'store/dispatch_async_thunk';
import * as reactRedux from 'react-redux';
import { Dispatch, Action } from 'redux';
import { loadScheduledTodos } from 'store/schedule_slice/load_scheduled_todos/load_scheduled_todos';
import * as utils from 'utils/utils';
import { loadLeftoverTodos } from 'store/schedule_slice/load_leftover_todos/load_leftover_todos';

const mockStore = configureStore();

const mockBacklogText = 'testing: mock backlog';
jest.mock('./backlog/backlog', () => () => mockBacklogText);

const mockDailyScheduleText = 'testing: mock daily schedule';
jest.mock('./daily_schedule/daily_schedule', () => () => mockDailyScheduleText);

const mockErrorSnackbarText = 'testing: mock error snackbar';
jest.mock('./error_snackbar/error_snackbar', () => () => mockErrorSnackbarText);

const MOCK_TODAY_DATE_NUMBER = 12345;

describe('App', () => {
  let history: MemoryHistory;
  let wrappedApp: ReactElement;
  let dispatchAsyncThunkSpy: jest.SpiedFunction<
    typeof dispatchAsyncThunk.dispatchAsyncThunk
  >;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let dispatchSpy: Dispatch<Action<any>>;

  beforeEach(() => {
    history = createMemoryHistory();

    const store = mockStore({});

    wrappedApp = (
      <Provider store={store}>
        <Router history={history}>
          <App />
        </Router>
      </Provider>
    );

    dispatchAsyncThunkSpy = jest.spyOn(
      dispatchAsyncThunk,
      'dispatchAsyncThunk'
    );
    dispatchSpy = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(dispatchSpy);

    jest
      .spyOn(utils, 'getTodayDayNumber')
      .mockReturnValue(MOCK_TODAY_DATE_NUMBER);
  });

  test('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(wrappedApp, div);
  });

  test('loads scheduled and leftover todos', async () => {
    render(wrappedApp);

    await waitFor(() =>
      expect(dispatchAsyncThunkSpy).toHaveBeenCalledWith(
        dispatchSpy,
        loadScheduledTodos,
        MOCK_TODAY_DATE_NUMBER
      )
    );

    await waitFor(() =>
      expect(dispatchAsyncThunkSpy).toHaveBeenCalledWith(
        dispatchSpy,
        loadLeftoverTodos,
        undefined
      )
    );
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
