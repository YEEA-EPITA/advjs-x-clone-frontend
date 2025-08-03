import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAppStateContext from "../hooks/useAppStateContext";
import { useTheme } from "../context/ThemeContext";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { appState, dispatch } = useAppStateContext();
  const { theme, toggleTheme } = useTheme();

  const firstAlphabet = appState.user?.email?.charAt(0);

  const handleLogout = () => {
    dispatch({ type: "Logout" });
    navigate("/auth");
  };

  const navigationItems = [
    { path: "/home", icon: "fas fa-home", label: "Home" },
    { path: "/explore", icon: "fas fa-hashtag", label: "Explore" },
    { path: "/notifications", icon: "fas fa-bell", label: "Notifications" },
    { path: "/messages", icon: "fas fa-envelope", label: "Messages" },
    { path: "/profile", icon: "fas fa-user", label: "Profile" },
    { path: "/more", icon: "fas fa-ellipsis-h", label: "More" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <div className="logo-container" onClick={() => navigate("/home")}>
          <img src="/assets/x-logo.png" alt="X" className="sidebar-logo" />
        </div>

        {navigationItems.map((item) => (
          <div
            key={item.path}
            className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
            onClick={() => handleNavigation(item.path)}
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </div>
        ))}
        
        <div className="nav-item" onClick={toggleTheme}>
          <i className={`fas ${theme === "dark" ? "fa-sun" : "fa-moon"}`}></i>
          <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </div>

        <button className="post-button">Post</button>

        <div className="user-profile">
          <div className="user-info">
            <div className="compose-avatar">
              <div className="avatar-placeholder">{firstAlphabet}</div>
            </div>
            <div className="user-details">
              <div className="user-name">
                {appState?.user?.username || "User"}
              </div>
              <div className="user-email">
                {appState?.user?.email || "user@example.com"}
              </div>
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
