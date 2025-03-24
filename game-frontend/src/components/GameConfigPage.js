// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../styles/GameConfigPage.css';
// import BackButton from './BackButton';
//
// const GameConfigPage = () => {
//     const navigate = useNavigate();
//     const [animateIn, setAnimateIn] = useState(false);
//     const [selectedMode, setSelectedMode] = useState('');
//
//     // Game configuration state
//     const [config, setConfig] = useState({
//         turns: 20,
//         startingMoney: 5000,
//         players: 4,
//         difficulty: 3
//     });
//
//     useEffect(() => {
//         // Get the selected game mode from localStorage
//         const gameMode = localStorage.getItem('selectedGameMode');
//         setSelectedMode(gameMode || '');
//
//         // Trigger entrance animation after component mounts
//         setTimeout(() => {
//             setAnimateIn(true);
//         }, 100);
//     }, []);
//
//     // Handle change for all inputs
//     const handleConfigChange = (e) => {
//         const { name, value } = e.target;
//         setConfig({
//             ...config,
//             [name]: parseInt(value)
//         });
//     };
//
//     // Handle slider changes
//     const handleSliderChange = (e) => {
//         const { name, value } = e.target;
//         setConfig({
//             ...config,
//             [name]: parseInt(value)
//         });
//     };
//
//     // Get difficulty level text
//     const getDifficultyText = (level) => {
//         const difficultyLabels = ['ง่ายมาก', 'ง่าย', 'ปานกลาง', 'ยาก', 'ยากมาก'];
//         return difficultyLabels[level - 1];
//     };
//
//     // Reset config to defaults
//     const handleReset = () => {
//         setConfig({
//             turns: 20,
//             startingMoney: 5000,
//             players: 4,
//             difficulty: 3
//         });
//     };
//
//     // Save configuration and navigate based on selected mode
//     const handleSave = () => {
//         // Save configuration to localStorage
//         localStorage.setItem('gameConfig', JSON.stringify(config));
//
//         // Navigate based on the selected mode
//         switch (selectedMode) {
//             case 'auto':
//                 navigate('/player-config/1');
//                 break;
//             case '1player':
//                 navigate('/player-config/2');
//                 break;
//             case 'pvp':
//                 navigate('/player-config/3');
//                 break;
//             default:
//                 // If no mode is selected, go to game board as a fallback
//                 navigate('/game-board');
//         }
//     };
//
//     return (
//         <div className="game-config-page">
//             <div className="overlay"></div>
//
//             <div className={`config-content ${animateIn ? 'animate-in' : ''}`}>
//                 <div className="game-config-title">
//                     Game Config
//                 </div>
//
//                 <div className="config-container">
//                     <div className="config-options">
//                         {/* จำนวนเทิร์น */}
//                         <div className="config-option">
//                             <label htmlFor="turns">จำนวนเทิร์น</label>
//                             <div className="slider-container">
//                                 <input
//                                     type="range"
//                                     id="turns-slider"
//                                     name="turns"
//                                     min="5"
//                                     max="50"
//                                     value={config.turns}
//                                     onChange={handleSliderChange}
//                                     className="slider"
//                                 />
//                                 <div className="slider-value">{config.turns} เทิร์น</div>
//                             </div>
//                             <div className="input-container">
//                                 <input
//                                     type="number"
//                                     id="turns"
//                                     name="turns"
//                                     min="5"
//                                     max="50"
//                                     value={config.turns}
//                                     onChange={handleConfigChange}
//                                     className="config-input"
//                                 />
//                             </div>
//                         </div>
//
//                         {/* เงินเริ่มต้น */}
//                         <div className="config-option">
//                             <label htmlFor="startingMoney">เงินเริ่มต้น</label>
//                             <div className="slider-container">
//                                 <input
//                                     type="range"
//                                     id="startingMoney-slider"
//                                     name="startingMoney"
//                                     min="1000"
//                                     max="10000"
//                                     step="500"
//                                     value={config.startingMoney}
//                                     onChange={handleSliderChange}
//                                     className="slider"
//                                 />
//                                 <div className="slider-value">฿{config.startingMoney.toLocaleString()}</div>
//                             </div>
//                             <div className="input-container">
//                                 <input
//                                     type="number"
//                                     id="startingMoney"
//                                     name="startingMoney"
//                                     min="1000"
//                                     max="10000"
//                                     step="500"
//                                     value={config.startingMoney}
//                                     onChange={handleConfigChange}
//                                     className="config-input"
//                                 />
//                             </div>
//                         </div>
//
//                         {/* จำนวนผู้เล่น */}
//                         <div className="config-option">
//                             <label htmlFor="players">จำนวนผู้เล่น</label>
//                             <div className="slider-container">
//                                 <input
//                                     type="range"
//                                     id="players-slider"
//                                     name="players"
//                                     min="2"
//                                     max="6"
//                                     value={config.players}
//                                     onChange={handleSliderChange}
//                                     className="slider"
//                                 />
//                                 <div className="slider-value">{config.players} คน</div>
//                             </div>
//                             <div className="input-container">
//                                 <input
//                                     type="number"
//                                     id="players"
//                                     name="players"
//                                     min="2"
//                                     max="6"
//                                     value={config.players}
//                                     onChange={handleConfigChange}
//                                     className="config-input"
//                                 />
//                             </div>
//                         </div>
//
//                         {/* ระดับความยาก */}
//                         <div className="config-option">
//                             <label htmlFor="difficulty">ระดับความยาก</label>
//                             <div className="slider-container">
//                                 <input
//                                     type="range"
//                                     id="difficulty-slider"
//                                     name="difficulty"
//                                     min="1"
//                                     max="5"
//                                     value={config.difficulty}
//                                     onChange={handleSliderChange}
//                                     className="slider"
//                                 />
//                                 <div className="slider-value">{getDifficultyText(config.difficulty)}</div>
//                             </div>
//                             <div className="input-container">
//                                 <input
//                                     type="number"
//                                     id="difficulty"
//                                     name="difficulty"
//                                     min="1"
//                                     max="5"
//                                     value={config.difficulty}
//                                     onChange={handleConfigChange}
//                                     className="config-input"
//                                 />
//                             </div>
//                         </div>
//                     </div>
//
//                     <div className="button-container">
//                         <button className="btn btn-cancel" onClick={() => navigate(-1)}>
//                             ยกเลิก
//                             <span className="btn-effect"></span>
//                         </button>
//                         <button className="btn btn-reset" onClick={handleReset}>
//                             รีเซ็ต
//                             <span className="btn-effect"></span>
//                         </button>
//                         <button className="btn btn-save" onClick={handleSave}>
//                             Next
//                             <span className="btn-effect"></span>
//                         </button>
//                     </div>
//                 </div>
//
//                 <div className="navigation-buttons">
//                     <button className="btn btn-home" onClick={() => navigate('/')}>
//                         Home
//                         <span className="btn-effect"></span>
//                     </button>
//                     <BackButton className="back-button" />
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default GameConfigPage;