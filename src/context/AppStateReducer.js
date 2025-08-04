const AppStateReducer = (state, action) => {
  switch (action.type) {
    case "Login":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };

    case "Logout":
      localStorage.removeItem("user");
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        socket: null,
      };

    case "SET_SOCKET":
      return {
        ...state,
        socket: action.payload,
      };

    case "SET_POSTS":
      return {
        ...state,
        posts: {
          list: action.payload.list || [],
          pagination: action.payload.pagination || {},
        },
      };

    case "VOTE_POLL":
      // This should only be used when the current user votes
      return {
        ...state,
        posts: {
          ...state.posts,
          list: state.posts.list.map((post) =>
            post.id === action.payload.postId
              ? {
                  ...post,
                  poll: {
                    ...post.poll,
                    voted: true,
                    selected_option_id: action.payload.optionId,
                    options: post.poll.options.map((option) =>
                      option.id === action.payload.optionId
                        ? { ...option, vote_count: option.vote_count + 1 }
                        : option
                    ),
                  },
                }
              : post
          ),
        },
      };

    case "USER_VOTED_POLL":
      // This action is for when the current user votes
      return {
        ...state,
        posts: {
          ...state.posts,
          list: state.posts.list.map((post) =>
            post.id === action.payload.postId
              ? {
                  ...post,
                  poll: {
                    ...post.poll,
                    voted: true,
                    selected_option_id: action.payload.optionId,
                    options: post.poll.options.map((option) =>
                      option.id === action.payload.optionId
                        ? { ...option, vote_count: option.vote_count + 1 }
                        : option
                    ),
                  },
                }
              : post
          ),
        },
      };

    case "UPDATE_POLL_VOTES":
      // This action is for real-time updates from socket (other users voting)
      // Only update vote counts, don't change the current user's voting status
      return {
        ...state,
        posts: {
          ...state.posts,
          list: state.posts.list.map((post) =>
            post.id === action.payload.postId
              ? {
                  ...post,
                  poll: {
                    ...post.poll,
                    // Don't change voted or selected_option_id for current user
                    options: post.poll.options.map((option) =>
                      option.id === action.payload.optionId
                        ? { ...option, vote_count: option.vote_count + 1 }
                        : option
                    ),
                  },
                }
              : post
          ),
        },
      };

    case "LIKE_POST":
      // Legacy action - keeping for backward compatibility
      return {
        ...state,
        posts: {
          ...state.posts,
          list: state.posts.list.map((post) =>
            post.id === action.payload.postId
              ? { ...post, like_count: post.like_count + 1 }
              : post
          ),
        },
      };

    case "USER_LIKED_POST":
      // This action is for when the current user likes/unlikes
      return {
        ...state,
        posts: {
          ...state.posts,
          list: state.posts.list.map((post) =>
            post.id === action.payload.postId
              ? {
                  ...post,
                  liked_by_me: action.payload.action === "like",
                  like_count:
                    action.payload.action === "like"
                      ? (post.like_count || 0) + 1
                      : Math.max((post.like_count || 0) - 1, 0),
                }
              : post
          ),
        },
      };

    case "UPDATE_POST_LIKES":
      // This action is for real-time updates from socket (other users liking)
      // Only update like count, don't change the current user's like status
      return {
        ...state,
        posts: {
          ...state.posts,
          list: state.posts.list.map((post) =>
            post.id === action.payload.postId
              ? {
                  ...post,
                  like_count: Math.max(
                    (post.like_count || 0) + action.payload.increment,
                    0
                  ),
                }
              : post
          ),
        },
      };

    case "RETWEET_POST":
      return {
        ...state,
        posts: {
          ...state.posts,
          list: state.posts.list.map((post) =>
            post.id === action.payload.postId
              ? { ...post, retweets: post.retweets + 1 }
              : post
          ),
        },
      };

    case "CACHE_POLL_VOTE":
      return {
        ...state,
        pollVotes: {
          ...state.pollVotes,
          [action.payload.pollId]: action.payload.optionId,
        },
      };

    default:
      return state;
  }
  
};

export default AppStateReducer;
