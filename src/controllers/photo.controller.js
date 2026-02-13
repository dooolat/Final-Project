import Photo from "../../models/Photo.js";

export const createPhoto = async (req, res, next) => {
  try {
    const { title, imageUrl } = req.body;

    if (!title || !imageUrl) {
      return res.status(400).json({
        message: "Title and imageUrl are required",
      });
    }

    const photo = await Photo.create({
      title,
      imageUrl,
      owner: req.user._id,
      avgRating: 0,
    });

    res.status(201).json(photo);
  } catch (error) {
    next(error);
  }
};

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

export const getPhotoById = async (req, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id).populate("owner", "username");

    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    res.json(photo);
  } catch (error) {
    next(error);
  }
};
