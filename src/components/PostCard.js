import React from "react";
import PropTypes from "prop-types";
import PostMedia from "../components/PostMedia";
import PostTags from "./PostTags";

const PostCard = ({ post, onImageClick }) => {
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
          <span><i className="fas fa-retweet"></i> {post.retweet_count}</span>
          <span><i className="fas fa-heart"></i> {post.like_count}</span>
        </div>
      </div>
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.object.isRequired,
  onImageClick: PropTypes.func.isRequired,
};

export default PostCard;
