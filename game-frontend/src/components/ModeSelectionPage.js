import React from 'react';

const ModeSelectionPage = ({ onSelectMode }) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <button
                className="px-4 py-2 m-2 font-bold text-white bg-green-500 rounded-full hover:bg-green-700"
                onClick={() => onSelectMode('bot-vs-bot')}
            >
                Bot vs Bot
            </button>
            <button
                className="px-4 py-2 m-2 font-bold text-white bg-yellow-500 rounded-full hover:bg-yellow-700"
                onClick={() => onSelectMode('bot-vs-player')}
            >
                Bot vs Player
            </button>
            <button
                className="px-4 py-2 m-2 font-bold text-white bg-red-500 rounded-full hover:bg-red-700"
                onClick={() => onSelectMode('player-vs-player')}
            >
                Player vs Player
            </button>
        </div>
    );
};

export default ModeSelectionPage;