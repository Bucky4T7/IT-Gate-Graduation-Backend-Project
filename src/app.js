const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const allRoutes = require("./routes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const logger = require("./utils/logger");

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL || "http://localhost:3000" })); // Adjust origin in production
app.use(cookieParser());

// Request logging
app.use(morgan("dev"));

// Rate limiting to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use(limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for uploads
app.use("/uploads", express.static("uploads"));

// API Routes
app.use("/api", allRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ message: "API is healthy" });
});

// Not Found Middleware
app.use(notFound);

// Error Handler Middleware
app.use(errorHandler);

module.exports = app;

