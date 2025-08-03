import React, { useState, useEffect } from "react";
import { xcloneApi } from "../constants/axios";
import { postRequests } from "../constants/requests";
import MainLayout from "../components/MainLayout";
import "../styles/HomePage.css";
import useAppStateContext from "../hooks/useAppStateContext";
import ImageModal from "../components/ImageModal"; 
import SinglePost from "../components/SinglePost";

const HomePage = () => {
  const [tweetText, setTweetText] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Image modal state
  const [showModal, setShowModal] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { appState } = useAppStateContext();
  const firstAlphabet = appState.user?.email?.charAt(0);

  const socket = appState.socket;

  useEffect(() => {
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
          const feeds = response.data.body.feeds || [];
          // Transform API data to match our component structure
          const transformedPosts = feeds.map((feed) => ({
            id: feed.id,
            name: feed.username, // Using username as display name
            username: feed.username,
            time: formatTimeAgo(feed.created_at),
            text: feed.content,
            comments: feed.comment_count,
            retweets: feed.retweet_count,
            likes: feed.like_count,
            location: feed.location,
            hashtags: feed.hashtags,
            mentions: feed.mentions,
            poll: feed.poll,
            media_urls: feed.media_urls,
          }));
          setPosts(transformedPosts);
        } else {
          setError("Failed to fetch live feeds");
        }
      } catch (err) {
        console.error("Error fetching live feeds:", err);
        setError("Failed to fetch live feeds");
        // Fallback to mock data
        setPosts([
          {
            id: 1,
            name: "John Doe",
            username: "johndoe",
            time: "2h",
            text: "Just shipped a new feature! Really excited about how this turned out. 🚀",
            comments: 12,
            retweets: 5,
            likes: 24,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveFeeds();
  }, []);

  // Socket listener for live feed updates
  useEffect(() => {
    if (!socket) return;

    socket.on("new_feed", (data) => {
      console.log("Live feed:", data);
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

  const handleTweet = () => {
    if (tweetText.trim()) {
      const newPost = {
        id: posts.length + 1,
        name: "You",
        username: "you",
        time: "now",
        text: tweetText,
        comments: 0,
        retweets: 0,
        likes: 0,
      };
      setPosts([newPost, ...posts]);
      setTweetText("");
    }
  };

  const handleLike = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const handleRetweet = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, retweets: post.retweets + 1 } : post
      )
    );
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
      
      if (e.key === 'Escape') {
        handleCloseModal();
      } else if (e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [showModal, modalImages.length]);

  return (
    <MainLayout>
      <div className="feed-header">
        <h2>Home</h2>
      </div>

      <div className="compose-post">
        <div className="compose-avatar">
          <div className="avatar-placeholder">{firstAlphabet}</div>
        </div>
        <div className="compose-content">
          <textarea
            placeholder="What's happening?"
            rows="3"
            value={tweetText}
            onChange={(e) => setTweetText(e.target.value)}
            maxLength={280}
          ></textarea>
          <div className="compose-actions">
            <div className="compose-icons">
              <i className="fas fa-image"></i>
              <i className="fas fa-poll"></i>
              <i className="fas fa-smile"></i>
              <i className="fas fa-calendar"></i>
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <div className="compose-right">
              <span className="character-count">{280 - tweetText.length}</span>
              <button
                className="post-tweet-button"
                onClick={handleTweet}
                disabled={!tweetText.trim()}
              >
                Post
              </button>
            </div>
          </div>
        </div>
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
                onLike={handleLike}
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

    </MainLayout>
  );
};

export default HomePage;
