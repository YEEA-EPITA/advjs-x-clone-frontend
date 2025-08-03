import React from 'react';
import PropTypes from 'prop-types';

const PostMedia = ({ mediaUrls, onImageClick }) => {
  if (!mediaUrls || mediaUrls.length === 0) return null;

  const handleError = (e) => {
    e.target.style.display = 'none';
  };

  if (mediaUrls.length === 1) {
    return (
      <div className="post-media">
        <div className="single-image">
          <img
            src={mediaUrls[0]}
            alt="Post media"
            className="post-image"
            onClick={() => onImageClick(mediaUrls, 0)}
            onError={handleError}
          />
        </div>
      </div>
    );
  }

  if (mediaUrls.length === 2) {
    return (
      <div className="post-media two-images">
        {mediaUrls.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Post media ${index + 1}`}
            className="post-image"
            onClick={() => onImageClick(mediaUrls, index)}
            onError={handleError}
          />
        ))}
      </div>
    );
  }

  if (mediaUrls.length === 3) {
    return (
      <div className="post-media three-images">
        <div className="main-image">
          <img
            src={mediaUrls[0]}
            alt="Post media 1"
            className="post-image"
            onClick={() => onImageClick(mediaUrls, 0)}
            onError={handleError}
          />
        </div>
        <div className="side-images">
          {mediaUrls.slice(1).map((url, index) => (
            <img
              key={index + 1}
              src={url}
              alt={`Post media ${index + 2}`}
              className="post-image"
              onClick={() => onImageClick(mediaUrls, index + 1)}
              onError={handleError}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="post-media four-images">
      {mediaUrls.slice(0, 4).map((url, index) => (
        <img
          key={index}
          src={url}
          alt={`Post media ${index + 1}`}
          className="post-image"
          onClick={() => onImageClick(mediaUrls, index)}
          onError={handleError}
        />
      ))}
      {mediaUrls.length > 4 && (
        <div className="more-images-overlay">
          +{mediaUrls.length - 4} more
        </div>
      )}
    </div>
  );
};

PostMedia.propTypes = {
  mediaUrls: PropTypes.array.isRequired,
  onImageClick: PropTypes.func.isRequired,
};

export default PostMedia;
