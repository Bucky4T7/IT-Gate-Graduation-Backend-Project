const jwt = require('jsonwebtoken');
const env = require('../config/env');

const generateToken = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};

const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateAccessToken: (payload) => generateToken(payload, env.JWT_SECRET, '15m'),
  generateRefreshToken: (payload) => generateToken(payload, env.JWT_REFRESH_SECRET, '7d'),
  verifyAccessToken: (token) => verifyToken(token, env.JWT_SECRET),
  verifyRefreshToken: (token) => verifyToken(token, env.JWT_REFRESH_SECRET),
};

