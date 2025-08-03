import React from "react";
import MainLayout from "../components/MainLayout";
import "../styles/ComingSoon.css";

const NotificationsPage = () => {
  return (
    <MainLayout>
      <div className="feed-header">
        <h2>Notifications</h2>
      </div>
      
      <div className="page-content">
        <div className="coming-soon">
          <div className="coming-soon-icon">
            <i className="fas fa-bell"></i>
          </div>
          <h3>Notifications</h3>
          <p>Stay updated with likes, retweets, mentions, and follows</p>
          <span className="coming-soon-badge">Coming Soon</span>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotificationsPage;
