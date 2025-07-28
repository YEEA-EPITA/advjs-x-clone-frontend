import React from "react";
import {Route, Routes} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import PostDetailsPage from "./pages/PostDetailsPage";
import NotFoundPage from "./pages/NotFoundPage";
import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";
import { ThemeProvider } from "./context/ThemeContext";

const App = () => {
  return (
    <>
    <ThemeProvider>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/auth/login" element={<LoginPage />} />
        </Route>
        <Route element={<PrivateRoute />}> 
          <Route path="/home" element={<HomePage />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/post/:postId" element={<PostDetailsPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />}/>
      </Routes>
    </ThemeProvider>
    </>
  );
};

export default App;
