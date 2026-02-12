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
