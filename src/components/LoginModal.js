import "../styles/LoginModal.css";
import LoginForm from "./LoginForm"; // ✅ default import일 때만

const LoginModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div className="modal-logo">
          <img src="/assets/x-logo.png" alt="X Logo" />
        </div>
        <h2 className="modal-title">Sign in to X</h2>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginModal;
