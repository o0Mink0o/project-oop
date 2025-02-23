import React, { useState } from 'react';

const GRID_SIZE = 9;
const HEX_RADIUS = 40;
const HEX_WIDTH = 2 * HEX_RADIUS;
const HEX_HEIGHT = Math.sqrt(3) * HEX_RADIUS;
const HEX_PRICE = 10;
const MINION_TYPES = [
    { name: "Basic Minion", price: 15 },
    { name: "Advanced Minion", price: 25 },
    { name: "Elite Minion", price: 40 }
];

const initialPlayers = [
    { id: 1, money: 100, minions: [], ownedHexes: [{x: 0, y: 0}], color: 'rgb(220, 252, 231)' },
    { id: 2, money: 100, minions: [], ownedHexes: [{x: 8, y: 8}], color: 'rgb(254, 202, 202)' }
];

const GameBoard = () => {
    const [players, setPlayers] = useState(initialPlayers);
    const [currentPlayer, setCurrentPlayer] = useState(0);
    const [selectedHexes, setSelectedHexes] = useState([]);
    const [purchaseMode, setPurchaseMode] = useState(null);
    const [selectedMinionType, setSelectedMinionType] = useState(null);
    const [turn, setTurn] = useState(1);

    const isAdjacent = (hex1, hex2) => {
        const dx = Math.abs(hex1.x - hex2.x);
        const dy = Math.abs(hex1.y - hex2.y);
        return (dx === 1 && dy === 0) || (dx === 0 && dy === 1) || (dx === 1 && dy === 1);
    };

    const isHexAvailableForPurchase = (x, y) => {
        const hex = { x, y };
        if (players.some(p => p.ownedHexes.some(h => h.x === x && h.y === y))) {
            return false;
        }
        return players[currentPlayer].ownedHexes.some(playerHex => isAdjacent(playerHex, hex));
    };

    const handleHexClick = (x, y) => {
        if (purchaseMode === 'hex') {
            if (isHexAvailableForPurchase(x, y)) {
                setSelectedHexes(prev => {
                    const hexExists = prev.some(h => h.x === x && h.y === y);
                    if (hexExists) {
                        return prev.filter(h => h.x !== x || h.y !== y);
                    }
                    return [...prev, { x, y }];
                });
            }
        } else if (purchaseMode === 'minion' && selectedMinionType !== null) {
            if (players[currentPlayer].ownedHexes.some(h => h.x === x && h.y === y)) {
                const minionPrice = MINION_TYPES[selectedMinionType].price;
                if (players[currentPlayer].money >= minionPrice) {
                    setPlayers(prev => {
                        const newPlayers = [...prev];
                        newPlayers[currentPlayer].money -= minionPrice;
                        newPlayers[currentPlayer].minions.push({
                            type: selectedMinionType,
                            position: { x, y }
                        });
                        return newPlayers;
                    });
                    setPurchaseMode(null);
                    setSelectedMinionType(null);
                }
            }
        }
    };

    const confirmHexPurchase = () => {
        const totalCost = selectedHexes.length * HEX_PRICE;
        if (players[currentPlayer].money >= totalCost) {
            setPlayers(prev => {
                const newPlayers = [...prev];
                newPlayers[currentPlayer].money -= totalCost;
                newPlayers[currentPlayer].ownedHexes.push(...selectedHexes);
                return newPlayers;
            });
            setSelectedHexes([]);
            setPurchaseMode(null);
        }
    };

    const endTurn = () => {
        setCurrentPlayer((prev) => (prev + 1) % 2);
        setTurn(prev => prev + 1);
        setPurchaseMode(null);
        setSelectedHexes([]);
        setSelectedMinionType(null);
    };

    // Generate hexagon points for SVG
    const getHexPoints = () => {
        return `
      ${HEX_RADIUS * 0.5},0 
      ${HEX_RADIUS * 1.5},0 
      ${HEX_RADIUS * 2},${HEX_HEIGHT / 2} 
      ${HEX_RADIUS * 1.5},${HEX_HEIGHT} 
      ${HEX_RADIUS * 0.5},${HEX_HEIGHT} 
      0,${HEX_HEIGHT / 2}
    `;
    };

    return (
        <div className="flex h-screen">
            {/* Left Panel */}
            <div className="w-64 bg-gray-100 p-6 flex flex-col gap-6">
                <div className="text-4xl font-bold text-center mb-8">Turn {turn}</div>

                {players.map((player, idx) => (
                    <div key={player.id}
                         className={`flex flex-col items-center p-6 rounded-xl shadow-lg ${
                             idx === currentPlayer ? 'ring-4 ring-blue-500' : ''
                         }`}
                         style={{ backgroundColor: player.color }}>
                        <div className="text-3xl font-bold mb-6">Player {player.id}</div>
                        <div className="flex gap-4 items-center text-2xl mb-4">
                            💰 {player.money}
                        </div>
                        <div className="flex gap-4 items-center text-2xl mb-4">
                            👥 {player.minions.length}
                        </div>
                        <div className="flex gap-4 items-center text-2xl">
                            ⬡ {player.ownedHexes.length}
                        </div>
                    </div>
                ))}

                <div className="flex flex-col gap-4 mt-auto">
                    <button
                        className={`px-6 py-4 rounded-xl text-xl font-semibold shadow-md ${
                            purchaseMode === 'hex' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        }`}
                        onClick={() => setPurchaseMode(prev => prev === 'hex' ? null : 'hex')}
                    >
                        Buy Hex (${HEX_PRICE})
                    </button>
                    <button
                        className={`px-6 py-4 rounded-xl text-xl font-semibold shadow-md ${
                            purchaseMode === 'minion' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        }`}
                        onClick={() => setPurchaseMode(prev => prev === 'minion' ? null : 'minion')}
                    >
                        Buy Minion
                    </button>
                    <button
                        className="px-6 py-4 rounded-xl text-xl font-semibold bg-gray-200 shadow-md"
                        onClick={endTurn}
                    >
                        End Turn
                    </button>
                </div>
            </div>

            {/* Main Game Board */}
            <div className="flex-1 p-8 relative">
                <svg
                    width={(GRID_SIZE * HEX_WIDTH * 0.75) + HEX_RADIUS}
                    height={(GRID_SIZE * HEX_HEIGHT) + (HEX_HEIGHT / 2)}
                    viewBox={`0 0 ${(GRID_SIZE * HEX_WIDTH * 0.75) + HEX_RADIUS} ${(GRID_SIZE * HEX_HEIGHT) + (HEX_HEIGHT / 2)}`}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                    {[...Array(GRID_SIZE)].map((_, row) =>
                        [...Array(GRID_SIZE)].map((_, col) => {
                            const x = col * HEX_WIDTH * 0.75;
                            const y = row * HEX_HEIGHT + (col % 2 === 1 ? HEX_HEIGHT / 2 : 0);

                            const owner = players.find(p =>
                                p.ownedHexes.some(h => h.x === col && h.y === row)
                            );
                            const minion = players.find(p =>
                                p.minions.some(m => m.position.x === col && m.position.y === row)
                            )?.minions.find(m => m.position.x === col && m.position.y === row);
                            const isSelected = selectedHexes.some(h => h.x === col && h.y === row);

                            return (
                                <g key={`${col}-${row}`} transform={`translate(${x},${y})`}>
                                    <polygon
                                        points={getHexPoints()}
                                        stroke="rgba(255, 255, 255, 0.5)"
                                        strokeWidth="2"
                                        fill={owner?.color || 'white'}
                                        className={`
                      ${isSelected ? 'ring-4 ring-blue-500' : ''}
                      ${owner ? 'border-4 border-gray-600' : 'border-2 border-gray-300'}
                      hover:opacity-80 transition-all duration-200
                    `}
                                        style={{
                                            cursor: isHexAvailableForPurchase(col, row) ? 'pointer' : 'default'
                                        }}
                                        onClick={() => handleHexClick(col, row)}
                                    />
                                    {minion && (
                                        <text
                                            x={HEX_RADIUS}
                                            y={HEX_HEIGHT / 2}
                                            textAnchor="middle"
                                            alignmentBaseline="middle"
                                            fontSize="24"
                                        >
                                            👥
                                        </text>
                                    )}
                                    <text
                                        x={HEX_RADIUS}
                                        y={HEX_HEIGHT - 10}
                                        textAnchor="middle"
                                        fill="gray"
                                        fontSize="12"
                                    >
                                        {col},{row}
                                    </text>
                                </g>
                            );
                        })
                    )}
                </svg>

                {/* Purchase Overlays */}
                {purchaseMode === 'hex' && selectedHexes.length > 0 && (
                    <div className="absolute bottom-8 left-8 p-8 border-2 rounded-xl shadow-lg bg-white">
                        <div className="text-2xl mb-4">Total Cost: ${selectedHexes.length * HEX_PRICE}</div>
                        <button
                            className="px-8 py-4 bg-green-500 text-white rounded-xl text-xl font-semibold shadow-md"
                            onClick={confirmHexPurchase}
                        >
                            Confirm Purchase
                        </button>
                    </div>
                )}

                {purchaseMode === 'minion' && (
                    <div className="absolute bottom-8 left-8 p-8 border-2 rounded-xl shadow-lg bg-white flex gap-6">
                        {MINION_TYPES.map((minion, idx) => (
                            <button
                                key={minion.name}
                                className={`px-8 py-4 rounded-xl text-xl font-semibold shadow-md ${
                                    selectedMinionType === idx ? 'bg-blue-500 text-white' : 'bg-gray-200'
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