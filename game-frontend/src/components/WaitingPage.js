import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import '../styles/WaitingPage.css';

const socket = io('ws://localhost:3000'); //  ตรวจสอบให้แน่ใจว่าใช้พอร์ต 3000

const WaitingPage = () => {
    const navigate = useNavigate();
    const [playerCount, setPlayerCount] = useState(0);

    useEffect(() => {
        console.log(' Component Mounted');

        socket.on('playerCountUpdate', (count) => {
            console.log(`Player Count Updated: ${count}`);
            setPlayerCount(count);
        });

        socket.emit('join');
        console.log(' Join event emitted');

        return () => {
            console.log(' Component Unmounted');
            socket.off('playerCountUpdate');
        };
    }, []);


    useEffect(() => {
        console.log(` Player Count Changed: ${playerCount}`);
        if (playerCount >= 2) {
            console.log(' Navigating to /start');
            navigate('/mode');
        }
    }, [playerCount, navigate]);
    useEffect(() => {
        socket.on('roomFull', () => {
            alert('ห้องเต็มแล้ว! โปรดลองใหม่ภายหลัง');
            navigate('/'); // ส่งกลับไปหน้าเริ่มต้น
        });

        return () => {
            socket.off('roomFull');
        };
    }, [navigate]); //  เพิ่ม navigate ใน dependency array


    return (
        <div className="waiting-page">
            <h1>Waiting for Players</h1>
            <p>Players Joined: {playerCount}/2</p>
        </div>
    );
};


export default WaitingPage;
