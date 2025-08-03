import React, { useState } from "react";
import "../styles/CommentModal.css";

const CommentModal = ({ onClose, onSubmit, post }) => {
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content);
      setContent("");
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="reply-modal">
        <button className="close-button" onClick={onClose}>×</button>

        <div className="reply-to">
          <span className="replying">Replying to @{post?.username}</span>
          <div className="original-content">{post?.content}</div>
        </div>

        <textarea
          className="reply-input"
          placeholder="Post your reply"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="button-row">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="submit-btn" onClick={handleSubmit}>Reply</button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
