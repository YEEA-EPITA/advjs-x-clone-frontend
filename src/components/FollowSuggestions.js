import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import { xcloneApi } from '../constants/axios';
import { userSuggestions } from '../constants/requests';

const FollowSuggestions = () => {
    // Suggestions state
    const [suggestions, setSuggestions] = useState([]);
    const [suggestionsLoading, setSuggestionsLoading] = useState(true);
    const [suggestionsError, setSuggestionsError] = useState(null);


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
                    setSuggestions(response.data.body.suggestions || []);
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
    console.log("Suggestions:", suggestions);
    return (
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
                        <div className="compose-avatar">
                            <div className="avatar-placeholder">{suggestion.username?.charAt(0) || "U"}</div>
                        </div>
                        <div className="suggestion-info">
                            <div className="suggestion-name">
                                {suggestion.displayName || suggestion.username}
                            </div>
                            <div className="suggestion-username">@{suggestion.username}</div>
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
    );
};

FollowSuggestions.propTypes = {
    //   suggestions: PropTypes.array.isRequired,
    suggestionsLoading: PropTypes.bool,
    suggestionsError: PropTypes.string,
    formatPostCount: PropTypes.func.isRequired,
    handleFollow: PropTypes.func.isRequired,
};

export default FollowSuggestions;
