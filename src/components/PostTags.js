import React from "react";
import PropTypes from "prop-types";

const PostTags = ({ hashtags = [], mentions = [] }) => {
  if (hashtags.length === 0 && mentions.length === 0) return null;

  return (
    <div className="post-tags">
      {hashtags.map((tag) => (
        <span key={tag} className="hashtag">
          #{tag}
        </span>
      ))}
      {mentions.map((mention) => (
        <span key={mention} className="mention">
          @{mention}
        </span>
      ))}
    </div>
  );
};

PostTags.propTypes = {
  hashtags: PropTypes.arrayOf(PropTypes.string),
  mentions: PropTypes.arrayOf(PropTypes.string),
};

export default PostTags;
