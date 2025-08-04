import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <header className="header">
      <div className="nav-container">
        <div className="logo">
          <img src="/assets/x-logo.png" alt="X Logo" className="logo-img" />
        </div>
        <nav className="nav-menu">
          <div className="nav-items">
            <a href="#features" className="nav-link">
              Features
            </a>
            <a href="#about" className="nav-link">
              About
            </a>
            <a href="#help" className="nav-link">
              Help
            </a>
          </div>
          <div className="nav-buttons">
            <button
              className="nav-btn login-btn"
              onClick={() => navigate("/auth")}
            >
              Log in
            </button>
            <button
              className="nav-btn signup-btn"
              onClick={() => navigate("/auth")}
            >
              Sign up
            </button>
          </div>
        </nav>
        <div className="mobile-menu-toggle">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
