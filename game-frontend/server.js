const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "", // อนุญาตให้ทุก origin สามารถเชื่อมต่อ
        methods: ["GET", "POST"] // อนุญาตให้ใช้ HTTP GET และ POST
    }
});

let playerCount = 0;
const MAX_PLAYERS = 2;

io.on('connection', (socket) => {
    // ถ้าผู้เล่นมากกว่าหรือเท่ากับ MAX_PLAYERS ให้ปฏิเสธการเชื่อมต่อ
    if (playerCount >= MAX_PLAYERS) {
        socket.emit('roomFull'); // แจ้งให้ client ทราบว่าห้องเต็มแล้ว
        socket.disconnect();
        return;
    }

    playerCount++;
    console.log(`🔗 A user connected, current count: ${playerCount}`);

    // ส่งข้อมูลจำนวนผู้เล่นที่เชื่อมต่อไปยัง client ทุกตัว
    io.emit('playerCountUpdate', playerCount);

    // เมื่อมีการตัดการเชื่อมต่อของผู้เล่น
    socket.on('disconnect', () => {
        playerCount--;
        console.log(`User disconnected, current count: ${playerCount}`);
        io.emit('playerCountUpdate', playerCount);
    });

    // เมื่อผู้เล่นเข้ามาในห้อง
    socket.on('join', () => {
        console.log('A player joined');
        io.emit('playerCountUpdate', playerCount);
    });
});

// เลือกพอร์ตให้เซิร์ฟเวอร์ฟังอยู่
server.listen(3000, () => {
    console.log('Listening on:3000');
});
