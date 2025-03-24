import { useDispatch , useSelector } from 'react-redux';
import { selectWebsocket, setWebSocketClient, setConnectionStatus} from '../stores/slices/websocketSlice';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

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
            client.unsubscribe(subscription.id);
            console.log(`Unsubscribed from ${subscription.id}`);
        } else {
            console.log("No active WebSocket connection to unsubscribe.");
        }
    };

    const sendMessage = (destination, message) => {
        if (client && isConnected) {
            console.log("send", JSON.stringify(message));
            client.send(`/app${destination}`, {}, JSON.stringify(message));
        } else {
            console.log("No active WebSocket connection to send message.");
        }
    };

    const connect = () => {
        try {
            const webSocket = new SockJS(`${serverUrl}/ws`);
            const stompClient = Stomp.over(webSocket);
            stompClient.connect({}, () => onConnected(stompClient));
            stompClient.debug = () => {}; // Disable debug logs
        } catch (e) {
            console.log(e);
        }
    };

    const disconnect = () => {
        if (client && isConnected) {
            client.disconnect(() => {
                dispatch(setWebSocketClient(null));
                dispatch(setConnectionStatus(false));
            });
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
