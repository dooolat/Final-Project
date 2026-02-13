import express from "express";
import protect from "../middleware/auth.middleware.js";
import { getProfile, updateProfile, getUserPortfolio } from "../controllers/user.controller.js";


const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// Portfolio (public)
router.get("/:id/photos", getUserPortfolio);

export default router;
