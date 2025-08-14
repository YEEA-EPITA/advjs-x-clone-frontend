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
      localStorage.removeItem("pollVotes");
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

    case "UPDATE_POST_LIST_AFTER_CREATE":
      return {
        ...state,

        posts: {
          ...state.posts,
          list: [action.payload, ...state.posts.list],
        },
      };

    case "UPDATE_POLL_AFTER_VOTE":
      return {
        ...state,
        posts: {
          ...state.posts,
          list: state.posts.list.map((post) =>
            post.id === action.payload.postId
              ? {
                  ...post,
                  poll: action.payload.updatedPoll,
                }
              : post
          ),
        },
      };

    case "UPDATE_POLL_RESULTS":
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
                    options: action.payload.updatedPoll.options, // just update vote counts
                  },
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
