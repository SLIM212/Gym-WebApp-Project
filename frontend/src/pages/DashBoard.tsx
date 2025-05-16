import React, { useState } from "react";
import dapImage from "../assets/dap.jpg";
import { useNavigate, Link } from 'react-router-dom'
import './pages.css';

export default function DashBoard() {
    const navigate = useNavigate();
    const Logout = () => {
        localStorage.removeItem('user-token');
        localStorage.removeItem('user-email');
        navigate('/login');
    }
return (
    <div className="App">
        <div className="page-header text-center dashboard-header">
            Gym Progress Tracker
        </div>
        <img className="header-img"src={dapImage} alt="dap-img"></img>
        <br></br>
        <Link to={`/exercise/back`} className="text-blue-500 underline">Back</Link>
        <br></br>
        <Link to={`/exercise/chest`} className="text-blue-500 underline">Chest</Link>
        <br></br>
        <Link to={`/exercise/legs`} className="text-blue-500 underline">Legs</Link>
        <br></br>
        <Link to={`/exercise/arms`} className="text-blue-500 underline">Arms</Link>
        <p className="text-center fw-light" style={{marginTop: '40px', color:'#E0BB20'}} >About Us</p>
        <button onClick={Logout}className="text-blue-500 underline">Logout</button>
    </div>
);
}

