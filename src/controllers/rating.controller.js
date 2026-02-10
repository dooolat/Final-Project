import mongoose from "mongoose";
import Rating from "../../models/Rating.js";
import Photo from "../../models/Photo.js";

export const ratePhoto = async (req, res, next) => {
  try {
    const { value } = req.body;
    const photoId = req.params.id;

    if (!value || value < 1 || value > 5) {
      return res.status(400).json({ message: "Rating must be 1–5" });
    }

    await Rating.findOneAndUpdate(
      { user: req.user._id, photo: photoId },
      { value },
      { upsert: true, new: true }
    );

    const stats = await Rating.aggregate([
      {
        $match: {
          photo: new mongoose.Types.ObjectId(photoId),
        },
      },
      {
        $group: {
          _id: "$photo",
          avgRating: { $avg: "$value" },
        },
      },
    ]);

    const avgRating = stats.length ? Number(stats[0].avgRating.toFixed(1)) : 0;

    await Photo.findByIdAndUpdate(photoId, { avgRating });

    res.json({ avgRating });
  } catch (error) {
    next(error);
  }
};
