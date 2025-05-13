import express, { Express, Request, Response } from "express";
import cors from "cors"
import dotenv from "dotenv";
import * as EmailValidator from 'email-validator';
import jwt from 'jsonwebtoken';
// import nodemailer from "nodemailer";
import { addUser, checkEmailExists, checkUsernameExists, emailPass, usernamePass, changePassword } from './data';

// Setup
dotenv.config();
const app: Express = express();
const JWT_SECRET: string = 'gymappforthewin';
app.use(cors());
app.use(express.json());
const PASSWORD_RESET_EXPIRATION = '10m'; // 1 hour in milliseconds
// const RESET_URL_BASE = `http://localhost:3000/forgotPassword`; // URL base for reset link
const USERNAME_MIN_LEN = 5;
const PASS_MIN_LEN = 12;
const SUCCESS_CODE = 200;
const ERROR_CODE = 400;
const INTERNAL_ERROR_CODE = 500;
const TOKEN_TIMEOUT = 3600;
/**
 * Login function handles user validation and token sending
 * @param req.body.usernameOrEmail
 * @param req.body.password
 * @returns res.status(200).json(token) on success and res.status(400) on fail
 */
export const login = async (req: Request, res: Response): Promise<void> => {
    const bcrypt = require('bcryptjs');
    // take in inputs from HTTP request
    const { usernameOrEmail, password } = req.body;
    // check if they provided an email or username
    const email : boolean = EmailValidator.validate(usernameOrEmail);

    let userId: number;
    try {
        if (email) {
            // Check email exists in database
            userId = await checkEmailExists(usernameOrEmail);
            if (userId === 0) { // Value of 0 means no database entry with that email found
                res.status(ERROR_CODE).json({ error: 'Invalid User Credentials' });
                return;
            }
            // Obtain password from database
            let pass = await emailPass(usernameOrEmail);
            const passwordMatch = await bcrypt.compare(password, pass);
            if (!passwordMatch) {
                res.status(ERROR_CODE).json({ error: 'Invalid User Credentials' });
                return;
            }
        } else {
            // Check if username exists in database
            userId = await checkUsernameExists(usernameOrEmail);
            if (userId === 0) { // Value of 0 means no database entry with that username found
                res.status(ERROR_CODE).json({ error: 'Invalid User Credentials' });
                return;
            }
            // Obtain password from database
            let pass = await usernamePass(usernameOrEmail);
            const passwordMatch = await bcrypt.compare(password, pass);
            if (!passwordMatch) {
                res.status(ERROR_CODE).json({ error: 'Invalid User Credentials' });
                return;
            }
        }
    } catch (error) {
        console.log("Error in login: ", error);
        res.status(ERROR_CODE).json({ error: 'Error in login' });
        return;
    }
    // Return success with the token
    res.status(SUCCESS_CODE).json({ token: jwt.sign({ sub: userId  }, JWT_SECRET, { algorithm: 'HS256', expiresIn: TOKEN_TIMEOUT })});
    return;
};

export const register = async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body;
    
    // Basic validation
    if (!username || !email || !password) {
        res.status(ERROR_CODE).json({ error: 'All fields (username, email, password) are required' });
        return;
    }
    // validate email format
    if (!EmailValidator.validate(email)) {
        res.status(ERROR_CODE).json({ error: 'Email format incorrect' });
        return;
    }
    // validate username format, at least 5 characters long
    if (username.length < USERNAME_MIN_LEN) {
        res.status(ERROR_CODE).json({ error: 'Username length too short' });
        return;
    }
    // validate password format, at least 12 characters long
    if (password.length < PASS_MIN_LEN) {
        res.status(ERROR_CODE).json({ error: 'Password length too short' });
        return;
    }

    try {
        // Check if username is already taken
        let result = await checkUsernameExists(username);
        if (result !== 0) {
            res.status(ERROR_CODE).json({ error: 'Username already in use' });
            return;
        }
        // Check if email is already taken
        result = await checkEmailExists(email);
        if (result !== 0) {
            res.status(ERROR_CODE).json({ error: 'Email already in use' });
            return;
        }
    } catch (error) {
        res.status(ERROR_CODE).json({ error: 'Error in register' });
        console.log("Error in register: ", error);
        return;
    }
    // Add new user to database
    addUser(username, email, password);

    // Return success status
    res.status(SUCCESS_CODE).send();
    return;
};