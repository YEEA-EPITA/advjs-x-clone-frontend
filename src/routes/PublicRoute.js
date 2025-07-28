import React from "react"
import { Navigate, Outlet } from "react-router-dom"
import useAppStateContext from "../hooks/useAppStateContext"

const PublicRoute = () => {

    const { appState } = useAppStateContext()

    return !appState?.isAutenticated && !appState?.user ? (
        <Outlet />
    ) : (
        <Navigate to="/login" />
    )
}

export default PublicRoute