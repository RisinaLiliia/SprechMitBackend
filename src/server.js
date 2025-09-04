import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import pino from "pino-http";
import compression from "compression";

import initMongoConnection from "./config/db.js";
import authRouter from "./routers/authRouter.js";
import userRouter from "./routers/userRoutes.js";

import errorHandler from "./middlewares/errorHandler.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import { UPLOAD_DIR } from "./constants/index.js";
import { swaggerDocs } from "./middlewares/swaggerDocs.js";

export default async function setupServer() {
  const app = express();

  app.use(helmet());

  if (process.env.NODE_ENV !== "development") {
    app.use(pino());
  }

  app.use(compression());

  const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");

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
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use("/uploads", express.static(UPLOAD_DIR));

  app.use("/api-docs", swaggerDocs());

  app.get("/", (_, res) => {
    res.send("Welcome to the API!");
  });

  app.use("/api/auth", authRouter);
  app.use("/api/users", userRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  await initMongoConnection();

  const PORT = process.env.PORT || 3000;

  return new Promise((resolve) => {
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      resolve({ app, server });
    });
  });
}
