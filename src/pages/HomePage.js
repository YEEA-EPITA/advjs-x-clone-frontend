import React, { useState, useEffect } from "react";
import { xcloneApi } from "../constants/axios";
import { postRequests } from "../constants/requests";
import MainLayout from "../components/MainLayout";
import "./HomePage.css";
import useAppStateContext from "../hooks/useAppStateContext";
import PostComposer from "../components/PostComposer";
import PostComposerInline from "../components/PostComposerInline";
import PollShowComponent from "../components/PollShowComonent";

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  const { appState, dispatch } = useAppStateContext();

  console.log("AppState:", appState); // Debug log

  const posts = appState.posts?.list || [];

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
            likes: feed.like_count,
            location: feed.location,
            hashtags: feed.hashtags,
            mentions: feed.mentions,
            poll: feed.poll,
            media_urls: feed.media_urls,
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

    fetchLiveFeeds();
  }, []);

  // // Socket listener for live feed updates
  // useEffect(() => {
  //   if (!socket) return;

  //   socket.on("new_feed", (data) => {
  //     console.log("Live feed:", data);
  //   });

  //   return () => {
  //     socket.off("new_feed");
  //   };
  // }, [socket]);

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

  const handleLike = (postId) => {
    dispatch({
      type: "LIKE_POST",
      payload: {
        postId,
      },
    });
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
            <div key={post.id} className="post">
              <div className="compose-avatar">
                <div className="avatar-placeholder">
                  {post?.username.charAt(0)}
                </div>
              </div>
              <div className="post-content">
                <div className="post-header">
                  <span className="post-name">{post.name}</span>
                  <span className="post-username">@{post.username}</span>
                  <span className="post-time">· {post.time}</span>
                  {post.location && (
                    <span className="post-location">📍 {post.location}</span>
                  )}
                </div>
                <div className="post-text">{post.text}</div>

                {/* Poll Component */}
                <PollShowComponent post={post} />

                {/* Hashtags and Mentions */}
                {(post.hashtags?.length > 0 || post.mentions?.length > 0) && (
                  <div className="post-tags">
                    {post.hashtags?.map((tag) => (
                      <span key={tag} className="hashtag">
                        #{tag}
                      </span>
                    ))}
                    {post.mentions?.map((mention) => (
                      <span key={mention} className="mention">
                        @{mention}
                      </span>
                    ))}
                  </div>
                )}

                <div className="post-actions">
                  <div className="action-item">
                    <i className="fas fa-comment"></i>
                    <span>{post.comments}</span>
                  </div>
                  <div
                    className="action-item"
                    onClick={() => handleRetweet(post.id)}
                  >
                    <i className="fas fa-retweet"></i>
                    <span>{post.retweets}</span>
                  </div>
                  <div
                    className="action-item"
                    onClick={() => handleLike(post.id)}
                    style={{
                      color: post.likes > 0 ? "var(--accent-red)" : "inherit",
                    }}
                  >
                    <i className="fas fa-heart"></i>
                    <span>{post.likes}</span>
                  </div>
                  <div className="action-item">
                    <i className="fas fa-share"></i>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
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
