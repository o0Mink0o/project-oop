import { useDispatch, useSelector } from 'react-redux';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { selectWebsocket, setWebSocketClient, setConnectionStatus } from '../stores/slices/webSocketSlice';
import { addMessageToRoom } from "../stores/slices/roomSlice";

export const useWebSocket = () => {
    const dispatch = useDispatch();
    const { client, isConnected } = useSelector(selectWebsocket);
    const serverUrl = process.env.REACT_APP_API_BASE_URL;

    const subscribe = (destination, callback) => {
        if (client && isConnected) {
            const subscription = client.subscribe(destination, callback);
            console.log(`Subscribed to ${destination}`);
            return subscription;
        } else {
            console.log("No active WebSocket connection to subscribe.");
        }
    };

    const unsubscribe = (subscription) => {
        if (client && isConnected && subscription) {
            subscription.unsubscribe();
            console.log(`Unsubscribed`);
        } else {
            console.log("No active WebSocket connection to unsubscribe.");
        }
    };

    const sendMessage = (destination, message) => {
        if (client && isConnected) {
            console.log("send", JSON.stringify(message));
            client.publish({ destination: `/app${destination}`, body: JSON.stringify(message) });
        } else {
            console.log("No active WebSocket connection to send message.");
        }
    };

    const connect = () => {
        try {
            const stompClient = new Client({
                webSocketFactory: () => new SockJS(`${serverUrl}/ws`),
                reconnectDelay: 5000,
                onConnect: () => onConnected(stompClient),
                onStompError: (frame) => {
                    console.error('STOMP Error:', frame);
                },
                debug: (str) => console.log('STOMP DEBUG:', str),
            });
            stompClient.activate();
        } catch (e) {
            console.log(e);
        }
    };

    const disconnect = () => {
        if (client && isConnected) {
            client.deactivate();
            dispatch(setWebSocketClient(null));
            dispatch(setConnectionStatus(false));
            console.log("WebSocket disconnected");
        } else {
            console.log("No active WebSocket connection to disconnect.");
        }
    };

    const onConnected = (stompClient) => {
        stompClient.subscribe(`/topic/messages`, onUpdateRoom);
        dispatch(setWebSocketClient(stompClient));
        dispatch(setConnectionStatus(true));
        console.log("WebSocket connected successfully");
    };

    const onUpdateRoom = (payload) => {
        const newMessageObject = JSON.parse(payload.body);
        dispatch(addMessageToRoom(newMessageObject));
        console.log("Received new message object", newMessageObject);
    };

    return {
        connect,
        disconnect,
        sendMessage,
        subscribe,
        unsubscribe,
    };
};
