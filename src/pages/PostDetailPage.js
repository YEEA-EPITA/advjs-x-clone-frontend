import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import { xcloneApi } from "../constants/axios";
import { postRequests } from "../constants/requests";
import "../styles/PostDetailPage.css";
import {
  FaArrowLeft,
  FaRegComment,
  FaRetweet,
  FaHeart,
  FaShare,
  FaQuoteRight,
} from "react-icons/fa";
import { PiSealCheckFill } from "react-icons/pi";
import PostLikeComponent from "../components/PostLikeComponent";
import PollShowComponent from "../components/PollShowComponent";
import "../components/PollShowComponent.css";
import useAppStateContext from "../hooks/useAppStateContext";
import CommentModal from "../components/CommentModal"; 
import PostComposer from "../components/PostComposer";

const PostDetailPage = () => {
  const { postId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [poll, setPoll] = useState(null);
  const navigate = useNavigate();
  const { appState } = useAppStateContext();
  const [showCommentModal, setShowCommentModal] = useState(false); 
  const [showComposer, setShowComposer] = useState(false);
  const [retweetSource, setRetweetSource] = useState(null);
  const [showRetweetMenu, setShowRetweetMenu] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await xcloneApi.get(postRequests.postAnalytics(postId));
        if (response.data.success) {
          setAnalytics(response.data.analytics);
        }
      } catch (error) {
        console.error("Error fetching post analytics", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPoll = async () => {
      try {
        const response = await xcloneApi.get(postRequests.getPollByPostId(postId));
        if (response.data.success) {
          const pollData = response.data.poll;
          const options = response.data.options;

          setPoll({
            ...pollData,
            options: options || [],
            total_votes:
              options?.reduce((sum, opt) => sum + (opt.vote_count || 0), 0) || 0,
            voted: !!appState.pollVotes?.[pollData.id], 
            selected_option_id: appState.pollVotes?.[pollData.id] || null, 
          });
        }
      } catch (err) {
        console.error("Failed to fetch poll:", err);
      }
    };

    fetchAnalytics();
    fetchPoll();
  }, [postId, appState.pollVotes]);

  const handleSubmitComment = async (content) => {
  try {
    const token = JSON.parse(localStorage.getItem("user"))?.token;
    const response = await xcloneApi.post(
      postRequests.addComment(postId),
      { content },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.success) {
      const newComment = response.data.comment;

      setAnalytics((prev) => ({
        ...prev,
        comment_count: prev.comment_count + 1,
        comments: [newComment, ...(prev.comments || [])],
      }));
    }
  } catch (err) {
    console.error("Failed to submit comment", err);
  }
};

const formatTimeAgo = (dateString) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInMinutes = Math.floor((now - past) / (1000 * 60));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

const handleRepost = async () => {
  try {
    const token = JSON.parse(localStorage.getItem("user"))?.token;

    const response = await xcloneApi.post(
      postRequests.retweetPost(postId),
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.data.success) {
      const { retweetCount, isRetweeted } = response.data;

      setAnalytics((prev) => ({
        ...prev,
        retweet_count: retweetCount ?? prev.retweet_count,
        isRetweeted: isRetweeted,
      }));
    }

    setShowRetweetMenu(false);
  } catch (error) {
    console.error("Repost failed:", error);
  }
};

  if (loading) {
    return (
      <MainLayout>
        <div className="post-detail-page">Loading...</div>
      </MainLayout>
    );
  }

  if (!analytics) {
    return (
      <MainLayout>
        <div className="post-detail-page">Post not found.</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="post-detail-page">
        <div className="post-detail-header">
          <FaArrowLeft className="back-icon" onClick={() => navigate("/home")} />
          <span>Post</span>
        </div>

        <div className="post-detail-card">
          <div className="post-user-info">
            <span className="user-initial">
              {(analytics.username?.[0] || "?").toUpperCase()}
            </span>
            <div className="user-meta">
              <div className="user-name-line">
                <span className="user-name">{analytics.username}</span>
                <PiSealCheckFill className="verified-icon" />
                <span className="user-handle">@{analytics.username}</span>
              </div>
              <div className="post-time-location">
                <span>{new Date(analytics.created_at).toLocaleString()}</span>
                {analytics.location && (
                  <span className="post-location">📍 {analytics.location}</span>
                )}
              </div>
            </div>
          </div>

          <div className="post-content-text">{analytics.content}</div>
          
          {analytics?.retweeted_post && (
            <div className="retweet-wrapper">
              <div className="retweet-user">@{analytics.retweeted_post.username}</div>
              <div className="retweet-content">{analytics.retweeted_post.content}</div>

              {analytics.retweeted_post.media_urls?.length > 0 && (
                <div className="retweet-media">
                  {analytics.retweeted_post.media_urls.map((url, idx) => (
                    <img key={idx} src={url} alt="retweet-media" />
                  ))}
                </div>
              )}
            </div>
          )}

          {analytics.media_urls?.length > 0 && (
            <div className="post-media">
              {analytics.media_urls.map((url, idx) => (
                <img src={url} alt={`media-${idx}`} key={idx} />
              ))}
            </div>
          )}
        
          {poll && (
            <div>
              <PollShowComponent post={{ ...analytics, poll }} />
            </div>
          )}

          <div className="post-tags">
            {analytics.hashtags?.map((tag) => (
              <span key={tag} className="hashtag">
                #{tag}
              </span>
            ))}
            {analytics.mentions?.map((mention) => (
              <span key={mention} className="mention">
                @{mention}
              </span>
            ))}
          </div>

          <div className="post-detail-action-bar">
            <div
              className="post-detail-action"
              onClick={() => setShowCommentModal(true)}
            >
              <FaRegComment className="post-detail-icon" />
              <span>{analytics.comment_count}</span>
            </div>

            <div className="post-detail-action retweet-wrapper">
              <FaRetweet
                className="post-detail-icon"
                onClick={() => setShowRetweetMenu(!showRetweetMenu)}
              />
              <span>{analytics.retweet_count ?? 0}</span>


              {showRetweetMenu && (
                <div className="retweet-menu">
                  <div
                    className="retweet-menu-item"
                    onClick={handleRepost}
                  >
                    <FaRetweet className="retweet-menu-icon" />
                    <span>Repost</span>
                  </div>
                  <div
                    className="retweet-menu-item"
                    onClick={() => {
                      setRetweetSource(analytics);
                      setShowComposer(true);
                      setShowRetweetMenu(false);
                    }}
                  >
                    <FaQuoteRight className="retweet-menu-icon" />
                    <span>Quote</span>
                  </div>
                </div>
              )}
            </div>

            <div className="post-detail-action">
              <PostLikeComponent post={analytics} className="post-detail-icon" />
            </div>
            <div className="post-detail-action">
              <FaShare className="post-detail-icon" />
            </div>
          </div>
        </div>

        {analytics.comments?.map((comment, index) => (
          <div key={index} className="comment-item">
            <div className="comment-user-info">
              <span className="user-initial">
                {(comment.username?.[0] || "?").toUpperCase()}
              </span>
              <div className="comment-meta">
                <div className="user-name-line">
                  <span className="user-name">{comment.username}</span>
                  <PiSealCheckFill className="verified-icon" />
                  <span className="user-handle">@{comment.username}</span>
                </div>
                <div className="comment-content">
                  {comment.content}
                  <span className="comment-time"> · {formatTimeAgo(comment.created_at)}</span>
                </div>

              </div>
            </div>
          </div>
        ))}
        
        {showCommentModal && (
          <CommentModal
            onClose={() => setShowCommentModal(false)}
            onSubmit={handleSubmitComment}
            post={analytics}
          />
        )}

        {showComposer && (
          <>
            <div className="composer-backdrop" onClick={() => setShowComposer(false)} />
            <PostComposer
              onClose={() => setShowComposer(false)}
              originalPost={retweetSource}
            />
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default PostDetailPage;
