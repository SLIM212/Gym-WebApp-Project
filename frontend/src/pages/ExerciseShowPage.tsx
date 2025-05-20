import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Exercise from "../components/exercise";
import './pages.css';
import apiCall from "../helpers/apiCall.tsx";
import Popup from '../components/Popup.tsx';
import { useNavigate} from 'react-router-dom'

type Exercise = {
    exerciseId: string;
    exerciseName: string;
    exerciseWeight: number;
};

export default function ExerciseGroup() {
    const { group } = useParams<{ group: string }>(); 
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editExercise, setEdit] = useState(false);
    const [exerciseName, setExerciseName] = useState<string>("");
    const [exerciseWeight, setExerciseWeight] = useState<string>();
    const [exerciseId, setExerciseId] = useState("");
    const [errorPopup, setError] = useState('')
    const [messagePopup, setMessage] = useState('')
    const [popupVisible, setMessageVisible] = useState(false);
    const [exerciseToEdit, setExerciseToEdit] = useState<[string, string, number] | null>(null);
    const [exerciseToDelete, setExerciseToDelete] = useState<string | null>(null);
    const navigate = useNavigate();

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
        // Clear popup when route changes
        setError('');  // Clear error message
        setMessage('');  // Clear general message
    }, [location]);
    
    useEffect(() => {
        if (editExercise && exerciseToEdit) {
            setExerciseId(exerciseToEdit[0])
            setExerciseName(exerciseToEdit[1]);
            setExerciseWeight(exerciseToEdit[2].toString());
        }
    }, [editExercise, exerciseToEdit, showModal]);


    // used to retrieve all the exercises for given exercise group on page load
    useEffect(() => {
        getAllExercises();
    }, [group]);

    useEffect(() => {
        if (exerciseToDelete) {
            deleteExercise();
        }
    }, [exerciseToDelete]);

    const Logout = () => {
        localStorage.removeItem('user-token');
        localStorage.removeItem('user-email');
        navigate('/login');
    }

    const deleteExercise = async () => {
        // need to send exerciseToDelete info to backend to delet, might need new endpoint for this one
        try {
            // body takes in exerciseSection, exerciseName, exerciseWeight
            await apiCall({url: 'deleteExercise', method: 'DELETE', 
                body: {exerciseSection: group, exerciseId: exerciseToDelete}});
            // After successfully adding, fetch fresh exercises from backend
            await getAllExercises();
            setError('');
            setMessage('Exercise deleted successfully!');
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
                // need to log out if token is expired
                if (error.message == "Invalid or expired token") {
                    Logout();
                }
            } else {
                setError("An unexpected error occurred");
            }
        }
    }
    // get all exercises when page first loads
    const getAllExercises = async () => {
        try {
            const storedExercises = await apiCall({url: 'getAllExercises', method: 'GET'});
            if (storedExercises) {
                // only store exercises for current exercise group, e.g. back, chest etc
                setExercises(storedExercises.exercises[group as keyof typeof storedExercises.exercises]);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
                // need to log out if token is expired
                if (error.message == "Invalid or expired token") {
                    Logout();
                }
            } else {
                setError("An unexpected error occurred");
            }
        }
    }

    const addOrEditExercise = async (exerciseId: string, exerciseName: string, exerciseWeight: number) => {
        console.log(exerciseId, exerciseName, exerciseWeight)
        try {
            // body takes in exerciseSection, exerciseName, exerciseWeight
            await apiCall({url: 'createExercise', method: 'PUT', 
                body: {exerciseSection: group, exerciseId: exerciseId, exerciseName: exerciseName, exerciseWeight: exerciseWeight}});
            // After successfully adding, fetch fresh exercises from backend
            await getAllExercises();
            setError('');
            if (editExercise) {
                setMessage('Exercise edited successfully!');
            } else {
                setMessage('Exercise added successfully!');
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
                // need to log out if token is expired
                if (error.message == "Invalid or expired token") {
                    Logout();
                }
            } else {
                setError("An unexpected error occurred");
            }
        }
    };

    function capitalizeFirstLetter(str: string | undefined): string {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    }


    return (
        <>
        {popupVisible && (
                <Popup
                message={errorPopup || messagePopup}
                status={errorPopup ? 'error' : 'success'}
                onClose={closePopup}
                />
        )}
        {/* if edit is pressed access exerciseToEdit and prefill the name and weight fields */}
        {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-4 rounded shadow-lg">
                    <h2 className="text-xl font-bold mb-2">{editExercise ? `Edit ${capitalizeFirstLetter(group)} Exercise` : `Add ${capitalizeFirstLetter(group)} Exercise`}</h2>

                    <input 
                        type="text" 
                        placeholder="Exercise Name" 
                        value={exerciseName}
                        onChange={(e) => setExerciseName(e.target.value)} 
                        className="block mb-2 p-2 border"
                    />
                    <input 
                        type="number" 
                        placeholder="Exercise Weight (kg)" 
                        value={exerciseWeight}
                        onChange={(e) => setExerciseWeight(e.target.value)} 
                        className="block mb-2 p-2 border"
                    />

                    <button 
                        onClick={() => {
                            if (exerciseName.trim() !== "" && Number(exerciseWeight) > 0) {
                                if (editExercise) {
                                    addOrEditExercise(exerciseId, exerciseName, Number(exerciseWeight));
                                } else {
                                    addOrEditExercise('-1', exerciseName, Number(exerciseWeight));
                                }
                                setShowModal(false);
                                setExerciseName("");
                                setExerciseWeight("");
                                setEdit(false);
                            }
                        }} 
                        className="bg-blue-500 text-white px-4 py-2 rounded">
                        {editExercise ? "Edit" : "Add"}
                    </button>
                    <button 
                        onClick={() => { setShowModal(false); setEdit(false)}} 
                        className="ml-2 text-red-500">
                        Cancel
                    </button>
                </div>
            </div>
        )}


        <h1 className="flex items-center text-4xl font-extrabold text-white header">{capitalizeFirstLetter(group)} Exercises</h1>
        <div className="exercise-container">
            {exercises.map((exercise, index) => (
            <div key={index}>
                <Exercise
                    exerciseId={exercise.exerciseId}
                    exerciseName={exercise.exerciseName}
                    exerciseWeight={exercise.exerciseWeight}
                    setShowModal={setShowModal}
                    setEdit={setEdit}
                    setExerciseToEdit={setExerciseToEdit}
                    setExerciseToDelete={setExerciseToDelete}
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
