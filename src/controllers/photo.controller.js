import Photo from "../../models/Photo.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

// CREATE photo
export const createPhoto = async (req, res, next) => {
  try {
    // Проверка файла
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Загружаем в Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Удаляем временный файл с сервера
    fs.unlinkSync(req.file.path);

    // Сохраняем в MongoDB
    const photo = await Photo.create({
      title,
      imageUrl: result.secure_url,
      owner: req.user._id,
      avgRating: 0,
    });

    res.status(201).json(photo);
  } catch (error) {
    next(error);
  }
};

// GET all photos
export const getAllPhotos = async (req, res, next) => {
  try {
    const photos = await Photo.find()
      .populate("owner", "username")
      .sort({ createdAt: -1 });

    res.json(photos);
  } catch (error) {
    next(error);
  }
};

// GET one photo
export const getPhotoById = async (req, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id)
      .populate("owner", "username");

    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    res.json(photo);
  } catch (error) {
    next(error);
  }
};

// DELETE photo
export const deletePhoto = async (req, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    if (photo.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await photo.deleteOne();

    res.json({ message: "Photo deleted" });
  } catch (error) {
    next(error);
  }
};
