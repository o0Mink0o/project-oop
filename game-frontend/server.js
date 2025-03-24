const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

let playerCount = 0;
const MAX_PLAYERS = 2;

io.on('connection', (socket) => {
    if (playerCount >= MAX_PLAYERS) {
        socket.emit('roomFull'); // แจ้งให้ client ทราบว่าห้องเต็มแล้ว
        socket.disconnect();
        return;
    }

    playerCount++;
    console.log(`🔗 A user connected, current count: ${playerCount}`);

    io.emit('playerCountUpdate', playerCount);

    socket.on('disconnect', () => {
        playerCount--;
        console.log(` User disconnected, current count: ${playerCount}`);
        io.emit('playerCountUpdate', playerCount);
    });

    socket.on('join', () => {
        console.log(' A player joined');
        io.emit('playerCountUpdate', playerCount);
    });
});

server.listen(3000, () => {
    console.log('Listening on *:3000');
});
