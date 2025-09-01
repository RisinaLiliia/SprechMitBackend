import express from "express";
import {
  getCurrentUser,
  updateCurrentUser,
  updatePassword,
} from "../controllers/userController.js";
import { authenticate } from "../middlewares/authenticate.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";

const router = express.Router();

router.get("/", authenticate, ctrlWrapper(getCurrentUser));
router.put("/", authenticate, ctrlWrapper(updateCurrentUser));
router.patch("/password", authenticate, ctrlWrapper(updatePassword));

export default router;
