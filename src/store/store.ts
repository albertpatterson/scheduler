import {
  configureStore,
  ConfigureStoreOptions,
  isPlain,
} from '@reduxjs/toolkit';
import backlogReducer from './backlogSlice';
import scheduleReducer from './scheduleSlice/scheduleSlice';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isNonPlainSerializable = (value: any) => value instanceof Date;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isSerializable = (value: any) =>
  isPlain(value) || isNonPlainSerializable(value);

export const configuraStoreOptions: Omit<ConfigureStoreOptions, 'reducer'> = {
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: { isSerializable } }),
};

export const store = configureStore({
  reducer: {
    backlog: backlogReducer,
    schedule: scheduleReducer,
  },
  ...configuraStoreOptions,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
