import React from 'react';
import { useNavigate } from 'react-router-dom';
import './XButton.css'; // Ensure the CSS file name matches

const XButton = () => {
  const navigate = useNavigate();

  return (
    <button className='x-button' onClick={() => navigate('/Home')}>
      X
    </button>
  );
};

export default XButton;
