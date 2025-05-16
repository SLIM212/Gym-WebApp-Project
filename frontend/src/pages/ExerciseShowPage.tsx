import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Exercise from "../components/exercise";
import './pages.css';
import apiCall from "../helpers/apiCall.tsx";
import Popup from '../components/Popup.tsx';

type Exercise = {
    exerciseName: string;
    exerciseWeight: number;
};

export default function ExerciseGroup() {
    const { group } = useParams<{ group: string }>(); 
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [exerciseName, setExerciseName] = useState("");
    const [exerciseWeight, setExerciseWeight] = useState("");
    const [errorPopup, setError] = useState('')
    const [messagePopup, setMessage] = useState('')
    const [popupVisible, setMessageVisible] = useState(false);
    
    // Trigger the popup visibility when either errorPopup or messagePopup changes
    useEffect(() => {
        if (errorPopup || messagePopup) {
            setMessageVisible(true);  // Show popup if there's an error or message
        }
    }, [errorPopup, messagePopup]);

    // Handle popup close action
    const closePopup = () => {
        setMessageVisible(false);
        setError('');  // Clear error message
        setMessage('');  // Clear general message
    };
    
    useEffect(() => {
        getAllExercises();
    }, [group]);
    // get all exercises when page first loads
    const getAllExercises = async () => {
        try {
            const storedExercises = await apiCall({url: 'getAllExercises', method: 'GET'});
            console.log(storedExercises.exercises.back)
            console.log(group)
            if (storedExercises) {
                setExercises(storedExercises.exercises.back);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unexpected error occurred");
            }
        }
    }

    const addExercise = async (exerciseName: string, exerciseWeight: number) => {
        const updatedExercises = [...exercises, { exerciseName, exerciseWeight }];
        // need to switch this with a call to the backend
        localStorage.setItem(`${group?.toLowerCase()}-exercises`, JSON.stringify(updatedExercises));
        try {
            // body takes in  exerciseSection, exerciseName, exerciseWeight
            await apiCall({url: 'createExercise', method: 'PUT', 
                body: {exerciseSection: group, exerciseName: exerciseName, exerciseWeight: exerciseWeight}});
            setExercises(updatedExercises);
            // After successfully adding, fetch fresh exercises from backend
            await getAllExercises();
            setError('');
            setMessage('Exercise added successfully!');
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unexpected error occurred");
            }
        }
    };

    return (
        <>
        {popupVisible && (
                <Popup
                message={errorPopup || messagePopup}
                status={errorPopup ? 'error' : 'success'}
                onClose={closePopup}
                />
        )}
        {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg">
                <h2 className="text-xl font-bold mb-2">Add New Exercise</h2>
                <input 
                type="text" 
                placeholder="Exercise Name" 
                value={exerciseName} 
                onChange={(e) => setExerciseName(e.target.value)} 
                className="block mb-2 p-2 border"
                />
                <input 
                type="number" 
                placeholder="Exercise Weight" 
                value={exerciseWeight} 
                onChange={(e) => setExerciseWeight(e.target.value)} 
                className="block mb-2 p-2 border"
                />
                <button 
                onClick={() => {
                    if (exerciseName.trim() !== "" && Number(exerciseWeight) > 0) {
                        addExercise(exerciseName, Number(exerciseWeight));
                        setShowModal(false);
                        setExerciseName("");
                        setExerciseWeight("");
                    }
                }} 
                className="bg-blue-500 text-white px-4 py-2 rounded">
                Add
                </button>
                <button 
                onClick={() => setShowModal(false)} 
                className="ml-2 text-red-500">
                Cancel
                </button>
            </div>
            </div>
        )}

        <h1 className="flex items-center text-4xl font-extrabold text-white header">{group} Exercises</h1>
        <div className="exercise-container">
            {exercises.map((exercise, index) => (
            <div key={index}>
                <Exercise
                    exerciseName={exercise.exerciseName}
                    exerciseWeight={exercise.exerciseWeight}
                />
            </div>
            ))}
        </div>
        <button onClick={() => setShowModal(true)} style={{color:'white', fontSize:'0.8em'}}>Add exercise +</button>
        <br />
        <Link to={`/Dashboard`} className="text-blue-500 underline">Dashboard</Link>
        </>
    );
}
