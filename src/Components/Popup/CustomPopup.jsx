import React from 'react';
import './CustomPopup.css';

const CustomPopup = ({ open, onClose, title = "Popup Title", children }) => {
  if (!open) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h4>{title}</h4>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="popup-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CustomPopup;
