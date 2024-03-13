import { configureStore } from '@reduxjs/toolkit';
import myTasks from './myTasks';
const store = configureStore({
  reducer: {
    my_tasks: myTasks
  },
});

export default store;
