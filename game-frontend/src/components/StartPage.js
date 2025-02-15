import React from 'react';

const StartPage = ({ onStart }) => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <button
                className="px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700"
                onClick={onStart}
            >
                Start Game
            </button>
        </div>
    );
};

export default StartPage;