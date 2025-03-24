import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null, // Holds user data or null
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
    },
});

// Export the action
export const { setUser } = userSlice.actions;

// Selector for useSelector
export const selectUser = (state) => state.user.user;

// Export the reducer
export default userSlice.reducer;
