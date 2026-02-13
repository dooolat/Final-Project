import protect from "../middleware/auth.middleware.js";
import { createPhoto } from "../controllers/photo.controller.js";
import {
  createComment,
  getCommentsByPhoto,
  deleteComment,
} from "../src/controllers/comment.controller.js";

const router = express.Router();

router.post("/photos/:id/comments", protect, createComment);
router.get("/photos/:id/comments", getCommentsByPhoto);
router.delete(
  "/comments/:commentId",
  protect,
  deleteComment
);

export default router;
