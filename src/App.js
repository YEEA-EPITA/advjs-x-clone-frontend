import { Route, Routes } from "react-router-dom";

import HomeTestPage from "./pages/HomeTestPage";
import PostDetailsPage from "./pages/PostDetailsPage";
import NotFoundPage from "./pages/NotFoundPage";

import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";
import AuthPage from "./pages/AuthPage";
import ComposePostPage from "./pages/ComposePostPage";
import { ThemeProvider } from "./context/ThemeContext";


const App = () => {
  return (
    <ThemeProvider>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/auth" element={<AuthPage />} /> 
        </Route>

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<HomeTestPage />} />
          <Route path="/post/:postId" element={<PostDetailsPage />} />
          <Route path="/compose/post" element={<ComposePostPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
