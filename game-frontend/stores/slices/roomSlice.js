import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    room: {
        messages: [],  // Chat messages or game event messages
    },
};

const roomSlice = createSlice({
    name: "room",
    initialState,
    reducers: {
        setRoom(state, action) {
            state.room = action.payload;
        },
        addMessageToRoom(state, action) {
            state.room.messages.push(action.payload);
        },
    },
});

// Export actions
export const { setRoom, addMessageToRoom } = roomSlice.actions;

// Selector to access the room state
export const selectRoom = (state) => state.room.room;

// Export reducer
export default roomSlice.reducer;
