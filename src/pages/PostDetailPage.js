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
} from "react-icons/fa";
import { PiSealCheckFill } from "react-icons/pi";
import PollComponentDetail from "../components/PollComponentDetail";
import PostLikeComponent from "../components/PostLikeComponent";

const PostDetailPage = () => {
  const { postId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [poll, setPoll] = useState(null);
  const navigate = useNavigate();

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
          });
        }
      } catch (err) {
        console.error("Failed to fetch poll:", err);
      }
    };

    fetchAnalytics();
    fetchPoll();
  }, [postId]);

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

          {analytics.media_urls.length > 0 && (
            <div className="post-media">
              {analytics.media_urls.map((url, idx) => (
                <img src={url} alt={`media-${idx}`} key={idx} />
              ))}
            </div>
          )}

          {poll && (
            <div style={{ marginTop: "1rem" }}>
              <PollComponentDetail post={{ ...analytics, poll }} />
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
            <div className="post-detail-action">
              <FaRegComment className="post-detail-icon" />
              <span>{analytics.comment_count}</span>
            </div>
            <div className="post-detail-action">
              <FaRetweet className="post-detail-icon" />
              <span>{analytics.retweet_count}</span>
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
                <div className="comment-content">{comment.content}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

export default PostDetailPage;
