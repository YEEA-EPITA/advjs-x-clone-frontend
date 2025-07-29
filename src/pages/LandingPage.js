import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper"> 

      <div className="container"> 
        <div className="logo-section">
          <img src="/assets/x-logo.png" alt="X Logo" className="x-logo" />
        </div>

        <div className="auth-section">
          <h1 className="title">Happening now</h1>
          <h2 className="subtitle">Join today.</h2>

          <button className="social-button google">
            <span className="icon">G</span> Sign up with Google
          </button>

          <button className="social-button apple">
            <span className="icon"></span> Sign up with Apple
          </button>

          <div className="divider-with-text">
            <div className="line" />
            <span className="or-text">or</span>
            <div className="line" />
          </div>

          <button className="create-account-btn" onClick={() => navigate("/auth/register")}>
            Create account
          </button>

          <p className="tos-text">
            By signing up, you agree to the <a href="#">Terms of Service</a> and{" "}
            <a href="#">Privacy Policy</a>, including <a href="#">Cookie Use</a>.
          </p>

          <div className="signin-container">
            <button className="signin-btn" onClick={() => navigate("/auth/login")}>
              Sign in
            </button>
          </div>
        </div>
      </div>

      <div className="footer">
        <ul className="footer-links">
        <li><a href="#">About</a></li>
        <li><a href="#">Help Center</a></li>
        <li><a href="#">Privacy Policy</a></li>
        <li><a href="#">Cookie Policy</a></li>
        <li><a href="#">Careers</a></li>
        <li><a href="#">X For Business</a></li>
        <li><a href="#">Settings</a></li>
        <li><a href="#">Settings</a></li>
        <li><a href="#">© 2025 X Corp.</a></li>
        </ul>
    </div>

    </div>
  );
};

export default LandingPage;
