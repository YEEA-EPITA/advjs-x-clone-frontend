import React, { useState } from 'react';
import PostComposer from '../components/PostComposer';
import '../styles/HomeTestPage.css';

const HomePage = () => {
  const [showComposer, setShowComposer] = useState(false);

  return (
    <div className="home-container">
      <h1 className="home-title">Home</h1>
      <button className="open-composer-btn" onClick={() => setShowComposer(true)}>
        Post
      </button>

      {showComposer && (
        <div className="modal-backdrop">
          <PostComposer onClose={() => setShowComposer(false)} />
        </div>
      )}
    </div>
  );
};

export default HomePage;
