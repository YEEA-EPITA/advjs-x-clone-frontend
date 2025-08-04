import "../styles/RegisterModal.css";
import RegisterForm from "./RegisterForm";

const RegisterModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
      
        <button className="close-button" onClick={onClose}>&times;</button>

        <div className="modal-logo">
          <img src="/assets/x-logo.png" alt="X Logo" />
        </div>

        <h2 className="modal-title">Create your account</h2>
        <RegisterForm />
      </div>
    </div>
      );
};

export default RegisterModal;
