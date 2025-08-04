import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <div className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">Happening now</h1>
          <h2 className="hero-subtitle">Join the conversation</h2>
          <p className="hero-description">
            Connect with friends, share your thoughts, and discover what's
            happening in the world right now.
          </p>
          <div className="hero-buttons">
            <button
              className="cta-button primary"
              onClick={() => navigate("/auth")}
            >
              Get started
            </button>
            <button
              className="cta-button secondary"
              onClick={() => navigate("/auth")}
            >
              Sign in
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="mockup-container">
            <div className="phone-mockup">
              <div className="screen">
                <div className="status-bar"></div>
                <div className="mock-content">
                  <div className="mock-post">
                    <div className="mock-avatar"></div>
                    <div className="mock-text">
                      <div className="mock-line long"></div>
                      <div className="mock-line medium"></div>
                      <div className="mock-line short"></div>
                    </div>
                  </div>
                  <div className="mock-post">
                    <div className="mock-avatar"></div>
                    <div className="mock-text">
                      <div className="mock-line medium"></div>
                      <div className="mock-line long"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
