import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import './pages.css'

export default function Arms() {

    return (
        <>
            {/* use .map to iteratively populate the screen with all arm exercises */}
            <h1 className="flex items-center text-4xl font-extrabold text-white header">Arms Exercises</h1>
            <Link to={`/Dashboard`} className="text-blue-500 underline">Dashboard</Link>
        </>
    )

}