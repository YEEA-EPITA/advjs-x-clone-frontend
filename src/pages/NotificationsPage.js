import React, { useState } from "react";
import MainLayout from "../components/MainLayout";
import mockNotifications from "../data/mockNotifications";
import "../styles/NotificationsPage.css";
import {
  faAt,
  faHeart,
  faRetweet,
  faUserPlus,
  faRightToBracket,
  faKey,
  faComment,
  faReply,
  faGear, 
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const typeIconMap = {
  mention: faAt,
  like: faHeart,
  retweet: faRetweet,
  follow: faUserPlus,
  login: faRightToBracket,
  password: faKey,
  comment: faComment,
  thread: faReply,
};

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState("all");

  const filtered = mockNotifications.filter((n) =>
    activeTab === "mentions" ? n.type === "mention" : true
  );

  return (
    <MainLayout>
      <div className="notifications-container">
        <div className="notifications-header">
           <div className="notifications-header-row">
                <h2>Notifications</h2>
                <FontAwesomeIcon icon={faGear} className="settings-icon" />
            </div>


          <div className="notification-tabs-bar">
            <div
              className={`tab-item ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All
              {activeTab === "all" && <div className="tab-underline" />}
            </div>
            <div
              className={`tab-item ${activeTab === "mentions" ? "active" : ""}`}
              onClick={() => setActiveTab("mentions")}
            >
              Mentions
              {activeTab === "mentions" && <div className="tab-underline" />}
            </div>
          </div>
        </div>

        <ul className="notification-list">
          {filtered.map((n) => (
            <li key={n.id} className="notification-item">
              <div className="notification-icon-avatar">
                <div className="notification-left-icon">
                  <FontAwesomeIcon
                    icon={typeIconMap[n.type] || faComment}
                    style={{ color: "#1DA1F2" }}
                  />
                </div>
                <div className="notification-avatar">
                  <div className="avatar-placeholder">
                    {n.user?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                </div>
              </div>
              <div className="notification-content">
                <div className="notification-text">
                  <strong>{n.user}</strong>: {n.message}
                </div>
                <div className="notification-time">{n.time}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </MainLayout>
  );
};

export default NotificationsPage;
