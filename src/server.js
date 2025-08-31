import express from "express";
import pino from "pino-http";
import cors from "cors";
import cookieParser from "cookie-parser";
import initMongoConnection from "./db/initMongoConnection.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import errorHandler from "./middlewares/errorHandler.js";
import authRouter from "./routers/authRouter.js";
import userRoutes from "./routers/userRoutes.js";
import { UPLOAD_DIR } from "../src/constants/index.js";

import { swaggerDocs } from "./middlewares/swaggerDocs.js";

const app = express();
app.use("/uploads", express.static(UPLOAD_DIR));
app.use("/api-docs", swaggerDocs());

const allowedOrigins = [
  "http://localhost:5173",
  "https://sprech-mit-front.vercel.app",
  "https://sprechmitbackend.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

export default async function setupServer() {
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  if (process.env.NODE_ENV !== "development") {
    app.use(pino());
  }

  app.use("/api/auth", authRouter);
  app.use("/api/users", userRoutes);

  app.use(errorHandler);
  app.use(notFoundHandler);

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  await initMongoConnection();
}
