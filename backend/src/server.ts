import express from "express";
import axios from 'axios';
// import {login} from './auth';

// going to need routes for logging in registering and querying database for exercises

const app = express();
app.use(express.json());

// Basic Test Functions
app.get("/", (req, res) => {
    res.send("Backend Server Alive");
});

app.get("/info", (req, res) => {
res.send("This is my gym tracker app");
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// app.post('/auth/login', catchErrors(async (req, res) => {
//   const { email, password, } = req.body;
//   return res.json(await login(email, password));
// }));

// app.post('/auth/register', catchErrors(async (req, res) => {
//   const { email, password, name, } = req.body;
//   return res.json(await register(email, password, name));
// }));