const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",  // ✅ อนุญาตให้ client ทุกที่เชื่อมต่อ
        methods: ["GET", "POST"]
    }
});

let playerCount = 0;

io.on('connection', (socket) => {
    playerCount++;
    console.log(`A user connected, current count: ${playerCount}`);

    // ส่งค่า playerCount ไปให้ทุก client
    io.emit('playerCountUpdate', playerCount);

    socket.on('disconnect', () => {
        playerCount--;
        console.log(`User disconnected, current count: ${playerCount}`);
        io.emit('playerCountUpdate', playerCount);
    });

    socket.on('join', () => {
        console.log('A player joined');
        io.emit('playerCountUpdate', playerCount);
    });
});

server.listen(3000, () => {
    console.log('Listening on *:3000');
});
