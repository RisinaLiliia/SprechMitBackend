import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { SessionsCollection } from "../models/sessionModel.js";
import { UsersCollection } from "../models/userModel.js";
import { getEnvVar } from "../utils/getEnvVar.js";

const JWT_SECRET = getEnvVar("JWT_SECRET");

export const authenticate = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader)
    return next(createHttpError(401, "Authorization header is missing"));

  const [bearer, token] = authHeader.split(" ");
  if (bearer !== "Bearer" || !token) {
    return next(createHttpError(401, "Auth header must be of type Bearer"));
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    const session = await SessionsCollection.findOne({ accessToken: token });
    if (!session) return next(createHttpError(401, "Session not found"));

    if (new Date() > new Date(session.accessTokenValidUntil)) {
      return next(createHttpError(401, "Access token expired"));
    }

    const user = await UsersCollection.findById(payload.userId);
    if (!user) return next(createHttpError(401, "User not found"));

    req.user = user;
    next();
  } catch {
    next(createHttpError(401, "Invalid token"));
  }
};
