import { configureStore } from '@reduxjs/toolkit';
import myTasks from './myTasks';
import userLogin from './userLogin';

const store = configureStore({
  reducer: {
    my_tasks: myTasks,
    user_login: userLogin
  },
});

export default store;
