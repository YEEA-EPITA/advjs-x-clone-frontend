import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";
import { useTheme } from "../context/ThemeContext";

const RegisterPage = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className={`container ${theme === "dark" ? "dark-mode" : "light-mode"}`}>
      <div className="logo-section">
        <img src="/assets/x-logo.png" alt="X Logo" className="x-logo" />
      </div>

      <div className="auth-section">
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === "light" ? "🌙 Dark" : "☀️ Light"} Mode
        </button>

        <h1 className="title">Create your account</h1>

        <button className="social-button google">Sign up with Google</button>
        <button className="social-button apple">Sign up with Apple</button>

        <div className="or-divider">or</div>

        <RegisterForm />

        <div className="switch-link">
          Already have an account?{" "}
          <span onClick={() => navigate("/auth/login")}>Sign in</span>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
