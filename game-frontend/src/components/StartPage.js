import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/StartPage.css';

const StartPage = () => {
    const navigate = useNavigate();

    return (
        <div className="start-page">
            <div className="overlay"></div>

            {/* คอนเทนต์ตรงกลาง */}
            <div className="content">
                <h1 className="title">Welcome to the KOMBAT</h1>

                {/* ปุ่มต่างๆ */}
                <div className="button-group">
                    <button className="btn btn-start" onClick={() => navigate('/mode-selection')}>
                        Start Game
                    </button>
                    <button className="btn btn-home" onClick={() => navigate('/')}>
                        Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StartPage;
