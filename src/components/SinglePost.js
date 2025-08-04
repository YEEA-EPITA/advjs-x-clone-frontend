import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import PollShowComponent from "./PollShowComponent";
import PostTags from "./PostTags";
import PostMedia from "./PostMedia";
import PostLikeComponent from "./PostLikeComponent";
import ConfirmationModal from "./ConfirmationModal";
import { useNavigate } from "react-router-dom";

const SinglePost = ({
  post,
  firstAlphabet = "U",
  onImageClick,
  onRetweet,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowDeleteMenu(false);
      }
    };

    if (showDeleteMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDeleteMenu]);

  const handlePostClick = (e, postId) => {
    if (!e?.target) return;
    const ignore = e.target.closest(".no-nav");
    if (!ignore) {
      navigate(`/posts/${postId}`);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteMenu(false);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete(post.id);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const toggleDeleteMenu = (e) => {
    e.stopPropagation();
    setShowDeleteMenu(!showDeleteMenu);
  };

  // Check if current user can delete this post (either own post or admin)
  const canDelete = true;
  return (
    <div className="post">
      <div className="compose-avatar">
        <div className="avatar-placeholder">{firstAlphabet}</div>
      </div>
      <div className="post-content">
        <div className="post-header">
          {/* <span className="post-name">{post.name}</span> */}
          <span className="post-username">@{post.username}</span>
          <span className="post-time">· {post.time}</span>
          {post.location && (
            <span className="post-location">📍 {post.location}</span>
          )}
          {canDelete && (
            <div className="post-menu no-nav" ref={menuRef}>
              <button
                className="post-menu-btn"
                onClick={toggleDeleteMenu}
                title="More options"
              >
                <i className="fas fa-ellipsis-h"></i>
              </button>
              {showDeleteMenu && (
                <div className="post-menu-dropdown">
                  <button className="delete-btn" onClick={handleDeleteClick}>
                    <i className="fas fa-trash"></i>
                    Delete post
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="post-text" onClick={(e) => handlePostClick(e, post.id)}>
          {post.text}
        </div>

        <PollShowComponent poll={post} />

        <PostTags hashtags={post.hashtags} mentions={post.mentions} />

        <PostMedia mediaUrls={post.media_urls} onImageClick={onImageClick} />

        <div className="post-actions">
          <div className="action-item">
            <i className="fas fa-comment"></i>
            <span>{post.comments}</span>
          </div>
          <div className="action-item" onClick={() => onRetweet(post.id)}>
            <i className="fas fa-retweet"></i>
            <span>{post.retweets}</span>
          </div>

          <PostLikeComponent className={"action-item"} post={post} />

          <div className="action-item">
            <i className="fas fa-share"></i>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Post?"
        message="This can't be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from search results."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

SinglePost.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.any.isRequired,
    name: PropTypes.string,
    username: PropTypes.string,
    user_id: PropTypes.any,
    time: PropTypes.string,
    location: PropTypes.string,
    text: PropTypes.string,
    media_urls: PropTypes.array,
    poll: PropTypes.object,
    hashtags: PropTypes.array,
    mentions: PropTypes.array,
    comments: PropTypes.number,
    retweets: PropTypes.number,
    likes: PropTypes.number,
  }).isRequired,
  firstAlphabet: PropTypes.string,
  onImageClick: PropTypes.func.isRequired,
  onLike: PropTypes.func.isRequired,
  onRetweet: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  currentUser: PropTypes.shape({
    id: PropTypes.any,
    username: PropTypes.string,
    role: PropTypes.string,
  }),
};

export default SinglePost;
