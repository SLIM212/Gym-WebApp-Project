// Importing required modules
import express, { Request, Response } from "express"; // Express framework and type definitions (for TypeScript)
import cors from "cors"; // Cross-Origin Resource Sharing, allows your API to be accessible from different domains
import dotenv from "dotenv"; // Loads environment variables from a .env file into process.env
import axios from "axios"; // HTTP client for making requests to external APIs
import {getAllExercises, createOrUpdateExercise, deleteExercise} from "./data"
import {login, register} from './auth';
import jwt from "jsonwebtoken";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5000', 'https://gym-webapp-project-2plv.onrender.com'], // replace with your Netlify or Vercel URL
  credentials: true
})); 
app.use(express.json());

// Basic Test Routes
app.get("/", (req: Request, res: Response) => {
    res.send("Backend Server Alive");
});

app.get("/info", (req: Request, res: Response) => {
    res.send("This is my gym tracker app");
});

// Determine the port to listen on
const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

// Start the server
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });

//////////////// for cloud deployment/////////////
// // Determine the port to listen on
// const PORT = process.env.PORT || 5000; // Use the environment variable PORT, or default to 5000

// // Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});

/**
 * Function to Login user
 * @route POST /login
 * @param {string} req.body.usernameOrEmail - username or email
 * @param {string} req.body.password - password
 * @returns {Response} -  Empty response with status code 200 for success 400 for fail
 */
app.post("/login", login);

/**
 * Function to Register user
 * @route POST /register
 * @param {string} req.body.username - username
 * @param {string} req.body.email - email 
 * @param {string} req.body.password  - password
 * @returns {Response} - Empty response with status code 200 for success 400 for fail
 */
app.post("/register", register);

// going to need routes to get exercises for each user
// chest, back, arms and leg exercises
app.get("/getAllExercises", getAllExercises);
app.put("/createExercise", createOrUpdateExercise);
app.delete("/deleteExercise", deleteExercise)
// app.get takes in token and body part and returns all exercises currently in that part for user
// app.post takes in token and body part and exercise object whcih has exercise name and weight
// stores in the users file in the sql database