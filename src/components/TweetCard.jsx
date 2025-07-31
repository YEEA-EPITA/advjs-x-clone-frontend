import React from 'react';
import Retweet from './Retweet';
import Replies from './Replies';

const TweetCard = ({ tweetId, author, content, createdAt, retweetCount, isRetweeted }) => {
  return (
    <div style={{
      border: '1px solid #ccc',
      padding: '15px',
      marginBottom: '20px',
      borderRadius: '6px',
      background: '#f9f9f9'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontWeight: 'bold' }}>@{author}</span>
        <span style={{ fontSize: '12px', color: 'gray' }}>
          {new Date(createdAt).toLocaleString()}
        </span>
      </div>

      <p style={{ marginBottom: '12px' }}>{content}</p>

      <div style={{ marginBottom: '10px' }}>
        <Retweet tweetId={tweetId} initialCount={retweetCount} isRetweeted={isRetweeted} />
      </div>

      <Replies tweetId={tweetId} />
    </div>
  );
};

export default TweetCard;
