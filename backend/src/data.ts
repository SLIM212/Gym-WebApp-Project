import dotenv from "dotenv";
import fs from 'fs';
import { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import sqlite3, { Database } from 'sqlite3';

// Setup
dotenv.config();
const jwt = require('jsonwebtoken');
const JWT_SECRET: string = 'qwertyquackersontop';
const DATABASE_PATH = './data.db';
const SCHEMA_PATH = './schema.sql';
export let db: Database;
// will need to add token verification here using JWTverify

export function checkEmailExists(usernameOrEmail: string) {
    usernameOrEmail = '';
    return 0;
}

export function emailPass(usernameOrEmail: string) {
    usernameOrEmail = '';
    return 0;
}

export function checkUsernameExists(usernameOrEmail: string) {
    usernameOrEmail = '';
    return 0;
}

export function addUser(username: string, email: string, password: string) {
    return 0;
}

export function usernamePass(usernameOrEmail: string) {
    usernameOrEmail = '';
    return 0;
}
export function changePassword() {
    return 0;
}