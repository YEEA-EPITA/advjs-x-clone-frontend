import React from "react";
// ...existing code...

const UserListModal = ({
  isOpen,
  onClose,
  title,
  loading,
  users,
  emptyMessage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="user-list-modal-overlay">
      <div className="user-list-modal">
        <div className="user-list-modal-header">
          <h3>{title}</h3>
          <button className="user-list-modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="user-list-modal-content">
          {loading ? (
            <div>Loading...</div>
          ) : users.length === 0 ? (
            <div>{emptyMessage}</div>
          ) : (
            <ul className="user-list-modal-list">
              {users.map((user) => (
                <li key={user._id} className="user-list-modal-item">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="avatar"
                      className="user-list-modal-avatar"
                    />
                  ) : (
                    <div className="user-list-modal-avatar-placeholder">
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span>@{user.username}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserListModal;
