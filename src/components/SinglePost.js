import React from "react";
import PropTypes from "prop-types";
import PollShowComponent from "./PollShowComponent";
import PostTags from "./PostTags";
import PostMedia from "./PostMedia";
import PostLikeComponent from "./PostLikeComponent";
import {useNavigate} from 'react-router-dom'


const SinglePost = ({
  post,
  firstAlphabet = "U",
  onImageClick,
  onRetweet,
}) => {
    const navigate = useNavigate()
    const handlePostClick = (e, postId) => {
        if (!e?.target) return; 
        const ignore = e.target.closest(".no-nav");
        if (!ignore) {
            navigate(`/posts/${postId}`);
        }
        };
  return (
    <div className="post">
      <div className="compose-avatar">
        <div className="avatar-placeholder">{firstAlphabet}</div>
      </div>
      <div className="post-content" onClick={(e) => handlePostClick(e, post.id)}>
        <div className="post-header">
          <span className="post-name">{post.name}</span>
          <span className="post-username">@{post.username}</span>
          <span className="post-time">· {post.time}</span>
          {post.location && (
            <span className="post-location">📍 {post.location}</span>
          )}
        </div>

        <div className="post-text">{post.text}</div>

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
    </div>
  );
};

SinglePost.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.any.isRequired,
    name: PropTypes.string,
    username: PropTypes.string,
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
};

export default SinglePost;
