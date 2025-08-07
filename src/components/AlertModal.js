import React from "react";
import PropTypes from "prop-types";
import "../styles/AlertModal.css";

const AlertModal = ({ isOpen, onClose, title, message, type = "error" }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return "fas fa-check-circle";
      case "warning":
        return "fas fa-exclamation-triangle";
      case "info":
        return "fas fa-info-circle";
      case "error":
      default:
        return "fas fa-times-circle";
    }
  };

  const getIconColor = () => {
    switch (type) {
      case "success":
        return "#28a745";
      case "warning":
        return "#ffc107";
      case "info":
        return "#17a2b8";
      case "error":
      default:
        return "#dc3545";
    }
  };

  return (
    <div className="alert-modal-overlay" onClick={onClose}>
      <div className="alert-modal" onClick={(e) => e.stopPropagation()}>
        <div className="alert-modal-header">
          <div className="alert-icon" style={{ color: getIconColor() }}>
            <i className={getIcon()}></i>
          </div>
          {title && <h3 className="alert-title">{title}</h3>}
        </div>
        <div className="alert-modal-body">
          <p className="alert-message">{message}</p>
        </div>
        <div className="alert-modal-footer">
          <button className="alert-btn alert-btn-primary" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

AlertModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error", "warning", "info"]),
};

export default AlertModal;
