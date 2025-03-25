import React, {useState, useRef, useEffect} from 'react';
import BackButton from './BackButton';
import '../styles/PlayerConfigPage.css';
import {useNavigate} from "react-router-dom";

const PlayerConfigPage = ({ playerNumber, onSubmit }) => {
    const [minions, setMinions] = useState([{ name: '', defense: '', strategy: '' }]);
    const scrollContainerRef = useRef(null);
    const navigate = useNavigate();

    // ฟังก์ชันอัปเดตข้อมูล Minion
    const handleChange = (index, field, value) => {
        const newMinions = [...minions];
        newMinions[index][field] = value;
        setMinions(newMinions);
    };

    // ฟังก์ชันเพิ่ม Minion
    const handleAddMinion = () => {
        if (minions.length < 5) {
            setMinions([...minions, { name: '', defense: '', strategy: '' }]);
            // เลื่อนไปทางขวาหลังจากเพิ่ม minion
            setTimeout(() => {
                if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
                }
            }, 100);
        } else {
            alert('You can only add up to 5 minions.');
        }
    };

    // ฟังก์ชันส่งข้อมูล
    const handleSubmit = () => {
        fetch('http://localhost:8080/api/minion-types', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(minions), // ส่งข้อมูล Minions ที่เก็บใน state
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                console.log('Minion types added successfully');
                navigate('/game-board');
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    // ฟังก์ชันเลื่อนซ้ายขวา
    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = 300;
            if (direction === 'left') {
                current.scrollLeft -= scrollAmount;
            } else {
                current.scrollLeft += scrollAmount;
            }
        }
    };

    return (
        <div className="player-config-page">
            <h1 className="title">Player Configuration</h1>

            <div className="minions-row-layout" ref={scrollContainerRef}>
                {minions.map((minion, index) => (
                    <div key={index} className="minion-column">
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
                        <textarea
                            placeholder="Strategy"
                            className="input-field textarea-field"
                            value={minion.strategy}
                            onChange={(e) => handleChange(index, 'strategy', e.target.value)}
                        />
                    </div>
                ))}
            </div>

            <div className="buttons-container">
                <button className="btn btn-add" onClick={handleAddMinion}>
                    <span className="btn-icon">+</span> ADD MINION
                </button>
                <button className="btn btn-submit" onClick={handleSubmit}>
                    <span className="btn-icon">✓</span> SUBMIT
                </button>
                <BackButton className="btn btn-back" />
            </div>

            {minions.length > 1 && (
                <>
                    <div className="scroll-arrow scroll-left" onClick={() => scroll('left')}>
                        &lt;
                    </div>
                    <div className="scroll-arrow scroll-right" onClick={() => scroll('right')}>
                        &gt;
                    </div>
                </>
            )}
        </div>
    );
};

export default PlayerConfigPage;