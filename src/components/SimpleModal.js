import React from "react";

const SimpleModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000 }}>
            <div style={{ background: '#fff', margin: '5% auto', padding: 24, borderRadius: 8, maxWidth: 400, position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: 8, right: 8, fontSize: 20 }}>×</button>
                <h3 style={{ marginTop: 0 }}>{title}</h3>
                {children}
            </div>
        </div>
    );
};

export default SimpleModal;
