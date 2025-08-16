import { useState, useEffect } from "react";
import { xcloneApi } from "../constants/axios";
import { postRequests } from "../constants/requests";
import MainLayout from "../components/MainLayout";
import "../styles/HomePage.css";
import useAppStateContext from "../hooks/useAppStateContext";
import PostComposer from "../components/PostComposer";
import PostComposerInline from "../components/PostComposerInline";
import ImageModal from "../components/ImageModal";
import SinglePost from "../components/SinglePost";
import { transformedPosts } from "../utils/generalFunctions";

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  const { appState, dispatch } = useAppStateContext();
  // Image modal state
  const [showModal, setShowModal] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const posts = appState.posts?.list || [];

  const fetchLiveFeeds = async () => {
    try {
      setLoading(true);

      const response = await xcloneApi.get(postRequests.liveFeeds);

      if (response.data.success) {
        const responses = response.data.body;

        dispatch({
          type: "SET_POSTS",
          payload: {
            list: transformedPosts(responses.feeds),
            pagination: responses.pagination || {},
          },
        });
      } else {
        setError("Failed to fetch live feeds");
      }
    } catch (err) {
      setError("Failed to fetch live feeds");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveFeeds();
  }, []);

  const handleRetweet = (postId) => {
    // Increment retweets for the post
    dispatch({
      type: "RETWEET_POST",
      payload: {
        postId,
      },
    });
  };

  // Image modal handlers
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
    setCurrentImageIndex((prev) =>
      prev === 0 ? modalImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === modalImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!showModal) return;

      if (e.key === "Escape") {
        handleCloseModal();
      } else if (e.key === "ArrowLeft") {
        handlePrevImage();
      } else if (e.key === "ArrowRight") {
        handleNextImage();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [showModal, modalImages.length]);

  return (
    <MainLayout
      onPostClick={() => {
        setIsComposerOpen(true);
      }}
    >
      <div className="feed-header">
        <h2>Home</h2>
      </div>

      <div>
        <PostComposerInline />
      </div>

      <div className="posts-container">
        {loading ? (
          <div className="post">
            <div className="post-content">
              <div className="post-text">Loading feeds...</div>
            </div>
          </div>
        ) : error ? (
          <div className="post">
            <div className="post-content">
              <div className="post-text" style={{ color: "var(--accent-red)" }}>
                {error}
              </div>
            </div>
          </div>
        ) : posts?.length === 0 ? (
          <div className="post">
            <div className="post-content">
              <div className="post-text">
                No posts found. Be the first to post!
              </div>
            </div>
          </div>
        ) : (
          posts?.map((post) => (
            <SinglePost
              key={post.id}
              post={post}
              firstAlphabet={post.username?.charAt(0) || "U"}
              onImageClick={handleImageClick}
              onRetweet={handleRetweet}
            />
          ))
        )}
      </div>

      <ImageModal
        images={modalImages}
        isOpen={showModal}
        currentIndex={currentImageIndex}
        onClose={handleCloseModal}
        onNext={handleNextImage}
        onPrev={handlePrevImage}
        onBackgroundClick={handleModalClick}
      />
      {isComposerOpen && (
        <>
          <div
            className="composer-backdrop"
            onClick={() => setIsComposerOpen(false)}
          />
          <PostComposer onClose={() => setIsComposerOpen(false)} />
        </>
      )}
    </MainLayout>
  );
};

export default HomePage;
