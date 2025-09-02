import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { UsersCollection } from "../models/userModel.js";
import { SessionsCollection } from "../models/sessionModel.js";
import { createOrReplaceSession } from "./sessionServices.js";
import { getEnvVar } from "../utils/getEnvVar.js";

const JWT_SECRET = getEnvVar("JWT_SECRET");
const ACCESS_TOKEN_EXPIRES = "15m";
const REFRESH_TOKEN_EXPIRES = "1d";

function generateAccessToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES });
}

function generateRefreshToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES });
}

export async function registerUser({
  name,
  email,
  password,
  role = "student",
  privacyPolicyAccepted,
}) {
  if (!privacyPolicyAccepted) {
    throw createHttpError.BadRequest("Privacy policy must be accepted");
  }

  const existingUser = await UsersCollection.findOne({ email });
  if (existingUser) throw createHttpError.Conflict("Email in use");

  const newUser = await UsersCollection.create({
    name,
    email,
    password,
    role,
    privacyPolicyAcceptedAt: new Date(),
  });

  const accessToken = generateAccessToken(newUser._id);
  const refreshToken = generateRefreshToken(newUser._id);

  await createOrReplaceSession(newUser._id, accessToken, refreshToken);

  return { user: newUser.toJSON(), accessToken, refreshToken };
}

export async function loginUser({ email, password }) {
  const user = await UsersCollection.findOne({ email }).select("+password");
  if (!user || !(await user.isPasswordValid(password))) {
    throw createHttpError.Unauthorized("Invalid email or password");
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  await createOrReplaceSession(user._id, accessToken, refreshToken);

  return { user: user.toJSON(), accessToken, refreshToken };
}

export async function logoutUser(userId) {
  await SessionsCollection.deleteOne({ userId });
  return { message: "Logged out successfully" };
}

export async function refreshTokens(refreshToken) {
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);

    const session = await SessionsCollection.findOne({ refreshToken });
    if (!session) throw createHttpError.Unauthorized("Invalid session");

    if (new Date() > new Date(session.refreshTokenValidUntil)) {
      throw createHttpError.Unauthorized("Refresh token expired");
    }

    const user = await UsersCollection.findById(decoded.userId);
    if (!user) throw createHttpError.Unauthorized("User not found");

    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    await createOrReplaceSession(user._id, newAccessToken, newRefreshToken);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch {
    throw createHttpError.Unauthorized("Invalid or expired refresh token");
  }
}
