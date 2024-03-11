import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import dayjs from 'dayjs';

// Tạo một async thunk
export const updateTask = createAsyncThunk(
    'my_tasks/updateTask',
    async (task, thunkAPI) => {
        thunkAPI.dispatch(toggleScreenLoading());
        const urlUpdateTask = `http://localhost:3001/events/${task._id}`;
        const response = await axios.put(urlUpdateTask, task);
        return response.data.data;
    }
);

export const addTask = createAsyncThunk(
    'my_tasks/addTask',
    async (task, thunkAPI) => {
        thunkAPI.dispatch(toggleScreenLoading());

        const { data } = await axios.post('http://localhost:3001/events', {
            ...task,
            participatingTeachers: task.participatingTeachers.map(({ value }) => value),
            participatingStudents: task.participatingStudents.map(({ value }) => value),
            startAt: dayjs(task.startAt).toDate(),
            endAt: dayjs(task.endAt).toDate(),
        });
        return data.data;
    }
);


export const myTasks = createSlice({
    name: 'my_tasks',
    initialState: {
        tasks: [],
        isOpenModalEditTask: false,
        taskSelected: {
            name: ''
        },
        isLoading: false,
        action: 'add'
    },
    reducers: {
        setTasks: (state, action) => {
            state.tasks = action.payload;
        },
        openModalEditTask: (state, { payload }) => {
            const { action, taskSelected } = payload;
            state.isOpenModalEditTask = true;
            if (action === 'add') {
                state.taskSelected = {
                    name: '',
                    participatingTeachers: [],
                    participatingStudents: [],
                    host: {},
                    trainingPoints: 0,
                    status: 'undone',
                };
            } else {
                state.taskSelected = taskSelected;
            }
            state.action = action;
        },
        closeModalEditTask: state => {
            state.isOpenModalEditTask = false;
            state.taskSelected = {};
        },
        editTask: (state, action) => {
            state.taskSelected[action.payload.fieldName] = action.payload.newValue;
        },
        toggleScreenLoading: (state) => {
            state.isLoading = !state.isLoading;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateTask.fulfilled, (state, action) => {
                state.tasks = state.tasks.map(task => {
                    if (task._id === action.payload._id) {
                        return action.payload;
                    } else {
                        return task;
                    }
                })
                state.taskSelected = {};
                state.isLoading = !state.isLoading;
                state.isOpenModalEditTask = false;
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state.tasks.push(action.payload);
                state.taskSelected = {};
                state.isLoading = !state.isLoading;
                state.isOpenModalEditTask = false;
            })
    },
});

export const { setTasks, openModalEditTask, closeModalEditTask, editTask, toggleScreenLoading } = myTasks.actions;

export default myTasks.reducer;