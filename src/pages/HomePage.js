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
  const socket = appState?.socket;

  const fetchLiveFeeds = async () => {
    try {
      setLoading(true);

      // Get auth token from localStorage
      const user = localStorage.getItem("user");
      const token = user ? JSON.parse(user).token : null;

      const response = await xcloneApi.get(postRequests.liveFeeds, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const responses = response.data.body;
        dispatch({
          type: "SET_POSTS",
          payload: {
            list: responses.feeds || [],
            pagination: responses.pagination || {},
          },
        });
        // Transform API data to match our component structure
        const transformedPosts = responses.feeds.map((feed) => ({
          id: feed.id,
          name: feed.username, // Using username as display name
          username: feed.username,
          time: formatTimeAgo(feed.created_at),
          text: feed.content,
          comments: feed.comment_count,
          retweets: feed.retweet_count,
          like_count: feed.like_count,
          location: feed.location,
          hashtags: feed.hashtags,
          mentions: feed.mentions,
          poll: feed.poll,
          media_urls: feed.media_urls,
          liked_by_me: feed.liked_by_me,
        }));

        dispatch({
          type: "SET_POSTS",
          payload: {
            list: transformedPosts,
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

  // Socket listener for live feed updates
  useEffect(() => {
    if (!socket) return;

    socket.on("new_feed", (data) => {
      fetchLiveFeeds();
    });

    return () => {
      socket.off("new_feed");
    };
  }, [socket]);

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - postDate) / (1000 * 60));

    if (diffInMinutes < 1) return "now";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
  };

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
        ) : posts.length === 0 ? (
          <div className="post">
            <div className="post-content">
              <div className="post-text">
                No posts found. Be the first to post!
              </div>
            </div>
          </div>
        ) : (
          posts.map((post) => (
            <SinglePost
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
