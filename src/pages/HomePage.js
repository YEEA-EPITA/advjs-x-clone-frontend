import React, { useState } from 'react';
import PostComposer from '../components/PostComposer';

const HomePage = () => {
  const [showComposer, setShowComposer] = useState(false);

  return (
    <div>
      <h1>Home</h1>
      <button onClick={() => setShowComposer(true)}>Post</button>

      {showComposer && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg w-[90%] max-w-xl shadow-lg relative">
            <button
              onClick={() => setShowComposer(false)}
              className="absolute top-2 right-2 text-gray-600"
            >
              ✕
            </button>
            <PostComposer onClose={() => setShowComposer(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
