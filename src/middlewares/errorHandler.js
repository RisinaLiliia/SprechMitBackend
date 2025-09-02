import { isHttpError } from "http-errors";

export default function errorHandler(err, req, res, next) {
  if (isHttpError(err)) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
      ...(err.details ? { errors: err.details } : {}),
    });
  }
  console.error("Unexpected error:", err);
  res.status(500).json({ status: 500, message: "Something went wrong" });
}
