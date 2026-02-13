import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
  createPhoto,
  getAllPhotos,
  getPhotoById,
  deletePhoto,
} from "../controllers/photo.controller.js";

const router = express.Router();

router.post("/", protect, createPhoto);
router.get("/", getAllPhotos);
router.get("/:id", getPhotoById);
router.delete("/:id", protect, deletePhoto);

export default router;
