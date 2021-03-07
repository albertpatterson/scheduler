import { configureStore } from '@reduxjs/toolkit';
import backlogReducer from './backlogSlice/backlogSlice';
import scheduleReducer from './scheduleSlice/scheduleSlice';

export const store = configureStore({
  reducer: {
    backlog: backlogReducer,
    schedule: scheduleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
