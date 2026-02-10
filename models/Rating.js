import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    value: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    photo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Photo",
      required: true,
    },
  },
  { timestamps: true }
);


ratingSchema.index({ user: 1, photo: 1 }, { unique: true });

const Rating = mongoose.model("Rating", ratingSchema);
export default Rating;
