import React, { useState } from 'react';

const initialPlayerStats = {
    area: 1,
    minions: 0,
    money: 100
};

const initialBoard = Array(64).fill(null);

const GameBoardPage = () => {
    const [player1Stats, setPlayer1Stats] = useState(initialPlayerStats);
    const [player2Stats, setPlayer2Stats] = useState(initialPlayerStats);
    const [boardData, setBoardData] = useState(initialBoard);
    const [selectedHex, setSelectedHex] = useState(null);
    const [showMinionShop, setShowMinionShop] = useState(false);
    const [showHexPurchase, setShowHexPurchase] = useState(false);

    const handleBuyHex = (index) => {
        setSelectedHex(index);
        setShowHexPurchase(true);
    };

    const confirmHexPurchase = () => {
        if (player1Stats.money >= 50) {
            setBoardData(prev => {
                const newBoard = [...prev];
                newBoard[selectedHex] = 'P1';
                return newBoard;
            });
            setPlayer1Stats(prev => ({ ...prev, area: prev.area + 1, money: prev.money - 50 }));
        }
        setShowHexPurchase(false);
    };

    const handleBuyMinion = () => {
        setShowMinionShop(true);
    };

    const confirmMinionPurchase = (cost) => {
        if (player1Stats.money >= cost) {
            setPlayer1Stats(prev => ({ ...prev, minions: prev.minions + 1, money: prev.money - cost }));
        }
        setShowMinionShop(false);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: 10, backgroundColor: '#ddd' }}>
                <div>
                    <h2>Player 1</h2>
                    <p>Area: {player1Stats.area}</p>
                    <p>Minions: {player1Stats.minions}</p>
                    <p>Money: {player1Stats.money}</p>
                    <button onClick={handleBuyHex}>Buy Hex</button>
                    <button onClick={handleBuyMinion}>Buy Minion</button>
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 50px)', gap: 5, padding: 10 }}>
                {boardData.map((cell, index) => (
                    <div
                        key={index}
                        style={{ width: 50, height: 50, border: '1px solid black', backgroundColor: cell === 'P1' ? 'lightgreen' : 'white' }}
                        onClick={() => handleBuyHex(index)}
                    >
                        {cell}
                    </div>
                ))}
            </div>
            {showHexPurchase && (
                <div style={{ backgroundColor: 'lightgreen', padding: 20, position: 'absolute', top: '40%' }}>
                    <p>Hex Price: 50</p>
                    <button onClick={confirmHexPurchase}>Buy</button>
                </div>
            )}
            {showMinionShop && (
                <div style={{ backgroundColor: 'lightblue', padding: 20, position: 'absolute', top: '40%' }}>
                    <button onClick={() => confirmMinionPurchase(50)}>Minion 1 - 50$</button>
                    <button onClick={() => confirmMinionPurchase(15)}>Minion 2 - 15$</button>
                    <button onClick={() => confirmMinionPurchase(100)}>Minion 3 - 100$</button>
                </div>
            )}
        </div>
    );
};

export default GameBoardPage;
