import Comment from "../../models/Comment.js";

// CREATE comment
export const createComment = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    const comment = await Comment.create({
      text,
      author: req.user._id,
      photo: req.params.id,
    });

    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

// GET comments for photo
export const getCommentsByPhoto = async (req, res, next) => {
  try {
    const comments = await Comment.find({ photo: req.params.id })
      .populate("author", "username")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    next(error);
  }
};

// DELETE comment (only author)
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (error) {
    next(error);
  }
};
