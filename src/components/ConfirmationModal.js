import React from "react";
import PropTypes from "prop-types";
import "../styles/ConfirmationModal.css";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger", // danger, warning, info
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="confirmation-modal-backdrop" onClick={handleBackdropClick}>
      <div className="confirmation-modal">
        <div className="confirmation-modal-header">
          <div className={`confirmation-icon ${type}`}>
            {type === "danger" && (
              <i className="fas fa-exclamation-triangle"></i>
            )}
            {type === "warning" && (
              <i className="fas fa-exclamation-circle"></i>
            )}
            {type === "info" && <i className="fas fa-info-circle"></i>}
          </div>
          <h3 className="confirmation-title">{title}</h3>
        </div>

        <div className="confirmation-modal-body">
          <p className="confirmation-message">{message}</p>
        </div>

        <div className="confirmation-modal-footer">
          <button className="confirmation-btn cancel-btn" onClick={onClose}>
            {cancelText}
          </button>
          <button
            className={`confirmation-btn confirm-btn ${type}`}
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  type: PropTypes.oneOf(["danger", "warning", "info"]),
};

export default ConfirmationModal;
