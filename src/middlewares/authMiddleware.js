const jwt = require("jsonwebtoken");
const { errorResponse } = require("../utils/response");
const env = require("../config/env");
const User = require("../models/user.model");

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return errorResponse(res, "User not found", 401);
      }

      next();
    } catch (error) {
      console.error(error);
      return errorResponse(res, "Not authorized, token failed", 401);
    }
  }

  if (!token) {
    return errorResponse(res, "Not authorized, no token", 401);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorResponse(res, `User role ${req.user.role} is not authorized to access this route`, 403);
    }
    next();
  };
};

module.exports = {
  protect,
  authorize,
};

