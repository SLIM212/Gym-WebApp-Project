"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importing required modules
const express_1 = __importDefault(require("express")); // Express framework and type definitions (for TypeScript)
const cors_1 = __importDefault(require("cors")); // Cross-Origin Resource Sharing, allows your API to be accessible from different domains
const dotenv_1 = __importDefault(require("dotenv")); // Loads environment variables from a .env file into process.env
const data_1 = require("./data");
const auth_1 = require("./auth");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
// ✅ Proper CORS setup
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
// ✅ Ensure preflight requests are handled
app.options("*", (0, cors_1.default)());
app.use(express_1.default.json());
// Basic Test Routes
app.get("/", (req, res) => {
    res.send("Backend Server Alive");
});
app.get("/info", (req, res) => {
    res.send("This is my gym tracker app");
});
// Determine the port to listen on
const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
/**
 * Function to Login user
 * @route POST /login
 * @param {string} req.body.usernameOrEmail - username or email
 * @param {string} req.body.password - password
 * @returns {Response} -  Empty response with status code 200 for success 400 for fail
 */
app.post("/login", auth_1.login);
/**
 * Function to Register user
 * @route POST /register
 * @param {string} req.body.username - username
 * @param {string} req.body.email - email
 * @param {string} req.body.password  - password
 * @returns {Response} - Empty response with status code 200 for success 400 for fail
 */
app.post("/register", auth_1.register);
// chest, back, arms and leg exercises api endpoints
app.get("/getAllExercises", data_1.getAllExercises);
app.put("/createExercise", data_1.createOrUpdateExercise);
app.delete("/deleteExercise", data_1.deleteExercise);
// app.get takes in token and body part and returns all exercises currently in that part for user
// app.post takes in token and body part and exercise object whcih has exercise name and weight
// stores in the users file in the sql database
