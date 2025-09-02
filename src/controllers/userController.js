import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { UsersCollection } from "../models/userModel.js";

export const getCurrentUser = async (req, res, next) => {
  try {
    if (!req.user?._id) throw createHttpError(401, "Not authorized");

    const user = await UsersCollection.findById(req.user._id).select(
      "-password"
    );
    if (!user) throw createHttpError(404, "User not found");

    res.status(200).json({ status: 200, message: "User info", data: user });
  } catch (err) {
    next(err);
  }
};

export const updateCurrentUser = async (req, res, next) => {
  try {
    if (!req.user?._id) throw createHttpError(401, "Not authorized");

    const allowedFields = ["name", "avatarUrl", "languageLevel", "progress"];
    const updates = {};
    for (const f of allowedFields)
      if (req.body[f] !== undefined) updates[f] = req.body[f];

    const updatedUser = await UsersCollection.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true, select: "-password" }
    );

    if (!updatedUser) throw createHttpError(404, "User not found");

    res
      .status(200)
      .json({ status: 200, message: "User updated", data: updatedUser });
  } catch (err) {
    next(err);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    if (!req.user?._id) throw createHttpError(401, "Not authorized");

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      throw createHttpError(400, "Current and new password are required");
    }

    const user = await UsersCollection.findById(req.user._id).select(
      "+password"
    );
    if (!user) throw createHttpError(404, "User not found");

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw createHttpError(400, "Current password is incorrect");

    user.password = newPassword;
    await user.save();

    res.status(200).json({ status: 200, message: "Password updated" });
  } catch (err) {
    next(err);
  }
};
