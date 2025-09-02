import createHttpError from "http-errors";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshTokens,
} from "../services/authServices.js";

const setCookies = (res, accessToken, refreshToken) => {
  const isProd = process.env.NODE_ENV === "production";

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    maxAge: 15 * 60 * 1000,
    path: "/",
  });
};

export const registerUserController = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await registerUser(req.body);
    setCookies(res, accessToken, refreshToken);
    res
      .status(201)
      .json({ status: 201, message: "User registered", data: { user } });
  } catch (err) {
    if (err.status === 409)
      return next(createHttpError.Conflict("Email already in use"));
    next(err);
  }
};

export const loginUserController = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await loginUser(req.body);
    setCookies(res, accessToken, refreshToken);
    res
      .status(200)
      .json({ status: 200, message: "Login successful", data: { user } });
  } catch (err) {
    if (err.status === 401)
      return next(createHttpError.Unauthorized("Invalid email or password"));
    next(err);
  }
};

export const logoutUserController = async (req, res, next) => {
  try {
    const { user } = req;
    if (!user) throw createHttpError.Unauthorized("User not authenticated");

    await logoutUser(user._id);

    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const refreshUserSessionController = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
      throw createHttpError.Unauthorized("Missing refresh token");

    const tokens = await refreshTokens(refreshToken);
    setCookies(res, tokens.accessToken, tokens.refreshToken);

    res.status(200).json({ status: 200, message: "Tokens refreshed" });
  } catch (err) {
    next(err);
  }
};
