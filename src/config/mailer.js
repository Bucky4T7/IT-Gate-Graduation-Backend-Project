const nodemailer = require("nodemailer");
const env = require("./env");
const logger = require("../utils/logger");

const transporter = nodemailer.createTransport({
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  secure: false, // Use `true` for port 465, `false` for other ports
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASS,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    logger.error(`Nodemailer connection error: ${error.message}`);
  } else {
    logger.info("Nodemailer ready to send emails");
  }
});

module.exports = transporter;

