import { createSlice } from '@reduxjs/toolkit';

export const userLogin = createSlice({
    name: 'userLogin',
    initialState: {
        userLogin: {}
    },
    reducers: {
        setUserLogin: (state, action) => {
            state.userLogin = action.payload;
        },
    },
});

export const { setUserLogin } = userLogin.actions;

export default userLogin.reducer;