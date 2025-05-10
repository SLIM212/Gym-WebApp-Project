import React, { useState } from "react";
import dapImage from "../assets/dap.jpg";
import { useNavigate, Link } from 'react-router-dom'
import './pages.css';

export default function DashBoard() {

return (
    <div className="App">
        <div className="page-header text-center dashboard-header">
            Gym Progress Tracker
        </div>
        <img className="header-img"src={dapImage} alt="dap-img"></img>
        <br></br>
        <Link to={`/Back`} className="exercises">Back</Link>
        <br></br>
        <Link to={`/Chest`} className="text-blue-500 underline">Chest</Link>
        <br></br>
        <Link to={`/Legs`} className="text-blue-500 underline">Legs</Link>
        <br></br>
        <Link to={`/Arms`} className="text-blue-500 underline">Arms</Link>
        <p className="text-center fw-light" style={{marginTop: '40px', color:'#E0BB20'}} >About Us</p>
    </div>
);
}

