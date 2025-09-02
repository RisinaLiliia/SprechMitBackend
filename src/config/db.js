import mongoose from "mongoose";
import { DB } from "./env.js";

export const initMongoConnection = async () => {
  try {
    await mongoose.connect(DB.URI);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default initMongoConnection;
