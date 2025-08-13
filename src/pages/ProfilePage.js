import React, { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import UserListModal from "../components/UserListModal";
import useAppStateContext from "../hooks/useAppStateContext";
import { useNavigate } from "react-router-dom";
import { xcloneApi } from "../constants/axios";
import "../styles/ComingSoon.css";

const ProfilePage = () => {
  const { appState } = useAppStateContext();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [followersLoading, setFollowersLoading] = useState(false);
  const [followingLoading, setFollowingLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("tweets");
  const [mediaPosts, setMediaPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user info
        const userRes = await xcloneApi.get(`/auth/me`);
        setUserInfo(userRes.data);
        // Fetch user posts
        const postsRes = await xcloneApi.get(`/posts/feed`);
        setUserPosts(postsRes.data.posts || []);
        // Media posts (posts with media)
        setMediaPosts(
          (postsRes.data.posts || []).filter(
            (p) => p.media_urls && p.media_urls.length > 0
          )
        );
        // Fetch liked posts (if endpoint exists, else leave empty)
        try {
          const likesRes = await xcloneApi.get(`/posts/likes`);
          setLikedPosts(likesRes.data.posts || []);
        } catch {}
        // Fetch followers/following
        if (userRes.data._id) {
          const followersRes = await xcloneApi.get(
            `/users/${userRes.data._id}/followers?page=1&limit=25`
          );
          setFollowers(followersRes.data.users || followersRes.data || []);
          const followingRes = await xcloneApi.get(
            `/users/${userRes.data._id}/following?page=1&limit=25`
          );
          setFollowing(followingRes.data.users || followingRes.data || []);
        }
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const firstAlphabet = (userInfo?.email || appState.user?.email || "U")
    .charAt(0)
    .toUpperCase();

  return (
    <MainLayout>
      <div className="feed-header">
        <h2>Profile</h2>
      </div>
      <div className="page-content">
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-placeholder-large">{firstAlphabet}</div>
          </div>
          <div className="profile-info">
            <h3>{userInfo?.username || appState?.user?.username || "User"}</h3>
            <p>
              @{userInfo?.username || appState?.user?.username || "username"}
            </p>
            <span className="profile-email">
              {userInfo?.email || appState?.user?.email}
            </span>
            {userInfo && (
              <>
                <div className="profile-extra">
                  <span>
                    <b>Name:</b> {userInfo.name || "-"}
                  </span>
                  <br />
                  <span>
                    <b>Joined:</b>{" "}
                    {userInfo.createdAt
                      ? new Date(userInfo.createdAt).toLocaleDateString()
                      : "-"}
                  </span>
                  <br />
                  <span>
                    <b>Bio:</b> {userInfo.bio || "No bio yet."}
                  </span>
                </div>
                <div className="profile-stats" style={{ marginTop: 12 }}>
                  <span>
                    <b>{userPosts.length}</b> Tweets
                  </span>
                  <span
                    style={{
                      marginLeft: 16,
                      cursor: "pointer",
                      color: "#1da1f2",
                    }}
                    onClick={async () => {
                      setShowFollowers(true);
                      setFollowersLoading(true);
                      try {
                        if (userInfo?._id) {
                          const followersRes = await xcloneApi.get(
                            `/users/${userInfo._id}/followers?page=1&limit=25`
                          );
                          setFollowers(
                            followersRes.data.users || followersRes.data || []
                          );
                        }
                      } finally {
                        setFollowersLoading(false);
                      }
                    }}
                  >
                    {followers.length} Followers
                  </span>
                  <span
                    style={{
                      marginLeft: 16,
                      cursor: "pointer",
                      color: "#1da1f2",
                    }}
                    onClick={async () => {
                      setShowFollowing(true);
                      setFollowingLoading(true);
                      try {
                        if (userInfo?._id) {
                          const followingRes = await xcloneApi.get(
                            `/users/${userInfo._id}/following?page=1&limit=25`
                          );
                          setFollowing(
                            followingRes.data.users || followingRes.data || []
                          );
                        }
                      } finally {
                        setFollowingLoading(false);
                      }
                    }}
                  >
                    {following.length} Following
                  </span>
                  <UserListModal
                    isOpen={showFollowers}
                    onClose={() => setShowFollowers(false)}
                    title="Followers"
                    loading={followersLoading}
                    users={followers}
                    emptyMessage="No followers yet."
                  />
                  <UserListModal
                    isOpen={showFollowing}
                    onClose={() => setShowFollowing(false)}
                    title="Following"
                    loading={followingLoading}
                    users={following}
                    emptyMessage="Not following anyone yet."
                  />
                </div>
              </>
            )}
            <button
              className="edit-profile-btn"
              onClick={() => navigate("/edit-profile")}
            >
              Edit Profile
            </button>
          </div>
        </div>
        <hr />
        <div
          className="profile-tabs"
          style={{ display: "flex", gap: 24, marginBottom: 16, marginTop: 16 }}
        >
          <span
            style={{
              cursor: "pointer",
              borderBottom:
                activeTab === "tweets" ? "2px solid #1da1f2" : "none",
            }}
            onClick={() => setActiveTab("tweets")}
          >
            Tweets
          </span>
          <span
            style={{
              cursor: "pointer",
              borderBottom:
                activeTab === "media" ? "2px solid #1da1f2" : "none",
            }}
            onClick={() => setActiveTab("media")}
          >
            Media
          </span>
          <span
            style={{
              cursor: "pointer",
              borderBottom:
                activeTab === "likes" ? "2px solid #1da1f2" : "none",
            }}
            onClick={() => setActiveTab("likes")}
          >
            Likes
          </span>
        </div>
        <div className="user-posts-section">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              {activeTab === "tweets" &&
                (userPosts.length === 0 ? (
                  <div>No tweets yet.</div>
                ) : (
                  <ul className="user-posts-list">
                    {userPosts.map((post) => (
                      <li key={post._id} className="user-post-item">
                        <div>
                          <b>{post.title || "Untitled Post"}</b>
                        </div>
                        <div>{post.content || post.text || "No content."}</div>
                        <div className="user-post-date">
                          {post.createdAt
                            ? new Date(post.createdAt).toLocaleString()
                            : ""}
                        </div>
                      </li>
                    ))}
                  </ul>
                ))}
              {activeTab === "media" &&
                (mediaPosts.length === 0 ? (
                  <div>No media posts yet.</div>
                ) : (
                  <ul className="user-posts-list">
                    {mediaPosts.map((post) => (
                      <li key={post._id} className="user-post-item">
                        <div>
                          <b>{post.title || "Untitled Post"}</b>
                        </div>
                        <div>{post.content || post.text || "No content."}</div>
                        <div className="user-post-date">
                          {post.createdAt
                            ? new Date(post.createdAt).toLocaleString()
                            : ""}
                        </div>
                        {post.media_urls &&
                          post.media_urls.map((url, i) => (
                            <img
                              key={i}
                              src={url}
                              alt="media"
                              style={{ maxWidth: 120, marginTop: 8 }}
                            />
                          ))}
                      </li>
                    ))}
                  </ul>
                ))}
              {activeTab === "likes" &&
                (likedPosts.length === 0 ? (
                  <div>No liked posts yet.</div>
                ) : (
                  <ul className="user-posts-list">
                    {likedPosts.map((post) => (
                      <li key={post._id} className="user-post-item">
                        <div>
                          <b>{post.title || "Untitled Post"}</b>
                        </div>
                        <div>{post.content || post.text || "No content."}</div>
                        <div className="user-post-date">
                          {post.createdAt
                            ? new Date(post.createdAt).toLocaleString()
                            : ""}
                        </div>
                      </li>
                    ))}
                  </ul>
                ))}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
