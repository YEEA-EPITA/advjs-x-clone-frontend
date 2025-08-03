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
  postAnalytics: (postId) => `/api/posts/${postId}/analytics`,
  getPollByPostId: (postId) => `/api/posts/${postId}/polls`, 
  addComment: (postId) => `api/posts/${postId}/comments`,
};

export const pollRequests = {
  votePoll: `/api/polls/vote`,
};


export const notificationRequests = {
  fetchAll: "/api/notifications",
};