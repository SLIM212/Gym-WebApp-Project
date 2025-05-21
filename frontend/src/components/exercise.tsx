import React from "react";
import editIcon from '../assets/edit.png';
import deleteIcon from '../assets/bin.png';

type ExerciseProps = {
    exerciseId: string;
    exerciseName: string;
    exerciseWeight: number;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    setEdit: React.Dispatch<React.SetStateAction<boolean>>;
    setExerciseToEdit: React.Dispatch<React.SetStateAction<[string, string, number] | null>>;
    setExerciseToDelete: React.Dispatch<React.SetStateAction<string | null>>;
};

const Exercise = ({
    exerciseId,
    exerciseName,
    exerciseWeight,
    setShowModal,
    setEdit,
    setExerciseToEdit,
    setExerciseToDelete
}: ExerciseProps) => {
    return (
        <div className="flex items-center justify-between px-3 py-2 bg-gray-800 text-white rounded-2xl shadow-sm">
            <div className="text-base font-semibold">
                {exerciseName} - {exerciseWeight}kg
            </div>
            <div className="flex gap-1">
                <button
                    onClick={() => {
                        setShowModal(true);
                        setEdit(true);
                        setExerciseToEdit([exerciseId, exerciseName, exerciseWeight]);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 p-1.5 rounded-md"
                >
                    <img src={editIcon} alt="Edit" className="w-4 h-4" />
                </button>
                <button
                    onClick={() => setExerciseToDelete(exerciseId)}
                    className="bg-red-500 hover:bg-red-600 p-1.5 rounded-md"
                >
                    <img src={deleteIcon} alt="Delete" className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default Exercise;
