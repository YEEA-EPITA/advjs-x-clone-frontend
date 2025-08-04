import React from 'react';
import Post from './Post';

const PostsContainer = ({ 
  posts, 
  loading, 
  error, 
  firstAlphabet, 
  onImageClick, 
  onLike 
}) => {
  if (loading) {
    return (
      <div className="posts-container">
        <div className="post">
          <div className="post-content">
            <div className="post-text">Loading feeds...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="posts-container">
        <div className="post">
          <div className="post-content">
            <div className="post-text" style={{ color: "var(--accent-red)" }}>
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="posts-container">
        <div className="post">
          <div className="post-content">
            <div className="post-text">
              No posts found. Be the first to post!
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="posts-container">
      {posts.map((post) => (
        <Post
          key={post.id}
          post={post}
          firstAlphabet={firstAlphabet}
          onImageClick={onImageClick}
          onLike={onLike}
        />
      ))}
    </div>
  );
};

export default PostsContainer;
