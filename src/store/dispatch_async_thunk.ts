/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThunkDispatch } from 'redux-thunk';
import { AsyncThunk } from '@reduxjs/toolkit';
import { Action } from 'redux';

export function dispatchAsyncThunk<D, R, S, E, A extends Action>(
  dispatch: ThunkDispatch<S, E, A>,
  asyncThunk: AsyncThunk<R, D, any>,
  data: D
): Promise<any> {
  return dispatch(asyncThunk(data));
}
