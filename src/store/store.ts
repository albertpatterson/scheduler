import { configureStore } from '@reduxjs/toolkit';
import backlogReducer from './backlog_slice/backlog_slice';
import scheduleReducer from './schedule_slice/schedule_slice';

export const store = configureStore({
  reducer: {
    backlog: backlogReducer,
    schedule: scheduleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
