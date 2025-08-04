import React from "react";
import PropTypes from "prop-types";

const NoResults = ({ query }) => {
  return (
    <div className="no-results">
      <div className="no-results-icon">
        <i className="fas fa-search"></i>
      </div>
      <h3>No results for "{query}"</h3>
      <p>Try searching for something else.</p>
    </div>
  );
};

NoResults.propTypes = {
  query: PropTypes.string.isRequired,
};

export default NoResults;
