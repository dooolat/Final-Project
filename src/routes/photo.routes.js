import protect from "../middleware/auth.middleware.js";
import { createPhoto } from "../controllers/photo.controller.js";
import {
  createPhoto,
  getAllPhotos,
  getPhotoById,
} from "../controllers/photo.controller.js";

const router = express.Router();

router.post("/", protect, createPhoto);
router.get("/", getAllPhotos);
router.get("/:id", getPhotoById);

export default router;
