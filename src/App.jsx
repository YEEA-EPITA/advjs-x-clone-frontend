import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EditProfile from './pages/EditProfile';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>
    </Router>
  );
}
