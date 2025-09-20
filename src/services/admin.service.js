const User = require("../models/user.model");

const getAllUsers = async (filters, pagination) => {
  const { search, role, isBlocked, isDeleted } = filters;
  const { page = 1, limit = 10 } = pagination;

  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }
  if (role) {
    query.role = role;
  }
  if (isBlocked !== undefined) {
    query.isBlocked = isBlocked;
  }
  if (isDeleted !== undefined) {
    query.isDeleted = isDeleted;
  }

  const users = await User.find(query)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .select("-password")
    .exec();

  const count = await User.countDocuments(query);

  return {
    users,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  };
};

const getUserById = async (id) => {
  const user = await User.findById(id).select("-password");
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

const blockUser = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error("User not found");
  }
  user.isBlocked = true;
  await user.save();
  return { message: "User blocked successfully" };
};

const unblockUser = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error("User not found");
  }
  user.isBlocked = false;
  await user.save();
  return { message: "User unblocked successfully" };
};

const changeUserRole = async (id, newRole) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error("User not found");
  }
  user.role = newRole;
  await user.save();
  return { message: `User role changed to ${newRole}` };
};

const deleteUser = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error("User not found");
  }
  user.isDeleted = true;
  await user.save();
  return { message: "User soft-deleted successfully" };
};

const updateAdminProfile = async (adminId, updateData) => {
  const admin = await User.findById(adminId);
  if (!admin) {
    throw new Error("Admin not found");
  }

  admin.name = updateData.name || admin.name;
  admin.phone = updateData.phone || admin.phone;

  if (updateData.password) {
    admin.password = updateData.password; // Pre-save hook will hash it
  }

  await admin.save();
  return admin.toObject({ getters: true });
};

module.exports = {
  getAllUsers,
  getUserById,
  blockUser,
  unblockUser,
  changeUserRole,
  deleteUser,
  updateAdminProfile,
};




const getAdmins = async (pagination) => {
  const { page = 1, limit = 10 } = pagination;
  const query = { role: "Admin" };

  const admins = await User.find(query)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .select("-password")
    .exec();

  const count = await User.countDocuments(query);

  return {
    admins,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  };
};

const addAdmin = async (userData) => {
  const { email, password, name, phone } = userData;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("User with this email already exists");
  }

  const admin = await User.create({ email, password, name, phone, role: "Admin", isConfirmEmail: true });
  return admin.toObject({ getters: true });
};

const deleteAdmin = async (id) => {
  const admin = await User.findById(id);
  if (!admin || admin.role !== "Admin") {
    throw new Error("Admin not found");
  }
  await admin.deleteOne(); // Hard delete for admin management
  return { message: "Admin deleted successfully" };
};

const changeAdminRole = async (id, newRole) => {
  const admin = await User.findById(id);
  if (!admin || admin.role !== "Admin") {
    throw new Error("Admin not found");
  }
  admin.role = newRole;
  await admin.save();
  return { message: `Admin role changed to ${newRole}` };
};

module.exports = {
  getAllUsers,
  getUserById,
  blockUser,
  unblockUser,
  changeUserRole,
  deleteUser,
  updateAdminProfile,
  getAdmins,
  addAdmin,
  deleteAdmin,
  changeAdminRole,
};

