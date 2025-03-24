import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    client: null,        // STOMP client instance
    isConnected: false,  // Connection status
};

const websocketSlice = createSlice({
    name: "websocket",
    initialState,
    reducers: {
        setWebSocketClient: (state, action) => {
            state.client = action.payload;
        },
        setConnectionStatus: (state, action) => {
            state.isConnected = action.payload;
        },
    },
});

// Export actions
export const { setWebSocketClient, setConnectionStatus } = websocketSlice.actions;

// Selector to access websocket state
export const selectWebsocket = (state) => state.websocket;

// Export reducer
export default websocketSlice.reducer;
