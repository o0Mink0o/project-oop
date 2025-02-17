import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ModeSelectionPage.css';
import BackButton from './BackButton';
import botVsBotImg from '../assets/image/bvb.png';
import botVsPlayerImg from '../assets/image/bvp.png';
import playerVsPlayerImg from '../assets/image/pvp.png';

const ModeSelectionPage = () => {
    const navigate = useNavigate();

    return (
        <div className="mode-selection-page">
            {/* หัวข้อใหญ่ "Game Mode" */}
            <div className="game-mode-title">
                Game Mode
            </div>

            <div className="content">
                <div className="mode-options">
                    <div className="mode-option" onClick={() => navigate('/player-config/1')}>
                        <img src={botVsBotImg} alt="Bot vs Bot" className="mode-image" />
                        <button className="btn btn-bot-vs-bot">Bot vs Bot</button>
                    </div>
                    <div className="mode-option" onClick={() => navigate('/player-config/2')}>
                        <img src={botVsPlayerImg} alt="Bot vs Player" className="mode-image" />
                        <button className="btn btn-bot-vs-player">Bot vs Player</button>
                    </div>
                    <div className="mode-option" onClick={() => navigate('/player-config/3')}>
                        <img src={playerVsPlayerImg} alt="Player vs Player" className="mode-image" />
                        <button className="btn btn-player-vs-player">Player vs Player</button>
                    </div>
                </div>
                <div className="buttons">
                    <button className="btn btn-home" onClick={() => navigate('/')}>
                        Home
                    </button>
                    <BackButton />
                </div>
            </div>
        </div>
    );
};

export default ModeSelectionPage;
