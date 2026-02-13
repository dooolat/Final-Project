import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import photoRoutes from "./routes/photo.routes.js";
import ratingRoutes from "./routes/rating.routes.js";
import commentRoutes from "./routes/comment.routes.js";

// __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

// CORS
app.use(cors({
  origin: [
    "http://localhost:5000",
    "http://localhost:5500",
    "https://final-project-wamq.onrender.com"
  ],
  credentials: true
}));

// static folders
app.use(express.static(path.join(__dirname, "../public")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api", ratingRoutes);
app.use("/api", commentRoutes);

// root → login page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
});

// global error handler
app.use((err, req, res, next) => {
  console.error(err); 
  res.status(err.statusCode || 500).json({
    message: err.message || "Server error",
  });
});

export default app;
