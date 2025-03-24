import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import StartPage from './components/StartPage';
import ModeSelectionPage from './components/ModeSelectionPage';
import PlayerConfigPage from './components/PlayerConfigPage';
import GameBoardPage from './components/GameBoardPage';
import WaitingPage from './components/WaitingPage';

const App = () => {
    const [playersConfig, setPlayersConfig] = useState([]);
    const navigate = useNavigate();

    const handleSubmitConfig = (minions) => {
        setPlayersConfig([...playersConfig, minions]);
        if (playersConfig.length === 1) {
            navigate('/game-board');
        }
    };

    return (
        <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/Waiting" element={<WaitingPage />} />
            <Route path="/mode" element={<ModeSelectionPage />} />
            <Route
                path="/player-config/:playerNumber"
                element={<PlayerConfigPage onSubmit={handleSubmitConfig} />}
            />
            <Route
                path="/game-board"
                element={<GameBoardPage
                    player1Stats={{ area: 10, minions: 5, money: 100 }}
                    player2Stats={{ area: 8, minions: 7, money: 80 }}
                    boardData={Array(64).fill('')}
                />}
            />
            <Route path="/waiting" element={<WaitingPage />} />
            <Route path="/start" element={<h1>Game Started!</h1>} /> {/* ✅ เพิ่ม Route นี้ */}
        </Routes>
    );
};

export default App;


