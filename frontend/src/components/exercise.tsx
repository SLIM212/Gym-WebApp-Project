import React, { useState, useEffect } from "react";

type ExerciseProps = {
    exerciseId: string;
    exerciseName: string;
    exerciseWeight: number;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    setEdit: React.Dispatch<React.SetStateAction<boolean>>;
    setExerciseToEdit: React.Dispatch<React.SetStateAction<[string, string, number] | null>>;
    setExerciseToDelete: React.Dispatch<React.SetStateAction<string | null>>;
};


const Exercise = ({ exerciseId, exerciseName, exerciseWeight, setShowModal, setEdit, setExerciseToEdit, setExerciseToDelete }: ExerciseProps) => {
    return (
        <>
            {exerciseName} - {exerciseWeight}kg 
            <button onClick={() =>{setShowModal(true); setEdit(true), setExerciseToEdit([exerciseId, exerciseName, exerciseWeight])}}>Edit</button>
            <button onClick={() => {setExerciseToDelete(exerciseId)}}>Delete</button>
        </>
    )
}

export default Exercise;