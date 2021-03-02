import { dispatchAsyncThunk } from './dispatch_async_thunk';
import { waitFor } from '@testing-library/react';
import { AsyncThunk } from '@reduxjs/toolkit';

describe('dispatchAsyncThunk', () => {
  it('dispatches the async thunk', async () => {
    const dispatch = jest.fn();
    const mockThunkOutput = jest.fn();

    type Data = { value: number };
    const data: Data = { value: 10 };

    const thunk = jest.fn().mockReturnValue(mockThunkOutput);

    dispatchAsyncThunk(
      dispatch,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (thunk as unknown) as AsyncThunk<any, any, Record<string, never>>,
      data
    );

    await waitFor(() => expect(thunk).toHaveBeenCalledWith(data));

    await waitFor(() => expect(dispatch).toHaveBeenCalledWith(mockThunkOutput));
  });
});
