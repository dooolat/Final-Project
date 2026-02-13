import express from "express";
import protect from "../middleware/auth.middleware.js";
import { getProfile, updateProfile, getUserPortfolio, deleteAccount } from "../controllers/user.controller.js";


const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.delete("/profile", protect, deleteAccount);

// Portfolio (public)
router.get("/:id/photos", getUserPortfolio);

export default router;
