import { useNavigate, useLocation } from "react-router-dom";
import useAppStateContext from "../hooks/useAppStateContext";
import "../styles/MobileNavbar.css";

const MobileNavbar = ({ onPostClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { appState } = useAppStateContext();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="mobile-navbar">
      <div className="mobile-nav-items">
        <div
          className={`mobile-nav-item ${isActive("/home") ? "active" : ""}`}
          onClick={() => navigate("/home")}
        >
          <i className="fas fa-home"></i>
          <span>Home</span>
        </div>

        <div
          className={`mobile-nav-item ${isActive("/explore") ? "active" : ""}`}
          onClick={() => navigate("/explore")}
        >
          <i className="fas fa-hashtag"></i>
          <span>Explore</span>
        </div>

        <div
          className="mobile-nav-item mobile-post-button"
          onClick={() => {
            onPostClick?.();
          }}
        >
          <i className="fas fa-plus"></i>
        </div>

        <div
          className={`mobile-nav-item ${
            isActive("/notifications") ? "active" : ""
          }`}
          onClick={() => navigate("/notifications")}
        >
          <i className="fas fa-bell"></i>
          <span>Notifications</span>
        </div>

        <div
          className={`mobile-nav-item ${isActive("/profile") ? "active" : ""}`}
          onClick={() => navigate("/profile")}
        >
          <div className="mobile-avatar">
            <div className="avatar-placeholder">
              {appState.user?.email?.charAt(0) || "U"}
            </div>
          </div>
          <span>Profile</span>
        </div>
      </div>
    </div>
  );
};

export default MobileNavbar;
