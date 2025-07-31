import React from 'react';
import TweetCard from './components/TweetCard';

function App() {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <TweetCard
        tweetId="tweet-123"
        author="john_doe"
        content="This is a tweet without Tailwind!"
        createdAt="2025-07-31T14:00:00Z"
        retweetCount={2}
        isRetweeted={false}
      />
    </div>
  );
}

export default App;
