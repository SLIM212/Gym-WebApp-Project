import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import DashBoard from "./pages/DashBoard";
import Login from './pages/Login'
import Register from './pages/Register'
import ExerciseGroup from './pages/ExerciseShowPage';


function App() {

  return (
    <Router>
      <Routes>
        {/* register and login will be handled by backend */}
        {/* A token will be sent back from the backend */}
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/exercise/:group" element={<ExerciseGroup />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
