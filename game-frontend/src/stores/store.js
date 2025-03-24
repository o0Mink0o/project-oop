import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import webSocketReducer from "./slices/webSocketSlice";
import roomReducer from "./slices/roomSlice";

const store = configureStore({
    reducer: {
        user: userReducer,
        room: roomReducer,
        websocket: webSocketReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Allow WebSocket clients or other non-serializable data
        }),
});

export default store;
