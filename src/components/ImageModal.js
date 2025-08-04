import React from "react";
import PropTypes from "prop-types";

const ImageModal = ({
  images,
  isOpen,
  currentIndex,
  onClose,
  onNext,
  onPrev,
  onBackgroundClick,
}) => {
  if (!isOpen || !images || images.length === 0) return null;

  return (
    <div className="image-modal" onClick={onBackgroundClick}>
      <div className="image-modal-content">
        <button className="image-modal-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        {images.length > 1 && (
          <>
            <button className="image-modal-nav image-modal-prev" onClick={onPrev}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <button className="image-modal-nav image-modal-next" onClick={onNext}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </>
        )}

        <img
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
        />

        {images.length > 1 && (
          <div className="image-modal-counter">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
};

ImageModal.propTypes = {
  images: PropTypes.array.isRequired,
  isOpen: PropTypes.bool.isRequired,
  currentIndex: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  onBackgroundClick: PropTypes.func.isRequired,
};

export default ImageModal;
