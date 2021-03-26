import React, { ReactElement } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { PartialStoreType } from 'store/schedule_slice/schedule_slice';
import { Provider } from 'react-redux';
import { ErrorSnackbar } from './error_snackbar';

const LOAD_ERROR = 'testing load error';
const INITIAL_STATE_LOAD_ERROR = {
  schedule: {
    dateNumber: 0,
    scheduledTodos: [],
    loadError: LOAD_ERROR,
  },
};

const SAVE_ERROR = 'testing save error';
const INITIAL_STATE_SAVE_ERROR = {
  schedule: {
    dateNumber: 0,
    scheduledTodos: [],
    saveError: SAVE_ERROR,
  },
};

const INITIAL_STATE_NO_ERROR = {
  schedule: {
    dateNumber: 0,
    scheduledTodos: [],
  },
};

const mockStore = configureStore();

async function waitForAlertWithText(text: string) {
  await waitFor(() =>
    expect(
      screen.queryByRole('alert', {
        name: (content, element) => {
          return element.innerHTML.indexOf(text) !== -1;
        },
      })
    ).not.toBe(null)
  );
}

describe('ErrorSnackbar', () => {
  let wrappedComponent: ReactElement;

  function renderForInitialState(
    initialState: PartialStoreType | (() => PartialStoreType)
  ) {
    const store = mockStore(initialState);

    wrappedComponent = (
      <Provider store={store}>
        <ErrorSnackbar />
      </Provider>
    );

    render(wrappedComponent);

    return store;
  }

  test('shows a loading error', async () => {
    renderForInitialState(INITIAL_STATE_LOAD_ERROR);

    await waitForAlertWithText(LOAD_ERROR);
  });

  test('shows a saving error', async () => {
    renderForInitialState(INITIAL_STATE_SAVE_ERROR);

    await waitForAlertWithText(SAVE_ERROR);
  });

  test('shows the latest error', async () => {
    let currentState: PartialStoreType = INITIAL_STATE_LOAD_ERROR;

    const initialState = () => {
      return currentState;
    };

    const store = renderForInitialState(initialState);

    await waitForAlertWithText(LOAD_ERROR);

    currentState = INITIAL_STATE_SAVE_ERROR;

    // dispatch to trigger a store update
    store.dispatch({ type: 'ANY_ACTION' });

    await waitForAlertWithText(SAVE_ERROR);
  });

  test('does not show the snackbar if there are no errors', async () => {
    let currentState: PartialStoreType = INITIAL_STATE_LOAD_ERROR;

    const initialState = () => {
      return currentState;
    };

    const store = renderForInitialState(initialState);

    await waitForAlertWithText(LOAD_ERROR);

    currentState = INITIAL_STATE_NO_ERROR;

    // dispatch to trigger a store update
    store.dispatch({ type: 'ANY_ACTION' });

    await waitFor(() => expect(screen.queryByRole('alert')).toBe(null));
  });
});
