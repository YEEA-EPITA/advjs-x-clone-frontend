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

const transformedPosts = (feed) => {
  if (!feed) return [];

  if (Array.isArray(feed)) {
    return feed.map((f) => transformedPosts(f));
  }

  return {
    id: feed.id,
    name: feed.username,
    userId: feed.user_id,
    username: feed.username,
    time: formatTimeAgo(feed.created_at),
    text: feed.content,
    comments: feed.comment_count,
    retweets: feed.retweet_count,
    like_count: feed.like_count,
    location: feed.location,
    hashtags: feed.hashtags,
    mentions: feed.mentions,
    poll: feed.poll,
    media_urls: feed.media_urls,
    liked_by_me: feed.liked_by_me,
  };
};

export { formatTimeAgo, transformedPosts };
