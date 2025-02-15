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
            className="back-button"
        >
            Back
        </button>
    );
};

export default BackButton;
