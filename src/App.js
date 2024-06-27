import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import PlaylistDetail from './pages/Playlist/playlistDetails';
import PrivateRoute from './componnents/ProtectedRoute/protectedRoute';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Routes protégées */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/playlist/:id" element={<PlaylistDetail />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;