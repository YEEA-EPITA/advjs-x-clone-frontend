import React from 'react';
import PostMedia from './PostMedia';

const Post = ({ 
  post, 
  firstAlphabet, 
  onImageClick, 
  onLike 
}) => {
  return (
    <div className="post">
      <div className="compose-avatar">
        <div className="avatar-placeholder">{firstAlphabet}</div>
      </div>
      <div className="post-content">
        <div className="post-header">
          <span className="post-name">{post.name}</span>
          <span className="post-username">@{post.username}</span>
          <span className="post-time">· {post.time}</span>
          {post.location && (
            <span className="post-location">📍 {post.location}</span>
          )}
        </div>
        <div className="post-text">{post.text}</div>

        {/* Media Images */}
        <PostMedia 
          mediaUrls={post.media_urls} 
          onImageClick={onImageClick} 
        />

        {/* Poll */}
        {post.poll && (
          <div className="poll-container">
            <div className="poll-question">{post.poll.question}</div>
            {post.poll.options.map((option, index) => (
              <div key={index} className="poll-option">
                <div className="poll-option-text">{option.text}</div>
                <div className="poll-option-bar">
                  <div
                    className="poll-option-fill"
                    style={{ width: `${option.percentage}%` }}
                  ></div>
                </div>
                <div className="poll-option-percentage">{option.percentage}%</div>
              </div>
            ))}
            <div className="poll-info">
              {post.poll.totalVotes} votes · {post.poll.timeLeft}
            </div>
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.map((tag, index) => (
              <span key={index} className="post-tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="post-actions">
          <div className="action-item">
            <i className="fas fa-comment"></i>
            <span>{post.comments}</span>
          </div>
          <div className="action-item">
            <i className="fas fa-retweet"></i>
            <span>{post.retweets}</span>
          </div>
          <div
            className="action-item"
            onClick={() => onLike(post.id)}
            style={{
              color: post.likes > 0 ? "var(--accent-red)" : "inherit",
            }}
          >
            <i className="fas fa-heart"></i>
            <span>{post.likes}</span>
          </div>
          <div className="action-item">
            <i className="fas fa-share"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
