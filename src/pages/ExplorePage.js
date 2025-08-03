import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { xcloneApi } from "../constants/axios";
import { postRequests } from "../constants/requests";
import MainLayout from "../components/MainLayout";
import "../styles/ComingSoon.css";
import "../styles/ExplorePage.css";

const ExplorePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Top');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Image modal state
  const [showModal, setShowModal] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get search query from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const query = urlParams.get('q');
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [location.search]);

  const performSearch = async (query) => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError(null);

      // Get auth token from localStorage
      const user = localStorage.getItem("user");
      const token = user ? JSON.parse(user).token : null;

      const response = await xcloneApi.get(`${postRequests.generalSearch}?q=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setSearchResults(response.data);
      } else {
        setError('Search failed');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    // Update URL without triggering navigation
    const newUrl = query ? `/explore?q=${encodeURIComponent(query)}` : '/explore';
    window.history.replaceState({}, '', newUrl);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
    setError(null);
    navigate('/explore');
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
      <div className="explore-page">
        {/* Header with search */}
        <div className="explore-header">
          <div className="search-container-main">
            <form onSubmit={handleSearchSubmit} className="search-form">
              <div className="search-input-wrapper">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  placeholder="Search Twitter"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onKeyPress={handleKeyPress}
                  className="search-input-main"
                />
                {searchQuery && (
                  <button type="button" onClick={clearSearch} className="clear-search">
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Search Results or Default Content */}
        {searchResults ? (
          <div className="search-results-page">
            {/* Search Tabs */}
            <div className="search-tabs-main">
              {['Top', 'Latest', 'People', 'Media', 'Lists'].map(tab => (
                <button
                  key={tab}
                  className={`search-tab-main ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search Content */}
            <div className="search-content-main">
              {loading ? (
                <div className="search-loading">Searching...</div>
              ) : error ? (
                <div className="search-error">{error}</div>
              ) : (
                <>
                  {/* People Results */}
                  {(activeTab === 'Top' || activeTab === 'People') && searchResults.users && searchResults.users.length > 0 && (
                    <div className="search-section-main">
                      <h3>People</h3>
                      {searchResults.users.map(user => (
                        <div key={user.id} className="user-result-main">
                          <div className="user-avatar-main">
                            {user.profilePicture ? (
                              <img src={user.profilePicture} alt={user.displayName} />
                            ) : (
                              <div className="avatar-placeholder-main">
                                {user.displayName?.charAt(0) || user.username?.charAt(0) || 'U'}
                              </div>
                            )}
                          </div>
                          <div className="user-info-main">
                            <div className="user-display-name-main">
                              {user.displayName || user.username}
                              <i className="fas fa-check-circle verified-icon"></i>
                            </div>
                            <div className="user-username-main">@{user.username}</div>
                            {user.bio && <div className="user-bio-main">{user.bio}</div>}
                            <div className="user-stats">
                              <span>{user.followersCount} followers</span>
                              <span>{user.followingCount} following</span>
                            </div>
                          </div>
                          <button className="follow-btn-main">Follow</button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Posts Results */}
                  {(activeTab === 'Top' || activeTab === 'Latest') && searchResults.posts && searchResults.posts.length > 0 && (
                    <div className="search-section-main">
                      <h3>Posts</h3>
                      {searchResults.posts.map(post => (
                        <div key={post.id} className="post-result-main">
                          <div className="post-avatar-main">
                            <div className="avatar-placeholder-main">
                              {post.username?.charAt(0) || 'U'}
                            </div>
                          </div>
                          <div className="post-content-main">
                            <div className="post-header-main">
                              <span className="post-username-main">@{post.username}</span>
                              <span className="post-time-main">
                                · {new Date(post.created_at).toLocaleDateString()}
                              </span>
                              {post.location && (
                                <span className="post-location-main">📍 {post.location}</span>
                              )}
                            </div>
                            <div className="post-text-main">{post.content}</div>
                            
                            {/* Hashtags */}
                            {post.hashtags && post.hashtags.length > 0 && (
                              <div className="post-hashtags">
                                {post.hashtags.map(tag => (
                                  <span key={tag} className="hashtag-main">#{tag}</span>
                                ))}
                              </div>
                            )}

                            {/* Media */}
                            {post.media_urls && post.media_urls.length > 0 && (
                              <div className="post-media">
                                {post.media_urls.length === 1 ? (
                                  <div className="single-image">
                                    <img
                                      src={post.media_urls[0]}
                                      alt="Post media"
                                      className="post-image"
                                      onClick={() => handleImageClick(post.media_urls, 0)}
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                      }}
                                    />
                                  </div>
                                ) : post.media_urls.length === 2 ? (
                                  <div className="two-images">
                                    {post.media_urls.map((url, index) => (
                                      <img
                                        key={index}
                                        src={url}
                                        alt={`Post media ${index + 1}`}
                                        className="post-image"
                                        onClick={() => handleImageClick(post.media_urls, index)}
                                        onError={(e) => {
                                          e.target.style.display = 'none';
                                        }}
                                      />
                                    ))}
                                  </div>
                                ) : post.media_urls.length === 3 ? (
                                  <div className="three-images">
                                    <div className="main-image">
                                      <img
                                        src={post.media_urls[0]}
                                        alt="Post media 1"
                                        className="post-image"
                                        onClick={() => handleImageClick(post.media_urls, 0)}
                                        onError={(e) => {
                                          e.target.style.display = 'none';
                                        }}
                                      />
                                    </div>
                                    <div className="side-images">
                                      {post.media_urls.slice(1).map((url, index) => (
                                        <img
                                          key={index + 1}
                                          src={url}
                                          alt={`Post media ${index + 2}`}
                                          className="post-image"
                                          onClick={() => handleImageClick(post.media_urls, index + 1)}
                                          onError={(e) => {
                                            e.target.style.display = 'none';
                                          }}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="four-images">
                                    {post.media_urls.slice(0, 4).map((url, index) => (
                                      <img
                                        key={index}
                                        src={url}
                                        alt={`Post media ${index + 1}`}
                                        className="post-image"
                                        onClick={() => handleImageClick(post.media_urls, index)}
                                        onError={(e) => {
                                          e.target.style.display = 'none';
                                        }}
                                      />
                                    ))}
                                    {post.media_urls.length > 4 && (
                                      <div className="more-images-overlay">
                                        +{post.media_urls.length - 4} more
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                            
                            <div className="post-stats-main">
                              <span><i className="fas fa-comment"></i> {post.comment_count}</span>
                              <span><i className="fas fa-retweet"></i> {post.retweet_count}</span>
                              <span><i className="fas fa-heart"></i> {post.like_count}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* No Results */}
                  {((activeTab === 'People' && (!searchResults.users || searchResults.users.length === 0)) ||
                    (activeTab === 'Latest' && (!searchResults.posts || searchResults.posts.length === 0)) ||
                    (activeTab === 'Top' && (!searchResults.users || searchResults.users.length === 0) && (!searchResults.posts || searchResults.posts.length === 0))) && (
                    <div className="no-results">
                      <div className="no-results-icon">
                        <i className="fas fa-search"></i>
                      </div>
                      <h3>No results for "{searchQuery}"</h3>
                      <p>Try searching for something else.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          // Default Explore Content
          <div className="explore-default">
            <div className="coming-soon">
              <div className="coming-soon-icon">
                <i className="fas fa-hashtag"></i>
              </div>
              <h3>Explore</h3>
              <p>Search for users, posts, and discover trending topics</p>
              <span className="coming-soon-badge">Search to get started</span>
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {showModal && (
        <div className="image-modal" onClick={handleModalClick}>
          <div className="image-modal-content">
            <button className="image-modal-close" onClick={handleCloseModal}>
              <i className="fas fa-times"></i>
            </button>
            
            {modalImages.length > 1 && (
              <>
                <button className="image-modal-nav image-modal-prev" onClick={handlePrevImage}>
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button className="image-modal-nav image-modal-next" onClick={handleNextImage}>
                  <i className="fas fa-chevron-right"></i>
                </button>
              </>
            )}
            
            <img
              src={modalImages[currentImageIndex]}
              alt={`Image ${currentImageIndex + 1}`}
            />
            
            {modalImages.length > 1 && (
              <div className="image-modal-counter">
                {currentImageIndex + 1} / {modalImages.length}
              </div>
            )}
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default ExplorePage;
