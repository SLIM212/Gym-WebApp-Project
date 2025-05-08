import React, { useState } from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import DashBoard from "./pages/DashBoard";
import Arms from "./pages/Arms";
import Chest from "./pages/Chest";
import Back from "./pages/Back";
import Legs from "./pages/Legs";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashBoard />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/back" element={<Back />} />
        <Route path="/chest" element={<Chest />} />
        <Route path="/arms" element={<Arms />} />
        <Route path="/legs" element={<Legs />} />
      </Routes>
    </Router>
  );
}

export default App;
