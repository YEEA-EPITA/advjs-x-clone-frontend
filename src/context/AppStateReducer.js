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

    default:
      return state;
  }
};

export default AppStateReducer;
