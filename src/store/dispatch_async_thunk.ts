import { ThunkDispatch } from 'redux-thunk';
import { AsyncThunk } from '@reduxjs/toolkit';
import { Action } from 'redux';

export function dispatchAsyncThunk<D, R, S, E, A extends Action>(
  dispatch: ThunkDispatch<S, E, A>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  asyncThunk: AsyncThunk<R, D, any>,
  data: D
): Promise<any> {
  return dispatch(asyncThunk(data));
}
