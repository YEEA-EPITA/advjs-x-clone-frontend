export const userRequests = {
  login: "/api/auth/login",
  logout: "/api/auth/logout",
  register: "/api/auth/register",
};

export const postRequests = {
  fetcahAllPosts: "/api/posts",
  createPost: "/api/posts",
  trendingHashtags: "/api/posts/trending/hashtags",
  liveFeeds: "/api/posts/live-feeds",
  likePost: (postId) => `/api/posts/${postId}/like`,
};

export const pollRequests = {
  votePoll: `/api/polls/vote`,
};


export const notificationRequests = {
  fetchAll: "/api/notifications",
};