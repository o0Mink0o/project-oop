import React from 'react';

const GameBoardPage = ({ player1Stats, player2Stats, boardData }) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="flex justify-between w-full p-4 bg-blue-200">
                <div>
                    <h2 className="text-xl font-bold">Player 1</h2>
                    <p>Area: {player1Stats.area}</p>
                    <p>Minions: {player1Stats.minions}</p>
                    <p>Money: {player1Stats.money}</p>
                </div>
                <div>
                    <h2 className="text-xl font-bold">Player 2</h2>
                    <p>Area: {player2Stats.area}</p>
                    <p>Minions: {player2Stats.minions}</p>
                    <p>Money: {player2Stats.money}</p>
                </div>
            </div>
            <div className="grid grid-cols-8 gap-2 p-4 bg-gray-200">
                {boardData.map((cell, index) => (
                    <div key={index} className="flex items-center justify-center w-16 h-16 bg-white border">
                        {cell}
                    </div>
                ))}
            </div>
            <div className="mt-4">
                <h2 className="text-2xl font-bold">END GAME</h2>
            </div>
        </div>
    );
};

export default GameBoardPage;