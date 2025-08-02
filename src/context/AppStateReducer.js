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
      return {
        ...state,
        posts: {
          ...state.posts,
          list: state.posts.list.map((post) =>
            post.id === action.payload.postId
              ? { ...post, likes: post.likes + 1 }
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

    default:
      return state;
  }
};

export default AppStateReducer;
