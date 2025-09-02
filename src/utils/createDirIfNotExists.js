import fs from "node:fs/promises";

export const createDirIfNotExists = async (dirPath) => {
  try {
    await fs.access(dirPath);
  } catch (err) {
    if (err.code === "ENOENT") {
      await fs.mkdir(dirPath, { recursive: true });
      console.log(`Created directory: ${dirPath}`);
    } else {
      throw err;
    }
  }
};
