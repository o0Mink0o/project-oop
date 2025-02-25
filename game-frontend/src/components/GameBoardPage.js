import React, { useState } from 'react';
import '../styles/HexGrid.css';

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

// Corrected starting positions - Fixed player 2 position inconsistency
const initialPlayers = [
    {
        id: 1,
        money: 100,
        minions: [],
        ownedHexes: [{x: 0, y: 0},{x: 0, y: 1},{x: 1, y: 0}],
        color: 'rgb(220, 252, 231)',
        hasUsedHexAction: false,
        hasUsedMinionAction: false
    },
    {
        id: 2,
        money: 100,
        minions: [],
        ownedHexes: [{x: 8, y: 8},{x: 8, y: 7},{x: 7, y: 8}], // Consistent with comment in code
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
    const [debugMode, setDebugMode] = useState(false);

    // Separate adjacency checks for different cases
    // Orthogonal adjacency (side-by-side)
    const isOrthogonalAdjacent = (hex1, hex2) => {
        const dx = Math.abs(hex1.x - hex2.x);
        const dy = Math.abs(hex1.y - hex2.y);

        // For hexagonal grid (using axial coordinates), adjacency is different
        // A hex is adjacent if coordinates differ by at most 1 in only one direction
        // This depends on whether we're using even-q or odd-q offset
        if (hex1.x % 2 === 0) { // even column
            return (dx === 1 && dy === 0) ||
                (dx === 0 && dy === 1) ||
                (dx === 0 && dy === 1) ||
                (dx === 1 && dy === 1 && hex1.y > hex2.y); // diagonal only for specific direction
        } else { // odd column
            return (dx === 1 && dy === 0) ||
                (dx === 0 && dy === 1) ||
                (dx === 1 && dy === 1 && hex1.y < hex2.y); // diagonal only for specific direction
        }
    };

    // We now use only orthogonal adjacency and remove the diagonal adjacency concept
    const isAdjacent = (hex1, hex2) => {
        return isOrthogonalAdjacent(hex1, hex2);
    };

    // Debug function to show adjacency type
    const getAdjacencyType = (hex1, hex2) => {
        if (isOrthogonalAdjacent(hex1, hex2)) return "adjacent";
        return "not adjacent";
    };

    // Check if hex is available for purchase
    const isHexAvailableForPurchase = (x, y) => {
        const hex = { x, y };
        // If hex is already owned by any player, it's not available
        if (players.some(p => p.ownedHexes.some(h => h.x === x && h.y === y))) {
            return false;
        }

        // Check adjacency to player's hexes
        return players[currentPlayer].ownedHexes.some(playerHex => isAdjacent(playerHex, hex));
    };

    // Get adjacency details for debugging
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
                // Only allow selection of a single hex
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
        <div className={`w-72 bg-gradient-to-br ${isCurrentPlayer ? (player.id === 1 ? 'from-green-100 to-green-200' : 'from-red-100 to-red-200') : 'from-gray-100 to-gray-200'} p-6 flex flex-col gap-6 rounded-xl shadow-xl transition-all duration-300 ${isCurrentPlayer ? 'ring-4 ring-blue-500 transform scale-105' : 'opacity-80'}`}>
            <div className={`flex flex-col items-center p-6 rounded-xl shadow-lg transform transition-transform duration-500 hover:scale-105`}
                 style={{ backgroundColor: player.color }}>
                <div className="text-3xl font-bold mb-6 text-center">Player {player.id}</div>
                <div className="flex flex-col gap-6 w-full">
                    <div className="flex justify-between items-center text-2xl p-3 bg-white bg-opacity-50 rounded-lg">
                        <span>💰</span>
                        <span className="font-bold">${player.money}</span>
                    </div>
                    <div className="flex justify-between items-center text-2xl p-3 bg-white bg-opacity-50 rounded-lg">
                        <span>👥</span>
                        <span className="font-bold">{player.minions.length}</span>
                    </div>
                    <div className="flex justify-between items-center text-2xl p-3 bg-white bg-opacity-50 rounded-lg">
                        <span>⬡</span>
                        <span className="font-bold">{player.ownedHexes.length}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <button
                    className={`px-6 py-4 rounded-xl text-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
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
                    className={`px-6 py-4 rounded-xl text-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
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
        <div className="flex h-screen bg-gradient-to-br from-slate-900 to-black p-4">
            {/* Left Player Panel */}
            <div className="flex items-center">
                <PlayerPanel player={players[0]} isCurrentPlayer={currentPlayer === 0} />
            </div>

            {/* Main Game Board */}
            <div className="flex-1 px-8 py-4 flex flex-col items-center justify-center">
                <div className="text-5xl font-bold text-center mb-8 text-white">
                    <span className={`turn-indicator ${currentPlayer === 0 ? 'text-green-400' : 'text-red-400'}`}>
                        Player {currentPlayer + 1}'s Turn
                    </span>
                    <div className="text-2xl text-gray-300 mt-2">Round {turn}</div>
                </div>


                <div className="border-8 border-gray-900 rounded-2xl p-6 bg-gradient-to-br from-gray-900 to-black shadow-2xl">
                    <svg
                        width={(GRID_SIZE * HEX_WIDTH * 0.75) + HEX_RADIUS}
                        height={(GRID_SIZE * HEX_HEIGHT) + (HEX_HEIGHT / 2)}
                        viewBox={`0 0 ${(GRID_SIZE * HEX_WIDTH * 0.75) + HEX_RADIUS} ${(GRID_SIZE * HEX_HEIGHT) + (HEX_HEIGHT / 2)}`}
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
                                const isSelected = selectedHex && selectedHex.x === col && selectedHex.y === row;
                                const isAvailable = isHexAvailableForPurchase(col, row);

                                // Only show available hexes when in purchase mode and showAvailableHexes is true
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
                                            fill="white"
                                            fontSize="12"
                                            className="coordinate-label"
                                        >
                                            {col},{row}
                                        </text>
                                    </g>
                                );
                            })
                        )}
                    </svg>
                </div>

                <button
                    className="mt-8 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-2xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                    onClick={endTurn}
                >
                    End Turn
                </button>

                {/* Purchase Overlays */}
                {purchaseMode === 'hex' && selectedHex && (
                    <div className="purchase-overlay fixed bottom-8 left-1/2 transform -translate-x-1/2 p-8 border-2 rounded-xl shadow-lg bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
                        <div className="text-2xl mb-4 text-center">Cost: <span className="font-bold text-yellow-300">${HEX_PRICE}</span></div>
                        <div className="flex flex-col gap-4">
                            <div className="text-center mb-2">
                                {debugMode && (
                                    <div className="mb-2">
                                        {getAdjacencyDetails(selectedHex.x, selectedHex.y).map((detail, i) => (
                                            <div key={i}>
                                                Adjacent to: {detail.playerHex.x},{detail.playerHex.y} ({detail.type})
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-center">
                                <button
                                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-xl font-semibold shadow-md transition-all duration-300 transform hover:scale-105"
                                    onClick={confirmHexPurchase}
                                >
                                    Confirm Purchase
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {purchaseMode === 'minion' && (
                    <div className="purchase-overlay fixed bottom-8 left-1/2 transform -translate-x-1/2 p-8 border-2 rounded-xl shadow-lg bg-gradient-to-br from-purple-900 to-pink-900 text-white flex flex-col gap-4">
                        <div className="text-xl text-center mb-2">Select Minion Type</div>
                        <div className="flex flex-wrap gap-4 justify-center">
                            {MINION_TYPES.map((minion, idx) => (
                                <button
                                    key={minion.name}
                                    className={`px-6 py-3 rounded-xl text-lg font-semibold shadow-md transition-all duration-300 ${
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

                {/* Debug Legend */}
                {debugMode && (
                    <div className="mt-4 p-4 bg-black bg-opacity-70 text-white rounded-lg">
                        <h3 className="text-lg font-bold mb-2">Adjacency Rules</h3>
                        <div>
                            <p>Hexes can only be purchased adjacent to owned hexes</p>
                            <p>Adjacency follows proper hexagonal grid rules</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Player Panel */}
            <div className="flex items-center">
                <PlayerPanel player={players[1]} isCurrentPlayer={currentPlayer === 1} />
            </div>
        </div>
    );
};

export default GameBoard;