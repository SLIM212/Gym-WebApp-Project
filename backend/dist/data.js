"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExercise = exports.getAllExercises = exports.createOrUpdateExercise = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
// Setup
dotenv_1.default.config();
const DATABASE_PATH = './database.json';
// Initialize Firebase Admin once for token authentication
if (!firebase_admin_1.default.apps.length) {
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.applicationDefault(),
    });
}
// JSON Data (in-memory) with Type
let database = {
    exercises: []
};
// Initialize JSON Database (Load or Create)
(function initializeDatabase() {
    if (fs_1.default.existsSync(DATABASE_PATH)) {
        console.log("Loading Existing Database");
        const fileContents = fs_1.default.readFileSync(DATABASE_PATH, { encoding: 'utf8' }).trim();
        database = JSON.parse(fileContents);
        // Ensure the structure is properly loaded
        if (!Array.isArray(database.exercises))
            database.exercises = [];
    }
    else {
        console.log("Setting Up New Database");
        database = { exercises: [] };
        saveDatabase();
    }
})();
// Save JSON Database to File
function saveDatabase() {
    fs_1.default.writeFileSync(DATABASE_PATH, JSON.stringify(database, null, 2), 'utf-8');
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
const createOrUpdateExercise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { exerciseSection, exerciseName, exerciseWeight, exerciseId } = req.body;
    // need to get userId by decoding authoization header token//
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // "Bearer <token>"
    if (!token) {
        res.status(401).json({ error: "Token is required" });
        return;
    }
    try {
        const decoded = yield firebase_admin_1.default.auth().verifyIdToken(token);
        const userId = decoded.uid;
        // Validate input
        if (!exerciseSection || !exerciseName || !exerciseWeight || !exerciseId) {
            throw new Error("Invalid data");
        }
        // Find the user's exercise data
        let userExercises = database.exercises.find(entry => entry.userId === userId);
        // If the user's exercise data does not exist, create a new user entry
        if (!userExercises) {
            userExercises = { userId, exercises: { chest: [], arms: [], legs: [], back: [] } };
            database.exercises.push(userExercises);
        }
        // Find the body part section (e.g., chest, arms, etc.)
        let bodyPartExercises = userExercises.exercises[exerciseSection];
        if (!bodyPartExercises) {
            res.status(400).json({ error: "Invalid body part section" });
            return;
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
        }
        else {
            // If the exercise doesn't exist, add it generate exercise Id 
            const exerciseId = generateExerciseId();
            bodyPartExercises.push({ exerciseId, exerciseName, exerciseWeight });
            // Save the updated database
            saveDatabase();
            res.status(201).json({ message: "Exercise created", exercise: { exerciseName, exerciseWeight } });
        }
    }
    catch (err) {
        res.status(401).json({ error: "Invalid or expired token" });
    }
});
exports.createOrUpdateExercise = createOrUpdateExercise;
// Get all exercises for a user
const getAllExercises = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // need to get userId by decoding authoization header token //
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // "Bearer <token>"
    if (!token) {
        res.status(401).json({ error: "Token is required" });
        return;
    }
    try {
        const decoded = yield firebase_admin_1.default.auth().verifyIdToken(token);
        const userId = decoded.uid;
        // Ensure the username or email is provided in the query
        // Find the user's exercises from the database
        const userExercises = database.exercises.find(entry => entry.userId === userId);
        // If the user doesn't have any exercises, return an empty list
        if (!userExercises) {
            res.status(200).json({ exercises: { chest: [], arms: [], legs: [], back: [] } });
            return;
        }
        // If exercises are found, return them
        res.status(200).json({ exercises: userExercises.exercises });
    }
    catch (err) {
        res.status(401).json({ error: "Invalid or expired token" });
    }
});
exports.getAllExercises = getAllExercises;
// delete given exercise
const deleteExercise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { exerciseId, exerciseSection } = req.body;
    // need to get userId by decoding authoization header token //
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // "Bearer <token>"
    if (!token) {
        res.status(401).json({ error: "Token is required" });
        return;
    }
    try {
        const decoded = yield firebase_admin_1.default.auth().verifyIdToken(token);
        const userId = decoded.uid;
        // Validate input
        if (!exerciseSection || !exerciseId) {
            throw new Error("Invalid data");
        }
        // Find the user's exercise data
        let userExercises = database.exercises.find(entry => entry.userId === userId);
        if (!userExercises) {
            res.status(400).json({ error: "No user exercises" });
        }
        else {
            // go through exercise library looking for matching id and delete the exercise that has a matching id
            // Find the body part section (e.g., chest, arms, etc.)
            let bodyPartExercises = userExercises.exercises[exerciseSection];
            if (!bodyPartExercises) {
                res.status(400).json({ error: "Invalid body part section" });
                return;
            }
            const index = bodyPartExercises.findIndex(ex => ex.exerciseId === exerciseId);
            if (index !== -1) {
                bodyPartExercises.splice(index, 1);
            }
            // Save the updated database
            saveDatabase();
            res.status(201).json({ message: "Exercise Deleted" });
        }
    }
    catch (err) {
        res.status(401).json({ error: "Invalid or expired token" });
    }
});
exports.deleteExercise = deleteExercise;
/**********************************
 * Helper Functions
 **********************************/
const generateExerciseId = () => {
    return (0, uuid_1.v4)(); // Generates a unique user ID
};
