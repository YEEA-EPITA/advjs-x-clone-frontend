import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { xcloneApi } from '../constants/axios';
import { postRequests, userSuggestions } from '../constants/requests';
import '../styles/RightSidebar.css';

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

  // Suggestions state
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);
  const [suggestionsError, setSuggestionsError] = useState(null);

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
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setSuggestionsLoading(true);
        setSuggestionsError(null);
        
        // Get auth token from localStorage
        const user = localStorage.getItem("user");
        const token = user ? JSON.parse(user).token : null;
        
        const response = await xcloneApi.get(userSuggestions.followSuggestions, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          setSuggestions(response.data.suggestions || []);
        } else {
          setSuggestionsError('Failed to fetch suggestions');
        }
      } catch (err) {
        console.error('Error fetching suggestions:', err);
        setSuggestionsError('Failed to fetch suggestions');
      } finally {
        setSuggestionsLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

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

  const formatPostCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const handleFollow = async (userId) => {
    try {
      // Get auth token from localStorage
      const user = localStorage.getItem("user");
      const token = user ? JSON.parse(user).token : null;
      
      // You can implement the follow API call here
      // For now, just update the UI
      setSuggestions(prevSuggestions => 
        prevSuggestions.filter(suggestion => suggestion._id !== userId)
      );
    } catch (err) {
      console.error('Error following user:', err);
    }
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
      <div className="trends-widget">
          <h3>What's happening</h3>
          {loading ? (
            <div className="trend-item">
              <div className="trend-category">Loading...</div>
              <div className="trend-name">Fetching trends</div>
            </div>
          ) : error ? (
            <div className="trend-item">
              <div className="trend-category">Error</div>
              <div className="trend-name">{error}</div>
            </div>
          ) : trends.length > 0 ? (
            trends.map((trend, index) => (
              <div key={index} className="trend-item">
                <div className="trend-category">
                  {trend.category || 'Trending'}
                </div>
                <div className="trend-name">
                  {trend.hashtag || trend.name || `#${trend.tag}`}
                </div>
                <div className="trend-posts">
                  {formatPostCount(trend.usageCount || 0)} posts
                </div>
              </div>
            ))
          ) : (
            <div className="trend-item">
              <div className="trend-category">No trends</div>
              <div className="trend-name">No trending topics found</div>
            </div>
          )}
        </div>
      
      <div className="suggestions-widget">
        <h3>Who to follow</h3>
        {suggestionsLoading ? (
          <div className="suggestion-item">
            <div className="suggestion-avatar">
              <div className="avatar-placeholder"></div>
            </div>
            <div className="suggestion-info">
              <div className="suggestion-name">Loading...</div>
              <div className="suggestion-username">Fetching suggestions</div>
            </div>
            <button className="follow-button" disabled>Follow</button>
          </div>
        ) : suggestionsError ? (
          <div className="suggestion-item">
            <div className="suggestion-info">
              <div className="suggestion-name">Error</div>
              <div className="suggestion-username">{suggestionsError}</div>
            </div>
          </div>
        ) : suggestions.length > 0 ? (
          suggestions.slice(0, 3).map((suggestion) => (
            <div key={suggestion._id} className="suggestion-item">
              <div className="suggestion-avatar">
                <img 
                  src={suggestion.profilePicture || "https://via.placeholder.com/40"} 
                  alt="User avatar" 
                />
              </div>
              <div className="suggestion-info">
                <div className="suggestion-name">
                  {suggestion.displayName || suggestion.username}
                </div>
                <div className="suggestion-username">
                  @{suggestion.username}
                </div>
                {suggestion.followersCount !== undefined && (
                  <div className="suggestion-followers">
                    {formatPostCount(suggestion.followersCount)} followers
                  </div>
                )}
              </div>
              <button 
                className="follow-button"
                onClick={() => handleFollow(suggestion._id)}
              >
                Follow
              </button>
            </div>
          ))
        ) : (
          <div className="suggestion-item">
            <div className="suggestion-info">
              <div className="suggestion-name">No suggestions</div>
              <div className="suggestion-username">No users to follow found</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
