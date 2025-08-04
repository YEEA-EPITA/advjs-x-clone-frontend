import React from "react";
import MainLayout from "../components/MainLayout";
import "../styles/ComingSoon.css";

const MessagesPage = () => {
  return (
    <MainLayout>
      <div className="feed-header">
        <h2>Messages</h2>
      </div>
      
      <div className="page-content">
        <div className="coming-soon">
          <div className="coming-soon-icon">
            <i className="fas fa-envelope"></i>
          </div>
          <h3>Messages</h3>
          <p>Send private messages to other users</p>
          <span className="coming-soon-badge">Coming Soon</span>
        </div>
      </div>
    </MainLayout>
  );
};

export default MessagesPage;
