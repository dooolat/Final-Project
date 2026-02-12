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

/*
  POST /api/photos
  Создание фото
  Требует:
  - JWT токен
  - form-data:
      title (text)
      image (file)
*/
router.post(
  "/",
  protect,
  upload.single("image"),
  createPhoto
);

/*
  GET /api/photos
*/
router.get("/", getAllPhotos);

/*
  GET /api/photos/:id
*/
router.get("/:id", getPhotoById);

/*
  DELETE /api/photos/:id
*/
router.delete("/:id", protect, deletePhoto);

export default router;
