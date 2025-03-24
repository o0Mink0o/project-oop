import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ModeSelectionPage.css';
    import BackButton from './BackButton';
import botVsBotImg from '../assets/image/bvb.png';
import botVsPlayerImg from '../assets/image/bvp.png';
import playerVsPlayerImg from '../assets/image/pvp.png';

const ModeSelectionPage = () => {
    const navigate = useNavigate();
    const [animateIn, setAnimateIn] = useState(false);

    useEffect(() => {
        // Trigger entrance animation after component mounts
        setTimeout(() => {
            setAnimateIn(true);
        }, 100);
    }, []);

    return (
        <div className="mode-selection-page">
            <div className="overlay"></div>

            <div className={`mode-content ${animateIn ? 'animate-in' : ''}`}>
                {/* หัวข้อใหญ่ "Game Mode" */}
                <div className="game-mode-title">
                    Game Mode
                </div>

                <div className="mode-options-container">
                    <div className="mode-options">
                        <div className="mode-option" onClick={() => navigate('/player-config/1')}>
                            <div className="mode-image-container">
                                <img src={botVsBotImg} alt="Bot vs Bot" className="mode-image" />
                            </div>
                            <button className="btn btn-mode btn-bot-vs-bot">
                                Auto
                                <span className="btn-effect"></span>
                            </button>
                        </div>

                        <div className="mode-option" onClick={() => navigate('/player-config/2')}>
                            <div className="mode-image-container">
                                <img src={botVsPlayerImg} alt="Bot vs Player" className="mode-image" />
                            </div>
                            <button className="btn btn-mode btn-bot-vs-player">
                                1 Player
                                <span className="btn-effect"></span>
                            </button>
                        </div>

                        <div className="mode-option" onClick={() => navigate('/player-config/3')}>
                            <div className="mode-image-container">
                                <img src={playerVsPlayerImg} alt="Player vs Player" className="mode-image" />
                            </div>
                            <button className="btn btn-mode btn-player-vs-player">
                                PvP
                                <span className="btn-effect"></span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="navigation-buttons">
                    <button className="btn btn-home" onClick={() => navigate('/')}>
                        Home
                        <span className="btn-effect"></span>
                    </button>
                    <BackButton className="back-button" />
                </div>
            </div>
        </div>
    );
};

export default ModeSelectionPage;
