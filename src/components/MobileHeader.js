import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import useAppStateContext from "../hooks/useAppStateContext";
import "./MobileHeader.css";

const MobileHeader = ({ title = "Home" }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { appState, dispatch } = useAppStateContext();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    dispatch({ type: "Logout" });
    navigate("/auth");
    setShowMenu(false);
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="mobile-header">
      <div className="mobile-header-content">
        <div className="mobile-header-left">
          <img
            src="/assets/x-logo.png"
            alt="X"
            className="mobile-header-logo"
          />
        </div>

        <div className="mobile-header-center">
          <h1 className="mobile-header-title">{title}</h1>
        </div>

        <div className="mobile-header-right">
          <button
            className="mobile-theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <i className={`fas ${theme === "dark" ? "fa-sun" : "fa-moon"}`}></i>
          </button>

          <div className="mobile-menu-container">
            <button
              className="mobile-menu-button"
              onClick={toggleMenu}
              aria-label="Open menu"
            >
              <div className="mobile-user-avatar">
                <div className="avatar-placeholder">
                  {appState.user?.email?.charAt(0) || "U"}
                </div>
              </div>
            </button>

            {showMenu && (
              <div className="mobile-menu-dropdown">
                <div
                  className="mobile-menu-item"
                  onClick={() => navigate("/profile")}
                >
                  <i className="fas fa-user"></i>
                  <span>Profile</span>
                </div>
                <div
                  className="mobile-menu-item"
                  onClick={() => navigate("/settings")}
                >
                  <i className="fas fa-cog"></i>
                  <span>Settings</span>
                </div>
                <div className="mobile-menu-divider"></div>
                <div className="mobile-menu-item logout" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Logout</span>
                </div>
              </div>
            )}

            {showMenu && (
              <div
                className="mobile-menu-overlay"
                onClick={() => setShowMenu(false)}
              ></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;
