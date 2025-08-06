import { useState, useEffect } from 'react';

const useImageModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageClick = (images, clickedIndex) => {
    setModalImages(images);
    setCurrentImageIndex(clickedIndex);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalImages([]);
    setCurrentImageIndex(0);
  };

  const handlePrevImage = () => {
    if (modalImages.length === 0) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? modalImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (modalImages.length === 0) return;
    setCurrentImageIndex((prev) => 
      prev === modalImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleModalClick = (e) => {
    // Close modal if clicked outside the image
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!showModal) return;

      switch (event.key) {
        case 'Escape':
          handleCloseModal();
          break;
        case 'ArrowLeft':
          handlePrevImage();
          break;
        case 'ArrowRight':
          handleNextImage();
          break;
        default:
          break;
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  return {
    showModal,
    modalImages,
    currentImageIndex,
    handleImageClick,
    handleCloseModal,
    handlePrevImage,
    handleNextImage,
    handleModalClick
  };
};

export default useImageModal;
