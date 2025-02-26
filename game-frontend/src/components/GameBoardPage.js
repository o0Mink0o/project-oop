import React, { useState } from 'react';
import '../styles/HexGrid.css';

const GRID_SIZE = 8;
const HEX_RADIUS = 40;
const HEX_WIDTH = 2 * HEX_RADIUS;
const HEX_HEIGHT = Math.sqrt(3) * HEX_RADIUS;
const HEX_PRICE = 10;
const MINION_TYPES = [
    { name: "Basic Minion", price: 15 },
    { name: "Advanced Minion", price: 25 },
    { name: "Elite Minion", price: 40 }
];

// Initial player configurations
const initialPlayers = [
    {
        id: 1,
        money: 100,
        minions: [],
        ownedHexes: [{x: 0, y: 0},{x: 1, y: 0},{x: 2, y: 0},{x: 0, y: 1},{x: 1, y: 1}],
        color: 'rgb(220, 252, 231)',
        hasUsedHexAction: false,
        hasUsedMinionAction: false
    },
    {
        id: 2,
        money: 100,
        minions: [],
        ownedHexes: [{x: 7, y: 7},{x: 6, y: 7},{x: 5, y: 7},{x: 6, y: 6},{x: 7, y: 6}],
        color: 'rgb(254, 202, 202)',
        hasUsedHexAction: false,
        hasUsedMinionAction: false
    }
];

const GameBoard = () => {
    const [players, setPlayers] = useState(initialPlayers);
    const [currentPlayer, setCurrentPlayer] = useState(0);
    const [selectedHex, setSelectedHex] = useState(null);
    const [purchaseMode, setPurchaseMode] = useState(null);
    const [selectedMinionType, setSelectedMinionType] = useState(null);
    const [turn, setTurn] = useState(1);
    const [showAvailableHexes, setShowAvailableHexes] = useState(false);
    const [debugMode] = useState(false);

    // Adjacency checks remain the same
    const isOrthogonalAdjacent = (hex1, hex2) => {
        const dx = Math.abs(hex1.x - hex2.x);
        const dy = Math.abs(hex1.y - hex2.y);

        if (hex1.x % 2 === 0) { // even column
            return (dx === 1 && dy === 0) ||
                (dx === 0 && dy === 1) ||
                (dx === 1 && dy === 1 && hex1.y > hex2.y);
        } else { // odd column
            return (dx === 1 && dy === 0) ||
                (dx === 0 && dy === 1) ||
                (dx === 1 && dy === 1 && hex1.y < hex2.y);
        }
    };

    const isAdjacent = (hex1, hex2) => {
        return isOrthogonalAdjacent(hex1, hex2);
    };

    const getAdjacencyType = (hex1, hex2) => {
        if (isOrthogonalAdjacent(hex1, hex2)) return "adjacent";
        return "not adjacent";
    };

    const isHexAvailableForPurchase = (x, y) => {
        const hex = { x, y };
        if (players.some(p => p.ownedHexes.some(h => h.x === x && h.y === y))) {
            return false;
        }
        return players[currentPlayer].ownedHexes.some(playerHex => isAdjacent(playerHex, hex));
    };

    const getAdjacencyDetails = (x, y) => {
        const hex = { x, y };
        const adjacentPlayerHexes = players[currentPlayer].ownedHexes.filter(playerHex =>
            isAdjacent(playerHex, hex)
        );

        return adjacentPlayerHexes.map(playerHex => ({
            playerHex,
            type: getAdjacencyType(playerHex, hex)
        }));
    };

    const handleHexClick = (x, y) => {
        if (purchaseMode === 'hex' && !players[currentPlayer].hasUsedHexAction) {
            if (isHexAvailableForPurchase(x, y)) {
                setSelectedHex({ x, y });

                if (debugMode) {
                    const details = getAdjacencyDetails(x, y);
                    console.log(`Hex ${x},${y} is adjacent to:`);
                    details.forEach(detail => {
                        console.log(`- Hex ${detail.playerHex.x},${detail.playerHex.y} (${detail.type})`);
                    });
                }
            }
        } else if (purchaseMode === 'minion' && selectedMinionType !== null && !players[currentPlayer].hasUsedMinionAction) {
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
                        newPlayers[currentPlayer].hasUsedMinionAction = true;
                        return newPlayers;
                    });
                    setPurchaseMode(null);
                    setSelectedMinionType(null);
                }
            }
        }
    };

    const confirmHexPurchase = () => {
        if (selectedHex && players[currentPlayer].money >= HEX_PRICE) {
            setPlayers(prev => {
                const newPlayers = [...prev];
                newPlayers[currentPlayer].money -= HEX_PRICE;
                newPlayers[currentPlayer].ownedHexes.push(selectedHex);
                newPlayers[currentPlayer].hasUsedHexAction = true;
                return newPlayers;
            });
            setSelectedHex(null);
            setPurchaseMode(null);
            setShowAvailableHexes(false);
        }
    };

    const endTurn = () => {
        setCurrentPlayer((prev) => (prev + 1) % 2);
        setTurn(prev => prev + 1);
        setPurchaseMode(null);
        setSelectedHex(null);
        setSelectedMinionType(null);
        setShowAvailableHexes(false);
        setPlayers(prev => {
            const newPlayers = [...prev];
            newPlayers.forEach(player => {
                player.hasUsedHexAction = false;
                player.hasUsedMinionAction = false;
            });
            return newPlayers;
        });
    };

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

    const PlayerPanel = ({ player, isCurrentPlayer }) => (
        <div className={`player-panel w-64 bg-gradient-to-br ${isCurrentPlayer ? (player.id === 1 ? 'from-green-100 to-green-200' : 'from-red-100 to-red-200') : 'from-gray-100 to-gray-200'} p-4 flex flex-col gap-4 rounded-xl shadow-xl transition-all duration-300 ${isCurrentPlayer ? 'ring-4 ring-blue-500 transform scale-105' : 'opacity-80'}`}>
            <div className={`flex flex-col items-center p-4 rounded-xl shadow-lg transform transition-transform duration-500 hover:scale-105`}
                 style={{ backgroundColor: player.color }}>
                <div className="text-2xl font-bold mb-4 text-center">Player {player.id}</div>
                <div className="flex flex-col gap-4 w-full">
                    <div className="flex justify-between items-center text-xl p-2 bg-white bg-opacity-50 rounded-lg">
                        <span>💰</span>
                        <span className="font-bold">${player.money}</span>
                    </div>
                    <div className="flex justify-between items-center text-xl p-2 bg-white bg-opacity-50 rounded-lg">
                        <span>👥</span>
                        <span className="font-bold">{player.minions.length}</span>
                    </div>
                    <div className="flex justify-between items-center text-xl p-2 bg-white bg-opacity-50 rounded-lg">
                        <span>⬡</span>
                        <span className="font-bold">{player.ownedHexes.length}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <button
                    className={`action-button px-4 py-3 rounded-xl text-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                        !isCurrentPlayer ? 'bg-gray-300 cursor-not-allowed' :
                            player.hasUsedHexAction ? 'bg-gray-400 cursor-not-allowed' :
                                purchaseMode === 'hex' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' : 'bg-gradient-to-r from-indigo-400 to-purple-500 text-white'
                    }`}
                    onClick={() => {
                        if (isCurrentPlayer && !player.hasUsedHexAction) {
                            if (purchaseMode !== 'hex') {
                                setPurchaseMode('hex');
                                setShowAvailableHexes(true);
                            } else {
                                setPurchaseMode(null);
                                setShowAvailableHexes(false);
                                setSelectedHex(null);
                            }
                        }
                    }}
                    disabled={!isCurrentPlayer || player.hasUsedHexAction}
                >
                    <div className="flex items-center justify-center">
                        <span>Buy Hex</span>
                        <span className="ml-2 bg-white bg-opacity-20 px-2 py-1 rounded-md">${HEX_PRICE}</span>
                    </div>
                </button>
                <button
                    className={`action-button px-4 py-3 rounded-xl text-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                        !isCurrentPlayer ? 'bg-gray-300 cursor-not-allowed' :
                            player.hasUsedMinionAction ? 'bg-gray-400 cursor-not-allowed' :
                                purchaseMode === 'minion' ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white' : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                    }`}
                    onClick={() => isCurrentPlayer && !player.hasUsedMinionAction && setPurchaseMode(prev => prev === 'minion' ? null : 'minion')}
                    disabled={!isCurrentPlayer || player.hasUsedMinionAction}
                >
                    <div className="flex items-center justify-center">
                        <span>Buy Minion</span>
                    </div>
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 to-black">
            {/* Top player panels - new layout */}
            <div className="flex justify-between pt-4 px-8 h-64">
                {/* Player 1 panel - top left */}
                <div className="flex-shrink-0">
                    <PlayerPanel player={players[0]} isCurrentPlayer={currentPlayer === 0} />
                </div>

                {/* Game status header - center top */}
                <div className="flex items-center justify-center">
                    <div className="text-center">
                        <div className={`text-4xl font-bold text-center text-white turn-indicator ${currentPlayer === 0 ? 'text-green-400' : 'text-red-400'}`}>
                            Player {currentPlayer + 1}'s Turn
                        </div>
                        <div className="text-xl text-gray-300 mt-2">Round {turn}</div>
                    </div>
                </div>

                {/* Player 2 panel - top right */}
                <div className="flex-shrink-0">
                    <PlayerPanel player={players[1]} isCurrentPlayer={currentPlayer === 1} />
                </div>
            </div>

            {/* Game board - middle */}
            <div className="flex-grow flex items-center justify-center p-4">
                <div className="border-4 border-gray-900 rounded-2xl p-4 bg-gradient-to-br from-gray-900 to-black shadow-2xl hex-grid">
                    <svg
                        width={(GRID_SIZE * HEX_WIDTH * 0.75) + HEX_RADIUS}
                        height={(GRID_SIZE * HEX_HEIGHT) + (HEX_HEIGHT / 2)}
                        viewBox={`0 0 ${(GRID_SIZE * HEX_WIDTH * 0.75) + HEX_RADIUS} ${(GRID_SIZE * HEX_HEIGHT) + (HEX_HEIGHT / 2)}`}
                    >
                        {[...Array(GRID_SIZE)].map((_, row) =>
                            [...Array(GRID_SIZE)].map((_, col) => {
                                const x = col * HEX_WIDTH * 0.75;
                                const y = row * HEX_HEIGHT + (col % 2 === 0 ? HEX_HEIGHT / 2 : 0);

                                const owner = players.find(p =>
                                    p.ownedHexes.some(h => h.x === col && h.y === row)
                                );
                                const minion = players.find(p =>
                                    p.minions.some(m => m.position.x === col && m.position.y === row)
                                )?.minions.find(m => m.position.x === col && m.position.y === row);
                                const isSelected = selectedHex && selectedHex.x === col && selectedHex.y === row;
                                const isAvailable = isHexAvailableForPurchase(col, row);
                                const shouldShowAvailable = purchaseMode === 'hex' && showAvailableHexes && isAvailable;

                                return (
                                    <g key={`${col}-${row}`} transform={`translate(${x},${y})`}>
                                        <polygon
                                            points={getHexPoints()}
                                            stroke={shouldShowAvailable ? "rgba(0, 255, 0, 0.8)" : "rgba(100, 100, 100, 0.6)"}
                                            strokeWidth={shouldShowAvailable ? "3" : "2"}
                                            fill={owner?.color || (shouldShowAvailable ? 'rgba(0, 255, 0, 0.25)' : 'rgba(40, 40, 40, 0.8)')}
                                            className={`
                                                hex-cell
                                                ${isSelected ? 'selected' : ''}
                                                ${owner ? 'owned' : ''}
                                                ${shouldShowAvailable ? 'available' : ''}
                                            `}
                                            style={{
                                                cursor: shouldShowAvailable || (purchaseMode === 'minion' && players[currentPlayer].ownedHexes.some(h => h.x === col && h.y === row))
                                                    ? 'pointer' : 'default',
                                                transition: 'all 0.3s ease',
                                                filter: isSelected ? 'drop-shadow(0 0 10px gold)' : ''
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
                                                className="minion-icon"
                                            >
                                                👥
                                            </text>
                                        )}
                                        <text
                                            x={HEX_RADIUS}
                                            y={HEX_HEIGHT - 10}
                                            textAnchor="middle"
                                            fill="red"
                                            fontSize="12"
                                            className="coordinate-label"
                                        >
                                            {row+1},{col+1}
                                        </text>
                                    </g>
                                );
                            })
                        )}
                    </svg>
                </div>
            </div>

            {/* End turn button - bottom */}
            <div className="py-4 flex justify-center">
                <button
                    className="action-button px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                    onClick={endTurn}
                >
                    End Turn
                </button>
            </div>

            {/* Overlays */}
            {purchaseMode === 'hex' && selectedHex && (
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 p-6 border-2 rounded-xl shadow-lg bg-gradient-to-br from-blue-900 to-indigo-900 text-white z-50 purchase-overlay">
                    <div className="text-xl mb-3 text-center">Cost: <span className="font-bold text-yellow-300">${HEX_PRICE}</span></div>
                    <div className="flex justify-center">
                        <button
                            className="action-button px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-lg font-semibold shadow-md transition-all duration-300 transform hover:scale-105"
                            onClick={confirmHexPurchase}
                        >
                            Confirm Purchase
                        </button>
                    </div>
                </div>
            )}

            {purchaseMode === 'minion' && (
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 p-6 border-2 rounded-xl shadow-lg bg-gradient-to-br from-purple-900 to-pink-900 text-white flex flex-col gap-3 z-50 purchase-overlay">
                    <div className="text-lg text-center mb-2">Select Minion Type</div>
                    <div className="flex flex-wrap gap-3 justify-center">
                        {MINION_TYPES.map((minion, idx) => (
                            <button
                                key={minion.name}
                                className={`px-4 py-2 rounded-xl text-base font-semibold shadow-md transition-all duration-300 ${
                                    selectedMinionType === idx
                                        ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white transform scale-105'
                                        : 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700'
                                }`}
                                onClick={() => setSelectedMinionType(idx)}
                            >
                                {minion.name}
                                <div className="text-sm mt-1 bg-white bg-opacity-20 px-2 py-1 rounded-md">${minion.price}</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameBoard;