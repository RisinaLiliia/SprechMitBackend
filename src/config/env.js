import dotenv from "dotenv";
import { getEnvVar } from "../utils/getEnvVar.js";

dotenv.config();

export const APP = {
  PORT: Number(getEnvVar("PORT", 3000)),
  DOMAIN: getEnvVar("APP_DOMAIN", "http://localhost:3000"),
  JWT_SECRET: getEnvVar("JWT_SECRET"),
  NODE_ENV: getEnvVar("NODE_ENV", "development"),
};

export const DB = {
  USER: getEnvVar("MONGODB_USER", ""),
  PASSWORD: getEnvVar("MONGODB_PASSWORD", ""),
  URL: getEnvVar("MONGODB_URL"),
  NAME: getEnvVar("MONGODB_DB"),
  get URI() {
    const auth =
      this.USER && this.PASSWORD
        ? `${encodeURIComponent(this.USER)}:${encodeURIComponent(
            this.PASSWORD
          )}@`
        : "";
    return `mongodb+srv://${auth}${this.URL}/${this.NAME}?retryWrites=true&w=majority`;
  },
};

export const SMTP = {
  HOST: getEnvVar("SMTP_HOST"),
  PORT: Number(getEnvVar("SMTP_PORT", 587)),
  USER: getEnvVar("SMTP_USER"),
  PASSWORD: getEnvVar("SMTP_PASSWORD"),
  FROM: getEnvVar("SMTP_FROM"),
};

export const CLOUDINARY = {
  ENABLED: getEnvVar("ENABLE_CLOUDINARY", "true") === "true",
  CLOUD_NAME: getEnvVar("CLOUDINARY_CLOUD_NAME"),
  API_KEY: getEnvVar("CLOUDINARY_API_KEY"),
  API_SECRET: getEnvVar("CLOUDINARY_API_SECRET"),
};

export const GOOGLE = {
  CLIENT_ID: getEnvVar("GOOGLE_AUTH_CLIENT_ID"),
  CLIENT_SECRET: getEnvVar("GOOGLE_AUTH_CLIENT_SECRET"),
};
