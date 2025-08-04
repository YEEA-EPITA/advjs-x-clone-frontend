import React from "react";
import MainLayout from "../components/MainLayout";
import "../styles/ComingSoon.css";

const MorePage = () => {
  return (
    <MainLayout>
      <div className="feed-header">
        <h2>More</h2>
      </div>
      
      <div className="page-content">
        <div className="coming-soon">
          <div className="coming-soon-icon">
            <i className="fas fa-ellipsis-h"></i>
          </div>
          <h3>More Options</h3>
          <p>Additional features and settings</p>
          <span className="coming-soon-badge">Coming Soon</span>
        </div>
      </div>
    </MainLayout>
  );
};

export default MorePage;
