import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  register,
  login,
  profile,
  pfpUpdate,
} from "../controllers/authController.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authenticate, profile);

router.patch("/user/pfp", authenticate, upload.single("pfp"), pfpUpdate);

export default router;
