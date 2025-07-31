import React, { useState } from 'react';

const Retweet = ({ tweetId, initialCount, isRetweeted }) => {
  const [count, setCount] = useState(initialCount);
  const [retweeted, setRetweeted] = useState(isRetweeted);

  const handleRetweet = () => {
    setRetweeted(!retweeted);
    setCount(prev => prev + (retweeted ? -1 : 1));
    // TODO: API call to backend here
  };

  return (
    <button onClick={handleRetweet} style={{ color: 'green', fontWeight: 'bold' }}>
      🔁 {retweeted ? 'Undo Retweet' : 'Retweet'} ({count})
    </button>
  );
};

export default Retweet;
