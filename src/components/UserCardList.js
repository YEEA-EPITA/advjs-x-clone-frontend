import React from "react";
import PropTypes from "prop-types";

const UserCardList = ({ users }) => {
  if (!users || users.length === 0) return null;

  return (
    <div className="search-section-main">
      <h3>People</h3>
      {users.map((user) => (
        <div key={user.id} className="user-result-main">
          <div className="user-avatar-main">
            {user.profilePicture ? (
              <img src={user.profilePicture} alt={user.displayName} />
            ) : (
              <div className="avatar-placeholder-main">
                {user.displayName?.charAt(0) || user.username?.charAt(0) || "U"}
              </div>
            )}
          </div>
          <div className="user-info-main">
            <div className="user-display-name-main">
              {user.displayName || user.username}
              <i className="fas fa-check-circle verified-icon"></i>
            </div>
            <div className="user-username-main">@{user.username}</div>
            {user.bio && <div className="user-bio-main">{user.bio}</div>}
            <div className="user-stats">
              <span>{user.followersCount} followers</span>
              <span>{user.followingCount} following</span>
            </div>
          </div>
          <button className="follow-btn-main">Follow</button>
        </div>
      ))}
    </div>
  );
};

UserCardList.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.any.isRequired,
      username: PropTypes.string.isRequired,
      displayName: PropTypes.string,
      profilePicture: PropTypes.string,
      bio: PropTypes.string,
      followersCount: PropTypes.number,
      followingCount: PropTypes.number,
    })
  ).isRequired,
};

export default UserCardList;
