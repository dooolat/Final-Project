import express from "express";
import protect from "../middleware/auth.middleware.js";
import { ratePhoto } from "../controllers/rating.controller.js";

const router = express.Router();

router.post("/photos/:id/rate", protect, ratePhoto);

export default router;
