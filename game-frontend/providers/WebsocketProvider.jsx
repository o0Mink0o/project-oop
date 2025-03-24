"use client";

import { useEffect } from "react";
import { useWebSocket } from "../hooks/useWebsocket";

const WebSocketProvider = ({ children }) => {
    const { connect } = useWebSocket();

    useEffect(() => {
        connect();
    }, []);

    return <>{children}</>;
};

export default WebSocketProvider;
