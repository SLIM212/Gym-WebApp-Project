import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashBoard from "./pages/DashBoard";
import Login from './pages/Login';
import Register from './pages/Register';
import ExerciseGroup from './pages/ExerciseShowPage';

function ErrorPage() {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn’t exist.</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route - go to login page */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/exercise/:group" element={<ExerciseGroup />} />

        {/* Catch-all for unknown paths */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
