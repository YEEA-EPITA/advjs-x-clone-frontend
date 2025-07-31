import { createContext, useReducer } from "react"
import AppStateReducer from "./AppStateReducer"

const INITIAL_STATE = {
    isAuthenticated: localStorage.getItem("user") ? true : false,
    user: JSON.parse(localStorage.getItem("user"))
}

// Create a context to share app state across components
export const AppStateContext = createContext(INITIAL_STATE)

// Create a context provider component to manage global state
export const AppStateProvider = ({children}) => {
    // Use useReducer to manage app state using the reducer logic
    const [state, dispatch] = useReducer(AppStateReducer, INITIAL_STATE)

    // Provide the state and dispatch function to all child components
    return (
        <AppStateContext.Provider value={{appState: state, dispatch}}>
            {children}
        </AppStateContext.Provider>
    )
}