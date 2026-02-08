import express from "express";
import cors from "cors";
import authRoutes from "../routes/auth.routes.js";
import userRoutes from "../routes/user.routes.js";
import photoRoutes from "../routes/photo.routes.js";
import ratingRoutes from "../routes/rating.routes.js";
import commentRoutes from "../routes/comment.routes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// frontend
app.use(express.static(path.join(__dirname, "../public")));
// Middleware
const app = express();
app.use(cors({
  origin: "*"
}));

app.use(express.json());


app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/photos", photoRoutes); 
app.use("/api", ratingRoutes);
app.use("/api", commentRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Photography Portfolio API is running" });
});

// Global error handler
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    message: err.message || "Server error",
  });
});


function uploadPhoto() {
  const title = document.getElementById("title").value;
  const image = document.getElementById("image").files[0];

  if (!title || !image) {
    alert("Title and image are required");
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("image", image);

  fetch(`${API}/photos`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: formData,
  })
    .then(res => res.json())
    .then(() => {
      loadPortfolio(); 
    });
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
});

export default app;
