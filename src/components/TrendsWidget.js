import React from "react";
import PropTypes from "prop-types";

const TrendsWidget = ({ trends, loading, error, formatPostCount }) => {
  return (
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
              {trend.category || "Trending"}
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
  );
};

TrendsWidget.propTypes = {
  trends: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  formatPostCount: PropTypes.func.isRequired,
};

export default TrendsWidget;
