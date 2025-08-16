import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { xcloneApi } from "../constants/axios";
import { postRequests } from "../constants/requests";
import MainLayout from "../components/MainLayout";
import "../styles/ComingSoon.css";
import "../styles/ExplorePage.css";
import ImageModal from "../components/ImageModal";
import NoResults from "../components/NoResults";
import UserCardList from "../components/UserCardList";
import SinglePost from "../components/SinglePost";

const ExplorePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Top');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [loading, setLoading] = useState(true); // Start with loading true for initial data fetch
    const [error, setError] = useState(null);

    // Image modal state
    const [showModal, setShowModal] = useState(false);
    const [modalImages, setModalImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Get search query from URL params and load default data
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const query = urlParams.get('q');
        if (query) {
            setSearchQuery(query);
            performSearch(query);
        } else {
            // Load default data with empty query
            performSearch('');
        }
    }, [location.search]);

    const performSearch = async (query) => {
        try {
            setLoading(true);
            setError(null);

            // Get auth token from localStorage
            const user = localStorage.getItem("user");
            const token = user ? JSON.parse(user).token : null;

            // Call API with query parameter (empty string for default data)
            const response = await xcloneApi.get(`${postRequests.generalSearch}?q=${encodeURIComponent(query)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setSearchResults(response.data);
            } else {
                setError('Failed to load data');
            }
        } catch (err) {
            console.error('Search error:', err);
            setError('Failed to load data');
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
        // Perform search with the current query (can be empty for default data)
        performSearch(searchQuery.trim());
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearchSubmit(e);
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        setError(null);
        navigate('/explore');
        // Load default data
        performSearch('');
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
    const handleLike = (postId) => {
        return;
    };

    const handleRetweet = (postId) => {
        return;
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

                {/* Search Results */}
                <div className="search-results-page">
                    {/* Search Tabs */}
                    <div className="search-tabs-main">
                        {['Top', 'Latest', 'People'].map(tab => (
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
                            <div className="search-loading">
                                {searchQuery ? 'Searching...' : 'Loading content...'}
                            </div>
                        ) : error ? (
                            <div className="search-error">{error}</div>
                        ) : searchResults ? (
                                <>
                                    {/* People Results */}
                                    {(activeTab === 'Top' || activeTab === 'People') && searchResults.users && searchResults.users.length > 0 && (
                                        <UserCardList users={searchResults.users} />
                                    )}


                                    {/* Posts Results */}
                                    {(activeTab === 'Top' || activeTab === 'Latest') && searchResults.posts && searchResults.posts.length > 0 && (
                                        <div className="search-section-main">
                                            <h3>Posts</h3>
                                            {searchResults.posts.map(post => (
                                                <SinglePost
                                                    key={post.id}
                                                    post={post}
                                                    firstAlphabet={post.username?.charAt(0) || "U"}
                                                    onImageClick={handleImageClick}
                                                    onLike={handleLike}
                                                    onRetweet={handleRetweet}
                                                />

                                            ))}
                                        </div>
                                    )}

                                    {/* No Results */}
                                    {((activeTab === 'People' && (!searchResults.users || searchResults.users.length === 0)) ||
                                        (activeTab === 'Latest' && (!searchResults.posts || searchResults.posts.length === 0)) ||
                                        (activeTab === 'Top' && (!searchResults.users || searchResults.users.length === 0) && (!searchResults.posts || searchResults.posts.length === 0))) && (
                                            <NoResults query={searchQuery} />
                                        )}

                                </>
                            ) : (
                                <div className="search-loading">
                                    {searchQuery ? 'No results found' : 'No content available'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            {/* Image Modal */}

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

export default ExplorePage;
