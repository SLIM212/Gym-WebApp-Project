import dotenv from "dotenv";
import fs from 'fs';
import { Request, Response, NextFunction, RequestHandler } from "express";
import { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';


// Setup
dotenv.config();
const jwt = require('jsonwebtoken');
const JWT_SECRET: string = 'gymappforthewin';
const DATABASE_PATH = './database.json';

type ExerciseCategory = {
    exerciseName: string;
    exerciseWeight: number;
    exerciseId: string;
};

type User = {
    userId: string;
    username: string;
    email: string;
    password: string;
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
    users: User[];
    exercises: UserExercises[];
};

// JSON Data (in-memory) with Type
let database: Database = {
    users: [],
    exercises: []
};

// Initialize JSON Database (Load or Create)
(function initializeDatabase() {
    if (fs.existsSync(DATABASE_PATH)) {
        console.log("Loading Existing Database");
        database = JSON.parse(fs.readFileSync(DATABASE_PATH, { encoding: 'utf-8' })) as Database;

        // Ensure the structure is properly loaded
        if (!Array.isArray(database.users)) database.users = [];
        if (!Array.isArray(database.exercises)) database.exercises = [];
    } else {
        console.log("Setting Up New Database");
        database = { users: [], exercises: [] };
        saveDatabase();
    }
})();

// Save JSON Database to File
function saveDatabase() {
    fs.writeFileSync(DATABASE_PATH, JSON.stringify(database, null, 2), 'utf-8');
}

/**********************************
 * User Management Functions
 **********************************/
// Check that email exists and return user id
export function checkEmailExists(usernameOrEmail: string): string | null {
    const user = database.users.find(user => user.email === usernameOrEmail);
    return user ? user.userId : null;  // Return the userId if found, otherwise null
}

// Check that username exists and return user id
export function checkUsernameExists(username: string): string | null {
    const user = database.users.find(user => user.username === username);
    return user ? user.userId : null;  // Return the userId if found, otherwise null
}

// register function calls this function to add a new user
export function addUser(username: string, email: string, password: string) {
    if (checkUsernameExists(username) || checkEmailExists(email)) {
        throw new Error("Username or Email already exists");
    }
    // create a userId which is a string
    const userId = generateUserId();
    database.users.push({ userId, username, email, password });
    saveDatabase();
}

// gives password for email
export function emailPass(usernameOrEmail: string): string | null {
    const user = database.users.find(user => user.email === usernameOrEmail);
    return user ? user.password : null;
}

// gives password from username
export function usernamePass(usernameOrEmail: string): string | null {
    const user = database.users.find(user => user.username === usernameOrEmail);
    return user ? user.password : null;
}

export function changePassword(usernameOrEmail: string, newPassword: string): void {
    const user = database.users.find(user => user.username === usernameOrEmail || user.email === usernameOrEmail);
    if (!user) throw new Error("User not found");
    user.password = newPassword;
    saveDatabase();
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
    console.log(exerciseId);
    console.log("fdssf")
    // need to get userId by decoding authoization header token//
    const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"
    if (!token) {
        res.status(401).json({ error: "Token is required" });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { sub: string };
        const userId = decoded.sub;
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
        console.log("dfddd")
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
            console.log("df")
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
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { sub: string };
        const userId = decoded.sub;
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
    const { exerciseId } = req.body;
    // need to get userId by decoding authoization header token //
    const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"
    if (!token) {
        res.status(401).json({ error: "Token is required" });
    }
    // go through exercise library looking for matching id and delete the exercise that has a matching id
}

/**********************************
 * Helper Functions
 **********************************/

// Given a token, returns the userId as a number
export async function userFromToken (token: string): Promise<number> {
    // Obtain user_id from token
    return new Promise(async (resolve, reject) => {
        jwt.verify(token, JWT_SECRET, (err: Error | null, data: JwtPayload | null) => {
        if (err) {
            console.log("Message " + err.message)
            reject(err);
            return;
        }
        let check = data as JwtPayload;
        if (check.sub) resolve(parseInt(check.sub));
        });
    });
}

const generateUserId = (): string => {
    return uuidv4(); // Generates a unique user ID
};

const generateExerciseId = (): string => {
    return uuidv4(); // Generates a unique user ID
};

