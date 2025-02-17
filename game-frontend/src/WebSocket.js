const client = new WebSocket('ws://localhost:8080');

client.onopen = () => {
    console.log('✅ WebSocket Connected');
};

client.onerror = (error) => {
    console.error('❌ WebSocket Error:', error);
};

client.onclose = () => {
    console.warn('⚠️ WebSocket Disconnected');
};

client.onmessage = (message) => {
    console.log('📩 Message:', message.data);
};
