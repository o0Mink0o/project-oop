import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import '../styles/WaitingPage.css';

const socket = io('ws://localhost:3000');

const WaitingPage = () => {
    const navigate = useNavigate();
    const [playerCount, setPlayerCount] = useState(0);

    useEffect(() => {
        console.log('Component Mounted');

        // ตรวจสอบค่าจาก sessionStorage
        const savedPlayerCount = sessionStorage.getItem('playerCount');
        if (savedPlayerCount) {
            setPlayerCount(parseInt(savedPlayerCount));
        }

        socket.on('playerCountUpdate', (count) => {
            console.log(`Player Count Updated: ${count}`);
            setPlayerCount(count);
            // เก็บค่าผู้เล่นใน sessionStorage
            sessionStorage.setItem('playerCount', count);
        });

        socket.emit('join');
        console.log('Join event emitted');

        // ลบค่าจาก sessionStorage เมื่อผู้เล่นออกจากแท็บหรือรีเฟรชหน้า
        const handleBeforeUnload = () => {
            sessionStorage.removeItem('playerCount');
            socket.emit('disconnect');
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            console.log('Component Unmounted');
            socket.off('playerCountUpdate');
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []); // effect ที่ทำงานครั้งเดียวเมื่อ component mount

    useEffect(() => {
        console.log(`Player Count Changed: ${playerCount}`);
        if (playerCount >= 2) {
            console.log('Navigating to /player-config/3');
            navigate('/player-config/3');
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
    }, [navigate]);

    return (
        <div className="waiting-page">
            <h1>Waiting for Players</h1>
            <p>Players Joined: {playerCount}/2</p>
        </div>
    );
};

export default WaitingPage;