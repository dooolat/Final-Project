import express from "express";
import protect from "../src/middleware/auth.middleware.js";
import upload from "../src/utils/upload.js"; 
import {
  createPhoto,
  getAllPhotos,
  getPhotoById,
  deletePhoto,
} from "../src/controllers/photo.controller.js";

const router = express.Router();

router.post(
  "/",
  protect,
  upload.single("image"), 
  createPhoto
);

router.get("/", getAllPhotos);
router.get("/:id", getPhotoById);
router.delete("/:id", protect, deletePhoto);

export default router;
