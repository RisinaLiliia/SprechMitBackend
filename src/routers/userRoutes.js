import { Router } from "express";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import { authenticate } from "../middlewares/authenticate.js";
import {
  getCurrentUser,
  updateCurrentUser,
  updatePassword,
} from "../controllers/userController.js";

const router = Router();

router.get("/", authenticate, ctrlWrapper(getCurrentUser));
router.put("/", authenticate, ctrlWrapper(updateCurrentUser));
router.patch("/password", authenticate, ctrlWrapper(updatePassword));

export default router;
