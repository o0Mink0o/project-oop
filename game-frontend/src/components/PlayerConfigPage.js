import React, { useState } from 'react';

const PlayerConfigPage = ({ playerNumber, onSubmit }) => {
    const [minions, setMinions] = useState([{ name: '', defense: '', strategy: '' }]);

    const handleChange = (index, field, value) => {
        const newMinions = [...minions];
        newMinions[index][field] = value;
        setMinions(newMinions);
    };

    const handleAddMinion = () => {
        setMinions([...minions, { name: '', defense: '', strategy: '' }]);
    };

    const handleSubmit = () => {
        onSubmit(minions);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="mb-4 text-2xl font-bold">Player {playerNumber} Configuration</h1>
            {minions.map((minion, index) => (
                <div key={index} className="mb-4">
                    <input
                        type="text"
                        placeholder="Minion Name"
                        className="px-4 py-2 m-2 border border-gray-300 rounded"
                        value={minion.name}
                        onChange={(e) => handleChange(index, 'name', e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Defense"
                        className="px-4 py-2 m-2 border border-gray-300 rounded"
                        value={minion.defense}
                        onChange={(e) => handleChange(index, 'defense', e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Strategy"
                        className="px-4 py-2 m-2 border border-gray-300 rounded"
                        value={minion.strategy}
                        onChange={(e) => handleChange(index, 'strategy', e.target.value)}
                    />
                </div>
            ))}
            <button
                className="px-4 py-2 m-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700"
                onClick={handleAddMinion}
            >
                Add Minion
            </button>
            <button
                className="px-4 py-2 m-2 font-bold text-white bg-green-500 rounded-full hover:bg-green-700"
                onClick={handleSubmit}
            >
                Submit
            </button>
        </div>
    );
};

export default PlayerConfigPage;