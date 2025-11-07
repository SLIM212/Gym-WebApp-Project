"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.register = exports.login = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const EmailValidator = __importStar(require("email-validator"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const data_1 = require("./data");
// Setup
dotenv_1.default.config();
const app = (0, express_1.default)();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const USERNAME_MIN_LEN = 5;
const PASS_MIN_LEN = 6;
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
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bcrypt = require('bcryptjs');
    // take in inputs from HTTP request
    const { usernameOrEmail, password } = req.body;
    // check if they provided an email or username
    const email = EmailValidator.validate(usernameOrEmail);
    let userId;
    try {
        if (email) {
            // Check email exists in database
            userId = yield (0, data_1.checkEmailExists)(usernameOrEmail);
            if (userId === '') { // Value of 0 means no database entry with that email found
                res.status(ERROR_CODE).json({ error: 'Invalid User Credentials' });
                return;
            }
            // Obtain password from database
            // checking if hashed password is the same as one in database
            let pass = yield (0, data_1.emailPass)(usernameOrEmail);
            const passwordMatch = yield bcrypt.compare(password, pass);
            if (!passwordMatch) {
                res.status(ERROR_CODE).json({ error: 'Invalid User Credentials' });
                return;
            }
        }
        else {
            // Check if username exists in database
            userId = yield (0, data_1.checkUsernameExists)(usernameOrEmail);
            if (userId === '') { // Value of 0 means no database entry with that username found
                res.status(ERROR_CODE).json({ error: 'Invalid User Credentials' });
                return;
            }
            // Obtain password from database
            let pass = yield (0, data_1.usernamePass)(usernameOrEmail);
            const passwordMatch = yield bcrypt.compare(password, pass);
            if (!passwordMatch) {
                res.status(ERROR_CODE).json({ error: 'Invalid User Credentials' });
                return;
            }
        }
    }
    catch (error) {
        console.log("Error in login: ", error);
        res.status(ERROR_CODE).json({ error: 'Error in login' });
        return;
    }
    // Return success with the token
    res.status(SUCCESS_CODE).json({ token: jsonwebtoken_1.default.sign({ sub: userId }, JWT_SECRET, { algorithm: 'HS256', expiresIn: TOKEN_TIMEOUT }) });
    return;
});
exports.login = login;
/**
 * Register function handles user validation and token sending
 * @param req.body.usernameOrEmail
 * @param req.body.password
 * @returns res.status(200).json(token) on success and res.status(400) on fail
 */
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    const bcrypt = require('bcryptjs');
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
        let result = yield (0, data_1.checkUsernameExists)(username);
        if (result !== null) {
            res.status(ERROR_CODE).json({ error: 'Username already in use' });
            return;
        }
        // Check if email is already taken
        result = yield (0, data_1.checkEmailExists)(email);
        if (result !== null) {
            res.status(ERROR_CODE).json({ error: 'Email already in use' });
            return;
        }
    }
    catch (error) {
        res.status(ERROR_CODE).json({ error: 'Error in register' });
        console.log("Error in register: ", error);
        return;
    }
    // need to bcrypt the password before sending it to the backend
    const saltRounds = 10; // Cost factor - higher is more secure but slower
    const hashedPassword = yield bcrypt.hash(password, saltRounds);
    // Add new user to database
    (0, data_1.addUser)(username, email, hashedPassword);
    // Return success status
    res.status(SUCCESS_CODE).json({ message: "Registration successful" });
    return;
});
exports.register = register;
