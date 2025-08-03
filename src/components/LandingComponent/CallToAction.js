import { useNavigate } from "react-router-dom";

const CallToAction = () => {
  const navigate = useNavigate();
  return (
    <section className="cta-section">
      <div className="cta-container">
        <h3 className="cta-title">Ready to join the conversation?</h3>
        <p className="cta-description">
          Sign up today and start connecting with millions of people worldwide
        </p>
        <button className="cta-button-large" onClick={() => navigate("/auth")}>
          Create your account
        </button>
      </div>
    </section>
  );
};

export default CallToAction;
