"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const https_1 = require("firebase-functions/v2/https");
const v2_1 = require("firebase-functions/v2");
const auth_1 = require("./auth");
const data_1 = require("./data");
dotenv_1.default.config();
const app = (0, express_1.default)();
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
app.use(express_1.default.json());
// ✅ Routes
app.post("/login", auth_1.login);
app.post("/register", auth_1.register);
app.get("/getAllExercises", data_1.getAllExercises);
app.put("/createExercise", data_1.createOrUpdateExercise);
app.delete("/deleteExercise", data_1.deleteExercise);
// ✅ Local dev server (when not running on Firebase)
if (!process.env.FIREBASE_CONFIG) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`✅ Local server running on port ${PORT}`));
}
// ✅ Firebase config
(0, v2_1.setGlobalOptions)({ region: "us-central1", memory: "256MiB", timeoutSeconds: 60 });
exports.api = (0, https_1.onRequest)(app);
