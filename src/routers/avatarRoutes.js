import express from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import { saveFileToCloudinary } from "../services/cloudinaryService.js";

const router = express.Router();

router.post("/upload-avatar", upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const cloudinaryUrl = await saveFileToCloudinary(req.file);

    res.status(200).json({ url: cloudinaryUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка при загрузке аватара" });
  }
});

export default router;
