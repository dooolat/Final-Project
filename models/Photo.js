import mongoose from "mongoose";

const photoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    avgRating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Photo = mongoose.model("Photo", photoSchema);
export default Photo;
