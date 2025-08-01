import React, { useState, useEffect } from 'react';
import { xcloneApi } from '../constants/axios';
import { postRequests } from '../constants/requests';
import './RightSidebar.css';

const RightSidebar = () => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setLoading(true);
        const response = await xcloneApi.get(`${postRequests.trendingHashtags}?limit=5&hours=24`);
        
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

  const formatPostCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="right-sidebar">
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
        <div className="suggestion-item">
          <div className="suggestion-avatar">
            <img src="https://via.placeholder.com/40" alt="User avatar" />
          </div>
          <div className="suggestion-info">
            <div className="suggestion-name">React</div>
            <div className="suggestion-username">@reactjs</div>
          </div>
          <button className="follow-button">Follow</button>
        </div>
        <div className="suggestion-item">
          <div className="suggestion-avatar">
            <img src="https://via.placeholder.com/40" alt="User avatar" />
          </div>
          <div className="suggestion-info">
            <div className="suggestion-name">JavaScript</div>
            <div className="suggestion-username">@javascript</div>
          </div>
          <button className="follow-button">Follow</button>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
