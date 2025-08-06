import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000 }}>
            <div className="modal-content" style={{ background: '#fff', margin: '5% auto', padding: 24, borderRadius: 8, maxWidth: 400, position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: 8, right: 8 }}>×</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
