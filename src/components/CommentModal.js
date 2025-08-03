import React, { useState } from "react";
import "../styles/CommentModal.css"; 

const CommentModal = ({ onClose, onSubmit }) => {
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (comment.trim()) {
      onSubmit(comment.trim());
      setComment("");
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
        <div className="modal-container">
            <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment..."
            />
            <div className="modal-actions">
            <button className="modal-button cancel" onClick={onClose}>
                Cancel
            </button>
            <button className="modal-button submit" onClick={handleSubmit}>
                Submit
            </button>
            </div>
        </div>
        </div>
    );
    };


export default CommentModal;
