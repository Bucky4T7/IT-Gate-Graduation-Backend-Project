const app = require("./app");
const connectDB = require("./config/db");
const { connectRedis } = require("./config/redis");
const env = require("./config/env");
const logger = require("./utils/logger");

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    const PORT = env.PORT || 5000;
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(`Server startup error: ${error.message}`);
    process.exit(1);
  }
};

startServer();

