import {
  configureStore,
  isPlain,
  createSerializableStateInvariantMiddleware,
} from '@reduxjs/toolkit';
import backlogReducer from './backlogSlice';
import scheduleReducer from './scheduleSlice/scheduleSlice';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isNonPlainSerializable = (value: any) => value instanceof Date;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isSerializable = (value: any) =>
  isPlain(value) || isNonPlainSerializable(value);

const serializableMiddleware = createSerializableStateInvariantMiddleware({
  isSerializable,
});

const store = configureStore({
  reducer: {
    backlog: backlogReducer,
    schedule: scheduleReducer,
  },
  middleware: [serializableMiddleware],
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
