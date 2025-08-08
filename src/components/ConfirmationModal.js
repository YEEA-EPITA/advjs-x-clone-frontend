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
  loading = false,
  disableCancel = false,
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    // Don't close on backdrop click if loading
    if (loading) return;
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    // Don't allow multiple confirms while loading
    if (loading) return;
    onConfirm();
    // Don't close immediately - let the parent handle closing
  };

  const handleCancel = () => {
    // Don't allow cancel if disabled or loading
    if (disableCancel || loading) return;
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
          <button
            className="confirmation-btn cancel-btn"
            onClick={handleCancel}
            disabled={disableCancel || loading}
            style={{
              opacity: disableCancel || loading ? 0.5 : 1,
              cursor: disableCancel || loading ? "not-allowed" : "pointer",
            }}
          >
            {cancelText}
          </button>
          <button
            className={`confirmation-btn confirm-btn ${type}`}
            onClick={handleConfirm}
            disabled={loading}
            style={{
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading && (
              <i
                className="fas fa-spinner fa-spin"
                style={{ marginRight: "8px" }}
              ></i>
            )}
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
  loading: PropTypes.bool,
  disableCancel: PropTypes.bool,
};

export default ConfirmationModal;
