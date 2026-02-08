import Photo from "../../models/Photo.js";

// CREATE photo (with file upload)
export const createPhoto = async (req, res, next) => {
  try {
    // 1. Проверка, что файл пришёл
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // 2. Берём title из form-data
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // 3. Создаём фото
    const photo = await Photo.create({
      title,
      imageUrl: `/uploads/photos/${req.file.filename}`, // ← ВАЖНО
      owner: req.user._id,
    });

    res.status(201).json(photo);
  } catch (error) {
    next(error);
  }
};

// GET all photos (public)
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

// GET one photo by id
export const getPhotoById = async (req, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id).populate(
      "owner",
      "username"
    );

    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    res.json(photo);
  } catch (error) {
    next(error);
  }
};

// DELETE photo (only owner)
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
