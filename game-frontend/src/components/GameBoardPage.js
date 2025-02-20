import React, { useState } from 'react';
import { User, DollarSign, Hexagon } from 'lucide-react';

const GRID_SIZE = 9;
const HEX_PRICE = 10;
const MINION_TYPES = [
    { name: "Basic Minion", price: 15 },
    { name: "Advanced Minion", price: 25 },
    { name: "Elite Minion", price: 40 }
];

const initialPlayers = [
    { id: 1, money: 100, minions: [], ownedHexes: [{x: 0, y: 0}], color: '#34d399' },
    { id: 2, money: 100, minions: [], ownedHexes: [{x: 8, y: 8}], color: '#f87171' }
];

const GameBoard = () => {
    const [players, setPlayers] = useState(initialPlayers);
    const [currentPlayer, setCurrentPlayer] = useState(0);
    const [selectedHexes, setSelectedHexes] = useState([]);
    const [purchaseMode, setPurchaseMode] = useState(null);
    const [selectedMinionType, setSelectedMinionType] = useState(null);
    const [turn, setTurn] = useState(1);

    // ... existing game logic functions ...

    return (
        <div className="flex h-screen bg-slate-800">
            {/* Left Panel */}
            <div className="w-64 bg-slate-900 p-6 flex flex-col gap-6 z-10">
                <div className="text-4xl font-bold text-center mb-8 text-white">Turn {turn}</div>

                {players.map((player, idx) => (
                    <div key={player.id}
                         className={`flex flex-col items-center p-6 rounded-xl ${
                             idx === currentPlayer ? 'ring-4 ring-yellow-400' : ''
                         }`}
                         style={{ backgroundColor: player.color }}>
                        <div className="text-3xl font-bold mb-6 text-slate-900">Player {player.id}</div>
                        <div className="flex gap-4 items-center text-2xl mb-4 text-slate-900">
                            <DollarSign size={32} /> {player.money}
                        </div>
                        <div className="flex gap-4 items-center text-2xl mb-4 text-slate-900">
                            <User size={32} /> {player.minions.length}
                        </div>
                        <div className="flex gap-4 items-center text-2xl text-slate-900">
                            <Hexagon size={32} /> {player.ownedHexes.length}
                        </div>
                    </div>
                ))}

                <div className="flex flex-col gap-4 mt-auto">
                    <button
                        className={`px-6 py-4 rounded-xl text-xl font-semibold ${
                            purchaseMode === 'hex' ? 'bg-yellow-400 text-slate-900' : 'bg-slate-700 text-white hover:bg-slate-600'
                        }`}
                        onClick={() => setPurchaseMode(prev => prev === 'hex' ? null : 'hex')}
                    >
                        Buy Hex (${HEX_PRICE})
                    </button>
                    <button
                        className={`px-6 py-4 rounded-xl text-xl font-semibold ${
                            purchaseMode === 'minion' ? 'bg-yellow-400 text-slate-900' : 'bg-slate-700 text-white hover:bg-slate-600'
                        }`}
                        onClick={() => setPurchaseMode(prev => prev === 'minion' ? null : 'minion')}
                    >
                        Buy Minion
                    </button>
                    <button
                        className="px-6 py-4 rounded-xl text-xl font-semibold bg-slate-700 text-white hover:bg-slate-600"
                        onClick={endTurn}
                    >
                        End Turn
                    </button>
                </div>
            </div>

            {/* Main Game Board */}
            <div className="flex-1 relative p-8 overflow-auto">
                <div className="relative mx-auto bg-slate-700 p-8 rounded-xl" style={{ width: '800px', height: '800px' }}>
                    {[...Array(GRID_SIZE)].map((_, y) =>
                        [...Array(GRID_SIZE)].map((_, x) => {
                            const owner = players.find(p =>
                                p.ownedHexes.some(h => h.x === x && h.y === y)
                            );
                            const minion = players.find(p =>
                                p.minions.some(m => m.position.x === x && m.position.y === y)
                            )?.minions.find(m => m.position.x === x && m.position.y === y);
                            const isSelected = selectedHexes.some(h => h.x === x && h.y === y);

                            const size = 70; // Smaller hex size
                            const width = size;
                            const height = size * 0.866;

                            const xOffset = y % 2 === 0 ? 0 : width * 0.5;
                            const xPos = x * width + xOffset;
                            const yPos = y * height * 0.75;

                            return (
                                <div
                                    key={`${x}-${y}`}
                                    className={`absolute cursor-pointer transition-all
                                        flex items-center justify-center
                                        ${isSelected ? 'ring-4 ring-yellow-400 z-10' : ''}
                                        ${owner ? 'border-4 border-slate-900' : 'border-2 border-slate-500'}
                                        hover:brightness-110`}
                                    style={{
                                        width: `${width}px`,
                                        height: `${width}px`,
                                        left: `${xPos}px`,
                                        top: `${yPos}px`,
                                        backgroundColor: owner?.color || '#1e293b',
                                        clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
                                    }}
                                    onClick={() => handleHexClick(x, y)}
                                >
                                    {minion && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <User size={32} className="text-slate-900" />
                                        </div>
                                    )}
                                    <div className="text-sm text-slate-300 absolute bottom-2">
                                        {x},{y}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Purchase Overlays */}
                {purchaseMode === 'hex' && selectedHexes.length > 0 && (
                    <div className="fixed bottom-8 left-72 p-8 rounded-xl bg-slate-900 text-white">
                        <div className="text-2xl mb-4">Total Cost: ${selectedHexes.length * HEX_PRICE}</div>
                        <button
                            className="px-8 py-4 bg-yellow-400 text-slate-900 rounded-xl text-xl font-semibold"
                            onClick={confirmHexPurchase}
                        >
                            Confirm Purchase
                        </button>
                    </div>
                )}

                {purchaseMode === 'minion' && (
                    <div className="fixed bottom-8 left-72 p-8 rounded-xl bg-slate-900 flex gap-6">
                        {MINION_TYPES.map((minion, idx) => (
                            <button
                                key={minion.name}
                                className={`px-8 py-4 rounded-xl text-xl font-semibold ${
                                    selectedMinionType === idx ? 'bg-yellow-400 text-slate-900' : 'bg-slate-700 text-white'
                                }`}
                                onClick={() => setSelectedMinionType(idx)}
                            >
                                {minion.name} (${minion.price})
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GameBoard;