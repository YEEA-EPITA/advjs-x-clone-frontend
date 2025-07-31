import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAppStateContext from '../hooks/useAppStateContext';
import { useTheme } from '../context/ThemeContext';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const { appState, dispatch } = useAppStateContext();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    dispatch({ type: "Logout" });
    navigate("/auth");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <div className="logo-container">
          <img src="/assets/x-logo.png" alt="X" className="sidebar-logo" />
        </div>
        
        <div className="nav-item active">
          <i className="fas fa-home"></i>
          <span>Home</span>
        </div>
        <div className="nav-item">
          <i className="fas fa-hashtag"></i>
          <span>Explore</span>
        </div>
        <div className="nav-item">
          <i className="fas fa-bell"></i>
          <span>Notifications</span>
        </div>
        <div className="nav-item">
          <i className="fas fa-envelope"></i>
          <span>Messages</span>
        </div>
        <div className="nav-item">
          <i className="fas fa-bookmark"></i>
          <span>Bookmarks</span>
        </div>
        <div className="nav-item">
          <i className="fas fa-user"></i>
          <span>Profile</span>
        </div>
        <div className="nav-item">
          <i className="fas fa-ellipsis-h"></i>
          <span>More</span>
        </div>
        <div className="nav-item" onClick={toggleTheme}>
          <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </div>
        
        <button className="post-button">Post</button>
        
        <div className="user-profile">
          <div className="user-info">
            <div className="user-avatar">
              <img src="https://via.placeholder.com/40" alt="User avatar" />
            </div>
            <div className="user-details">
              <div className="user-name">{appState?.user?.username || 'User'}</div>
              <div className="user-email">{appState?.user?.email || 'user@example.com'}</div>
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
