import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { xcloneApi } from '../constants/axios';
import { postRequests, userSuggestions } from '../constants/requests';
import '../styles/RightSidebar.css';
import TrendsWidget from './TrendsWidget';
import FollowSuggestions from './FollowSuggestions';

const RightSidebar = () => {
    const navigate = useNavigate();
    const [trends, setTrends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const [activeTab, setActiveTab] = useState('Top');

    const formatPostCount = (count) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`;
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`;
        }
        return count.toString();
    };

    useEffect(() => {
        const fetchTrends = async () => {
            try {
                setLoading(true);
                const response = await xcloneApi.get(`${postRequests.trendingHashtags}?limit=5&hours=48`);

                if (response.data.success) {
                    setTrends(response.data.trends || []);
                } else {
                    setError('Failed to fetch trends');
                }
            } catch (err) {
                console.error('Error fetching trends:', err);
                setError('Failed to fetch trends');
            } finally {
                setLoading(false);
            }
        };

        fetchTrends();
    }, []);

    // Fetch who to follow suggestions
    // useEffect(() => {
    //     const fetchSuggestions = async () => {
    //         try {
    //             setSuggestionsLoading(true);
    //             setSuggestionsError(null);

    //             // Get auth token from localStorage
    //             const user = localStorage.getItem("user");
    //             const token = user ? JSON.parse(user).token : null;

    //             const response = await xcloneApi.get(userSuggestions.followSuggestions, {
    //                 headers: {
    //                     'Authorization': `Bearer ${token}`
    //                 }
    //             });

    //             if (response.data.success) {
    //                 setSuggestions(response.data.suggestions || []);
    //             } else {
    //                 setSuggestionsError('Failed to fetch suggestions');
    //             }
    //         } catch (err) {
    //             console.error('Error fetching suggestions:', err);
    //             setSuggestionsError('Failed to fetch suggestions');
    //         } finally {
    //             setSuggestionsLoading(false);
    //         }
    //     };

    //     fetchSuggestions();
    // }, []);

    // Search functionality
    const handleSearch = async (query) => {
        if (!query.trim()) {
            setSearchResults(null);
            return;
        }

        try {
            setSearchLoading(true);
            setSearchError(null);

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
                setSearchError('Search failed');
            }
        } catch (err) {
            console.error('Search error:', err);
            setSearchError('Search failed');
        } finally {
            setSearchLoading(false);
        }
    };

    const handleSearchInputChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Don't trigger automatic search, just update the input
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Navigate to explore page with search query
            navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
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
        setSearchError(null);
    };



    return (
        <div className="right-sidebar">
            {/* Search Section */}
            <div className="search-section">
                <form onSubmit={handleSearchSubmit} className="search-container">
                    <div className="search-input-wrapper">
                        <i className="fas fa-search search-icon"></i>
                        <input
                            type="text"
                            placeholder="Search Twitter"
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                            onKeyPress={handleKeyPress}
                            className="search-input"
                        />
                        {searchQuery && (
                            <button onClick={clearSearch} className="clear-search">
                                <i className="fas fa-times"></i>
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Trends Section */}
            <TrendsWidget
                trends={trends}
                loading={loading}
                error={error}
                formatPostCount={formatPostCount}
            />


            <FollowSuggestions
                
            />

        </div>
    );
};

export default RightSidebar;
