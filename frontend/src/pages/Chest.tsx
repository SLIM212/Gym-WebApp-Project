import React, { useState, useEffect, } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import Exercise from "../components/exercise";
import './pages.css'

// store exercise details in localstorage for now
// add exericse button stores an exercise and weight in localstorage: [{exerciseName: weight...}]
// editing exerices, name and weight will query the local storage for this exerices region i.e. chest and alter
// the key associated with that exercise
// page load by checking exerices dict in local storage and populating page with exercises that already exist
// these exercises will have an exericse componennt

export default function Chest() {
    type Exercise = {
        exerciseName: string;
        exerciseWeight: number;
    };
    const [chestExercises, setChest] = useState<Exercise[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [exerciseName, setExerciseName] = useState("");
    const [exerciseWeight, setExerciseWeight] = useState("");

    // query localstorage on load for all chest exercises
    // will change this to querying the backend in the future
    useEffect(() => {
        const storedChestExercises = localStorage.getItem("chest-exercises");
        if (storedChestExercises) {
            setChest(JSON.parse(storedChestExercises));
        }
    },[])

    // will have to make this post request the backend later
    // captures name and weight input from user and stores in local host in form
    // {ChestExercises:[{exerciseName: exerciseWeight}]}
    const addExercise = (exerciseName: string, exerciseWeight: number) => {
        let currExercises = localStorage.getItem("chest-exercises");
        let exerciseList = currExercises ? JSON.parse(currExercises) : [];
        // push in the added exercise
        exerciseList.push({exerciseName, exerciseWeight})
        // add new exercise list to localstorage
        localStorage.setItem("chest-exercises", JSON.stringify(exerciseList));
        setChest(exerciseList);
        // to reset exercise name and weight
        setExerciseName("");
        setExerciseWeight("");
    }
    console.log(chestExercises)

    return (
        <>
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
            {/* use .map to iteratively populate the screen with all chestExercises */}
            <h1 className="flex items-center text-4xl font-extrabold text-white header">Chest Exercises</h1>
            <div className="exercise-container">
                {/* this will show each exercise that has been stored */}
                {chestExercises.map((exercise, index) => {
                    return (
                        <div key={index}>
                            <Exercise
                                exerciseName={exercise.exerciseName}
                                exerciseWeight={exercise.exerciseWeight}
                            />
                        </div>
                    )
                })}
            </div>
            {/* need to show an input modal for exercise name and weight */}
            <button onClick={() => setShowModal(true)} className="text-blue-500 underline">Add exercise</button>
            <Link to={`/Dashboard`} className="text-blue-500 underline">Dashboard</Link>
        </>
    )

}