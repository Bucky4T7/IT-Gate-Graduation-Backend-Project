require('dotenv').config();

const env = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce',
  REDIS_URI: process.env.REDIS_URI || 'redis://localhost:6379',
  JWT_SECRET: process.env.JWT_SECRET || 'supersecretjwtkey',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'supersecretjwtrefreshkey',
  MAIL_HOST: process.env.MAIL_HOST || 'smtp.ethereal.email',
  MAIL_PORT: process.env.MAIL_PORT || 587,
  MAIL_USER: process.env.MAIL_USER || 'user@ethereal.email',
  MAIL_PASS: process.env.MAIL_PASS || 'password',
};

module.exports = env;

