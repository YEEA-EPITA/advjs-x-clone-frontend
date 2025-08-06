import React, { useState } from "react";
import Modal from "./Modal";
import RetweetComponent from "./RetweetComponent";
import RepliesSection from "./RepliesSection";
import axios from "../constants/axios";
import PropTypes from "prop-types";
import PostMedia from "../components/PostMedia";
import PostTags from "./PostTags";

const PostCard = ({ post, onImageClick }) => {
  const [showRetweet, setShowRetweet] = useState(false);
  const [postContent, setPostContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [retweetCount, setRetweetCount] = useState(post.retweet_count || 0);
  const [retweeted, setRetweeted] = useState(false); // You may want to get this from user data

  const handleOpenRetweet = async () => {
    setShowRetweet(true);
    setLoading(true);
    setError("");
    try {
      // Fetch the latest post data for context
      const res = await axios.get(`/posts/${post._id}`);
      setPostContent(res.data.post || res.data);
    } catch (err) {
      setError("Failed to load post content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-result-main">
      <div className="post-avatar-main">
        <div className="avatar-placeholder-main">
          {post.username?.charAt(0) || "U"}
        </div>
      </div>

      <div className="post-content-main">
        <div className="post-header-main">
          <span className="post-username-main">@{post.username}</span>
          <span className="post-time-main">
            · {new Date(post.created_at).toLocaleDateString()}
          </span>
          {post.location && (
            <span className="post-location-main">📍 {post.location}</span>
          )}
        </div>

        <div className="post-text-main">{post.content}</div>

        {/* Hashtags & Mentions */}
        <PostTags hashtags={post.hashtags} mentions={post.mentions} />

        {/* Media */}
        <PostMedia mediaUrls={post.media_urls} onImageClick={onImageClick} />

        <div className="post-stats-main">
          <span><i className="fas fa-comment"></i> {post.comment_count}</span>
          <span style={{ cursor: 'pointer', color: retweeted ? '#1da1f2' : 'inherit' }} onClick={handleOpenRetweet}>
            <i className="fas fa-retweet"></i> {retweetCount}
          </span>
          <span><i className="fas fa-heart"></i> {post.like_count}</span>
        </div>

        <Modal isOpen={showRetweet} onClose={() => setShowRetweet(false)}>
          {loading ? (
            <div>Loading post...</div>
          ) : error ? (
            <div style={{ color: 'red' }}>{error}</div>
          ) : postContent ? (
            <>
              <div className="retweet-original-post" style={{ marginBottom: 16, padding: 12, background: '#f5f5f5', borderRadius: 6 }}>
                <div><b>{postContent.title || "Untitled Post"}</b></div>
                <div>{postContent.content || postContent.text || "No content."}</div>
                <div style={{ fontSize: 12, color: '#888' }}>{postContent.createdAt ? new Date(postContent.createdAt).toLocaleString() : ""}</div>
              </div>
              <RetweetComponent
                postId={post._id}
                initialRetweeted={retweeted}
                initialCount={retweetCount}
                onRetweet={() => { setRetweeted(true); setRetweetCount(c => c + 1); }}
                onUnretweet={() => { setRetweeted(false); setRetweetCount(c => Math.max(0, c - 1)); }}
                onSuccess={() => setShowRetweet(false)}
                onCancel={() => setShowRetweet(false)}
              />
            </>
          ) : null}
        </Modal>

        {/* Replies Section */}
        <RepliesSection postId={post._id} />
      </div>
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.object.isRequired,
  onImageClick: PropTypes.func.isRequired,
};

export default PostCard;
