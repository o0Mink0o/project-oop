import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/BackButton.css';

const BackButton = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };

    return (
        <button
            onClick={goBack}
            className="btn btn-back"
        >
            <span className="btn-icon">←</span> BACK
        </button>
    );
};

export default BackButton;
