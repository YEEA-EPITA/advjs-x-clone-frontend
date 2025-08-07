import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import PollShowComponent from "./PollShowComponent";
import PostTags from "./PostTags";
import PostMedia from "./PostMedia";
import PostLikeComponent from "./PostLikeComponent";
import ConfirmationModal from "./ConfirmationModal";
import AlertModal from "./AlertModal";
import { useNavigate } from "react-router-dom";
import { xcloneApi } from "../constants/axios";
import useAppStateContext from "../hooks/useAppStateContext";

const SinglePost = ({ post, firstAlphabet = "U", onImageClick, onRetweet }) => {
  const navigate = useNavigate();
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { appState, dispatch } = useAppStateContext();
  const socket = appState.socket;
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "error",
  });
  const menuRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [loading, setLoading] = useState(false);

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
    // e.stopPropagation();
    // setShowDeleteMenu(false);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await xcloneApi.delete(`/api/posts/${post.id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      // Only close the confirmation modal after successful deletion
      setShowDeleteConfirm(false);
      setAlertConfig({
        title: "Success",
        message: "Post deleted successfully!",
        type: "success",
      });
      setShowAlert(true);
    } catch (error) {
      // Keep the confirmation modal open on error
      setAlertConfig({
        title: "Error",
        message: error.response?.data?.message || "Failed to delete post",
        type: "error",
      });
      setShowAlert(true);
    }
    setLoading(false);
  };

  const handleCancelDelete = () => {
    // Don't allow canceling while deletion is in progress
    if (loading) return;
    setShowDeleteConfirm(false);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const toggleDeleteMenu = (e) => {
    e.stopPropagation();
    setShowDeleteMenu(!showDeleteMenu);
  };

  // socket event listener for post deletion
  useEffect(() => {
    if (!socket || !post?.id) return;

    const updatePostsList = (updatedPost) => {
      if (updatedPost.postId !== post.id) return;
      dispatch({
        type: "SET_POSTS",
        payload: {
          list: appState.posts.list.filter((p) => p.id !== post.id),
          pagination: appState.posts.pagination,
        },
      });
    };

    socket.on("postDeleted", updatePostsList);
    return () => socket.off("postDeleted", updatePostsList);
  }, [socket, post?.id]);

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
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="post-text" onClick={(e) => handlePostClick(e, post.id)}>
          {post.text || post.content}
        </div>

        <PollShowComponent post={post} />

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
        confirmText={loading ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        type="danger"
        loading={loading}
        disableCancel={loading}
      />

      {/* Custom Alert Modal */}
      <AlertModal
        isOpen={showAlert}
        onClose={handleCloseAlert}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
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
