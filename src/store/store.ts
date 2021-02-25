import { configureStore } from '@reduxjs/toolkit';
import backlogReducer from './backlogSlice';
import scheduleReducer from './scheduleSlice';

const store = configureStore({
  reducer: {
    backlog: backlogReducer,
    schedule: scheduleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
