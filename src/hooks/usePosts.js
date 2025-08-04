import { useState, useEffect } from 'react';
import { xcloneApi } from '../constants/axios';
import { postRequests } from '../constants/requests';

const usePosts = (socket) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMilliseconds = now - postDate;
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) {
      return "now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    }
    return `${diffInDays}d`;
  };

  const handleTweet = (tweetText, setTweetText) => {
    if (tweetText.trim()) {
      const newPost = {
        id: posts.length + 1,
        name: "You",
        username: "you",
        time: "now",
        text: tweetText,
        comments: 0,
        retweets: 0,
        likes: 0,
      };
      setPosts([newPost, ...posts]);
      setTweetText("");
    }
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes > 0 ? 0 : 1 }
        : post
    ));
  };

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
          const feeds = response.data.body.feeds || [];
          // Transform API data to match our component structure
          const transformedPosts = feeds.map((feed) => ({
            id: feed.id,
            name: feed.username, // Using username as display name
            username: feed.username,
            time: formatTimeAgo(feed.created_at),
            text: feed.content,
            comments: feed.comment_count,
            retweets: feed.retweet_count,
            likes: feed.like_count,
            media_urls: feed.media_urls,
            hashtags: feed.hashtags,
            location: feed.location,
          }));
          setPosts(transformedPosts);
        } else {
          setError("Failed to fetch feeds");
        }

        // Add some sample data for demonstration
        setPosts((prevPosts) => [
          ...prevPosts,
          {
            id: 999,
            name: "John Doe",
            username: "johndoe",
            time: "2h",
            text: "Just shipped a new feature! Really excited about how this turned out. 🚀",
            comments: 12,
            retweets: 5,
            likes: 24,
          },
        ]);
      } catch (err) {
        console.error("Error fetching live feeds:", err);
        setError("Failed to fetch feeds");
      } finally {
        setLoading(false);
      }
    };

    fetchLiveFeeds();
  }, []);

  // Socket listener for live feed updates
  useEffect(() => {
    if (!socket) return;

    socket.on("new_feed", (data) => {
      console.log("Live feed:", data);
    });

    return () => {
      socket.off("new_feed");
    };
  }, [socket]);

  return {
    posts,
    loading,
    error,
    handleTweet,
    handleLike
  };
};

export default usePosts;
