import React from "react";
import PropTypes from "prop-types";

const Poll = ({ poll }) => {
  if (!poll) return null;

  return (
    <div className="poll-container">
      <h4>{poll.question}</h4>
      <div className="poll-options">
        {poll.options.map((option) => (
          <div key={option.id} className="poll-option">
            <span>{option.option_text}</span>
            <span className="poll-votes">
              {option.vote_count} votes
            </span>
          </div>
        ))}
      </div>
      <div className="poll-info">
        {poll.voted ? "✅ You voted" : "⏱️ Poll active"} • Expires:{" "}
        {new Date(poll.expires_at).toLocaleDateString()}
      </div>
    </div>
  );
};

Poll.propTypes = {
  poll: PropTypes.shape({
    question: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        option_text: PropTypes.string,
        vote_count: PropTypes.number,
      })
    ).isRequired,
    voted: PropTypes.bool,
    expires_at: PropTypes.string,
  }).isRequired,
};

export default Poll;
