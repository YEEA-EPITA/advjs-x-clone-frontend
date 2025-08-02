import { createContext, useReducer, useEffect, useRef } from "react";
import AppStateReducer from "./AppStateReducer";
import { io } from "socket.io-client";

const serverUrl = process.env.REACT_APP_API_URL || "http://localhost:8080";

const INITIAL_STATE = {
  isAuthenticated:
    typeof window !== "undefined" && localStorage.getItem("user")
      ? true
      : false,
  user:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : null,
  socket: null, // placeholder
  postsList: [],
};

export const AppStateContext = createContext(INITIAL_STATE);

export const AppStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppStateReducer, INITIAL_STATE);
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect socket after mount
    socketRef.current = io(serverUrl, {
      withCredentials: true,
      transports: ["websocket"],
      auth: {
        token: state?.user?.accessToken || "", // if needed
      },
    });

    dispatch({ type: "SET_SOCKET", payload: socketRef.current });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [state?.user]);

  return (
    <AppStateContext.Provider value={{ appState: state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
};
