import React, { useState, useEffect } from 'react';

const Replies = ({ tweetId }) => {
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState('');

  useEffect(() => {
    // TODO: Fetch replies from backend
    setReplies([
      { id: '1', author: 'alice', content: 'Nice post!', createdAt: '2025-07-31T14:00:00Z' },
      { id: '2', author: 'bob', content: 'Totally agree.', createdAt: '2025-07-31T14:10:00Z' }
    ]);
  }, [tweetId]);

  const handleReplySubmit = () => {
    if (!newReply.trim()) return;

    const reply = {
      id: `temp-${Date.now()}`,
      author: 'You',
      content: newReply,
      createdAt: new Date().toISOString(),
    };

    setReplies([reply, ...replies]);
    setNewReply('');
    // TODO: POST to backend
  };

  return (
    <div style={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
      <h3>Replies</h3>

      <textarea
        rows="3"
        value={newReply}
        onChange={(e) => setNewReply(e.target.value)}
        placeholder="Write a reply..."
        style={{ width: '100%', padding: '5px', marginBottom: '10px' }}
      />

      <button onClick={handleReplySubmit} style={{ background: '#007bff', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '4px' }}>
        Reply
      </button>

      <ul style={{ marginTop: '15px', listStyle: 'none', paddingLeft: 0 }}>
        {replies.map((reply) => (
          <li key={reply.id} style={{ border: '1px solid #ddd', padding: '8px', marginBottom: '10px' }}>
            <strong>{reply.author}</strong>: {reply.content}
            <div style={{ fontSize: '12px', color: 'gray' }}>
              {new Date(reply.createdAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Replies;
