import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/Loader.css';

const Loader = () => {
  return ReactDOM.createPortal(
    <div className="loader-overlay">
      <div className="loader" />
    </div>,
    document.body
  );
};

export default Loader;
