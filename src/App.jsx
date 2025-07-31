// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProfilePage from './pages/ProfilePage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/profile/:username" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
