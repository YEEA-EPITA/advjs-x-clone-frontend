import React from "react";
import MainLayout from "../components/MainLayout";
import useAppStateContext from "../hooks/useAppStateContext";
import "../styles/ComingSoon.css";

const ProfilePage = () => {
  const { appState } = useAppStateContext();
  const firstAlphabet = appState.user?.email?.charAt(0);

  return (
    <MainLayout>
      <div className="feed-header">
        <h2>Profile</h2>
      </div>
      
      <div className="page-content">
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-placeholder-large">{firstAlphabet}</div>
          </div>
          <div className="profile-info">
            <h3>{appState?.user?.username || "User"}</h3>
            <p>@{appState?.user?.username || "username"}</p>
            <span className="profile-email">{appState?.user?.email}</span>
          </div>
        </div>
        
        <div className="coming-soon">
          <div className="coming-soon-icon">
            <i className="fas fa-user"></i>
          </div>
          <h3>Profile Settings</h3>
          <p>Edit your profile, view your posts, and manage your account</p>
          <span className="coming-soon-badge">Coming Soon</span>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
