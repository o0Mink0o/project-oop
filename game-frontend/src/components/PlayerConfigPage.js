import React, { useState } from 'react';
import BackButton from './BackButton';
import '../styles/PlayerConfigPage.css'; // นำเข้าไฟล์ CSS ที่คุณให้มา

const PlayerConfigPage = ({ playerNumber, onSubmit }) => {
    const [minions, setMinions] = useState([{ name: '', defense: '', strategy: '' }]);

    const handleChange = (index, field, value) => {
        const newMinions = [...minions];
        newMinions[index][field] = value;
        setMinions(newMinions);
    };

    const handleAddMinion = () => {
        if (minions.length < 5) {
            setMinions([...minions, { name: '', defense: '', strategy: '' }]);
        } else {
            alert('You can only add up to 5 minions.');
        }
    };

    const handleSubmit = () => {
        onSubmit(minions);
    };

    return (
        <div className="player-config-page">
            <h1 className="title">Player {playerNumber} Configuration</h1>

            {minions.map((minion, index) => (
                <div key={index} className="minion-inputs">
                    <input
                        type="text"
                        placeholder="Minion Name"
                        className="input-field"
                        value={minion.name}
                        onChange={(e) => handleChange(index, 'name', e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Defense"
                        className="input-field"
                        value={minion.defense}
                        onChange={(e) => handleChange(index, 'defense', e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Strategy"
                        className="input-field"
                        value={minion.strategy}
                        onChange={(e) => handleChange(index, 'strategy', e.target.value)}
                    />
                </div>
            ))}

            <button className="btn btn-add" onClick={handleAddMinion}>➕ Add Minion</button>
            <button className="btn btn-submit" onClick={handleSubmit}>✅ Submit</button>
            <BackButton />
        </div>
    );
};

export default PlayerConfigPage;
