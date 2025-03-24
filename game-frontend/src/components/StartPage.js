
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/StartPage.css';

const StartPage = () => {
    const navigate = useNavigate();
    const [animateIn, setAnimateIn] = useState(false);

    useEffect(() => {
        // Trigger entrance animation after component mounts
        setTimeout(() => {
            setAnimateIn(true);
        }, 100);
    }, []);

    return (
        <div className="start-page">
            <div className="overlay"></div>

            {/* คอนเทนต์ตรงกลาง */}
            <div className={`content ${animateIn ? 'animate-in' : ''}`}>
                <h1 className="title">Welcome to the KOMBAT</h1>

                {/* ปุ่มต่างๆ */}
                <div className="button-group">
                    <button
                        className="btn btn-start"
                        onClick={() => navigate('/waiting')} // 🔹 เปลี่ยนไปที่ "/waiting"
                    >
                        Start Game
                        <span className="btn-effect"></span>
                    </button>

                </div>
            </div>
        </div>
    );
};

export default StartPage;