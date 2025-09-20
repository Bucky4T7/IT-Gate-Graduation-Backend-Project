const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

const getMyProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

const updateMyProfile = async (userId, updateData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  user.name = updateData.name || user.name;
  user.phone = updateData.phone || user.phone;

  if (updateData.password) {
    user.password = updateData.password; // Pre-save hook will hash it
  }

  await user.save();
  return user.toObject({ getters: true });
};

const softDeleteMyProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  user.isDeleted = true;
  await user.save();
  return { message: "Profile soft-deleted successfully" };
};

const changeMyPassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  if (!(await user.matchPassword(oldPassword))) {
    throw new Error("Invalid old password");
  }

  user.password = newPassword; // Pre-save hook will hash it
  await user.save();
  return { message: "Password changed successfully" };
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  softDeleteMyProfile,
  changeMyPassword,
};

