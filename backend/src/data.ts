import dotenv from "dotenv";
import fs from 'fs';
import { Request, Response, NextFunction, RequestHandler } from "express";
import { v4 as uuidv4 } from 'uuid';
import admin from "firebase-admin";

// Setup
dotenv.config();
const DATABASE_PATH = './database.json';

// Initialize Firebase Admin once for token authentication
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

type ExerciseCategory = {
    exerciseName: string;
    exerciseWeight: number;
    exerciseId: string;
};

type UserExercises = {
    userId: string;
    exercises: {
        chest: ExerciseCategory[];
        arms: ExerciseCategory[];
        legs: ExerciseCategory[];
        back: ExerciseCategory[];
    };
};

type Database = {
  exercises: UserExercises[];
};


// JSON Data (in-memory) with Type
let database: Database = {
    exercises: []
};

// Initialize JSON Database (Load or Create)
(function initializeDatabase() {
    if (fs.existsSync(DATABASE_PATH)) {
        console.log("Loading Existing Database");
        
        const fileContents = fs.readFileSync(DATABASE_PATH, { encoding: 'utf8' }).trim();
        database = JSON.parse(fileContents) as Database;
        // Ensure the structure is properly loaded
        if (!Array.isArray(database.exercises)) database.exercises = [];
    } else {
        console.log("Setting Up New Database");
        database = { exercises: [] };
        saveDatabase();
    }
})();

// Save JSON Database to File
function saveDatabase() {
    fs.writeFileSync(DATABASE_PATH, JSON.stringify(database, null, 2), 'utf-8');
}

/**********************************
 * Exercise Management Functions
 **********************************/

// created token for login and register using userid which is a string
// this is returned only for login function
// now need to decode userid from token which is authorisation header and use it to create or update
// exerices 

// Creates or updates an exercise for a user
// Takes in exercise body part, exercise name, and exercise weight
export const createOrUpdateExercise = async (req: Request, res: Response): Promise<void> => {
    const { exerciseSection, exerciseName, exerciseWeight, exerciseId } = req.body;
    // need to get userId by decoding authoization header token//
    const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"
    if (!token) {
        res.status(401).json({ error: "Token is required" });
        return;
    }
    try {
        const decoded = await admin.auth().verifyIdToken(token);
        const userId = decoded.uid;
        // Validate input
        if (!exerciseSection || !exerciseName || !exerciseWeight || !exerciseId) {
            throw new Error("Invalid data" );
        }
        // Find the user's exercise data
        let userExercises = database.exercises.find(entry => entry.userId === userId);
        // If the user's exercise data does not exist, create a new user entry
        if (!userExercises) {
            userExercises = { userId, exercises: { chest: [], arms: [], legs: [], back: [] } };
            database.exercises.push(userExercises);
        }
        // Find the body part section (e.g., chest, arms, etc.)
        let bodyPartExercises = userExercises.exercises[exerciseSection as keyof typeof userExercises.exercises];
        if (!bodyPartExercises) {
            res.status(400).json({ error: "Invalid body part section"});
            return
        }
        // Check if the exercise already exists in the body part through exerciseId
        const existingExercise = bodyPartExercises.find(exercise => exercise.exerciseId === exerciseId);
        if (existingExercise) {
            // If the exercise exists, update the weight and name
            existingExercise.exerciseName = exerciseName;
            existingExercise.exerciseWeight = exerciseWeight;
            // Save the updated database
            saveDatabase();
            res.status(200).json({ message: "Exercise updated", exercise: existingExercise });
        } else {
            // If the exercise doesn't exist, add it generate exercise Id 
            const exerciseId = generateExerciseId();
            bodyPartExercises.push({ exerciseId, exerciseName, exerciseWeight });
            // Save the updated database
            saveDatabase();
            res.status(201).json({ message: "Exercise created", exercise: { exerciseName, exerciseWeight } });
        }
    } catch (err) {
        res.status(401).json({ error: "Invalid or expired token" });
    }
};


// Get all exercises for a user
export const getAllExercises = async (req: Request, res: Response): Promise<void> => {
    // need to get userId by decoding authoization header token //
    const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"
    if (!token) {
        res.status(401).json({ error: "Token is required" });
        return;
    }
    try {
        const decoded = await admin.auth().verifyIdToken(token);
        const userId = decoded.uid;
        // Ensure the username or email is provided in the query
        // Find the user's exercises from the database
        const userExercises = database.exercises.find(entry => entry.userId === userId);
        // If the user doesn't have any exercises, return an empty list
        if (!userExercises) {
            res.status(200).json({ exercises: { chest: [], arms: [], legs: [], back: [] }  });
            return;
        }
        // If exercises are found, return them
        res.status(200).json({ exercises: userExercises.exercises });
    } catch(err) {
        res.status(401).json({ error: "Invalid or expired token" });
    }
};

// delete given exercise
export const deleteExercise = async (req: Request, res: Response): Promise<void> => {
    const { exerciseId, exerciseSection } = req.body;
    // need to get userId by decoding authoization header token //
    const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"
    if (!token) {
        res.status(401).json({ error: "Token is required" });
        return;
    }
    try {
        const decoded = await admin.auth().verifyIdToken(token);
        const userId = decoded.uid;
        // Validate input
        if (!exerciseSection || !exerciseId) {
            throw new Error("Invalid data" );
        }
         // Find the user's exercise data
        let userExercises = database.exercises.find(entry => entry.userId === userId);
        if (!userExercises) {
            res.status(400).json({ error: "No user exercises"});
        } else {
            // go through exercise library looking for matching id and delete the exercise that has a matching id
            // Find the body part section (e.g., chest, arms, etc.)
            let bodyPartExercises = userExercises.exercises[exerciseSection as keyof typeof userExercises.exercises];
            if (!bodyPartExercises) {
                res.status(400).json({ error: "Invalid body part section"});
                return
            }
            const index = bodyPartExercises.findIndex(ex => ex.exerciseId === exerciseId);
            if (index !== -1) {
                bodyPartExercises.splice(index, 1);
            }
            // Save the updated database
            saveDatabase();
            res.status(201).json({ message: "Exercise Deleted"});
        }
    } catch (err) {
        res.status(401).json({ error: "Invalid or expired token" });
    }
}

/**********************************
 * Helper Functions
 **********************************/

const generateExerciseId = (): string => {
    return uuidv4(); // Generates a unique user ID
};

