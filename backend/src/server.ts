import express from "express";
import dotenv from "dotenv";
import { onRequest } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2";
import { login, register } from "./auth";
import { getAllExercises, createOrUpdateExercise, deleteExercise } from "./data";

dotenv.config();
const app = express();

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://gym-web-app-project.web.app",
];

// ✅ Manual CORS handling for Cloud Run
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  // 🔹 Respond to preflight requests immediately
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  next();
});

app.use(express.json());

// ✅ Routes
app.post("/login", login);
app.post("/register", register);
app.get("/getAllExercises", getAllExercises);
app.put("/createExercise", createOrUpdateExercise);
app.delete("/deleteExercise", deleteExercise);

// ✅ Local dev server (when not running on Firebase)
if (!process.env.FIREBASE_CONFIG) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`✅ Local server running on port ${PORT}`));
}

// ✅ Firebase config
setGlobalOptions({ region: "us-central1", memory: "256MiB", timeoutSeconds: 60 });
export const api = onRequest(app);
