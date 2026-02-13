import Photo from "../../models/Photo.js";
import Comment from "../../models/Comment.js";
import Rating from "../../models/Rating.js";
import User from "../../models/User.js";

// GET /api/users/profile
export const getProfile = async (req, res) => {
  res.json(req.user);
};

// PUT /api/users/profile
export const updateProfile = async (req, res) => {
  const { username } = req.body;

  if (username) {
    req.user.username = username;
  }

  await req.user.save();

  res.json({
    id: req.user._id,
    username: req.user.username,
    email: req.user.email,
  });
};

// GET /api/users/:id/photos
// My Portfolio (public)

export const getUserPortfolio = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const photos = await Photo.find({ owner: userId })
      .sort({ createdAt: -1 });

    res.json(photos);
  } catch (error) {
    next(error);
  }
};

//delete account
export const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user._id;

    await Photo.deleteMany({ owner: userId });

    await Comment.deleteMany({ author: userId });

    await Rating.deleteMany({ user: userId });

    await User.findByIdAndDelete(userId);

    res.json({ message: "Account and all related data deleted" });

  } catch (error) {
    next(error);
  }
};
