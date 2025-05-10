import React, { useState, useEffect } from "react";
import dapImage from "../assets/dap.jpg";
import { useNavigate, Link } from 'react-router-dom'

type ExerciseProps = {
    exerciseName: string;
    exerciseWeight: number;
}

const Exercise = ({ exerciseName, exerciseWeight }: ExerciseProps) => {
    console.log(exerciseName, exerciseWeight)
    return (
        <>
            {exerciseName} - {exerciseWeight}kg
        </>
    )
}

export default Exercise;