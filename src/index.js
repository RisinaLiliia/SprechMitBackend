import dotenv from "dotenv";
dotenv.config();

import setupServer from "./server.js";
import { createDirIfNotExists } from "./utils/createDirIfNotExists.js";
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from "./constants/index.js";
import initMongoConnection from "./config/db.js";

const startServer = async () => {
  try {
    await initMongoConnection();
    await createDirIfNotExists(TEMP_UPLOAD_DIR);
    await createDirIfNotExists(UPLOAD_DIR);
    await setupServer();
    console.log("Server setup completed successfully.");
  } catch (error) {
    console.error("Error while starting server:", error);
    process.exit(1);
  }
};

startServer();
