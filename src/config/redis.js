const redis = require('redis');
const env = require('./env');
const logger = require('../utils/logger');

const client = redis.createClient({
  url: env.REDIS_URI
});

client.on('connect', () => logger.info('Redis Connected...'));
client.on('error', (err) => logger.error(`Redis Connection Error: ${err.message}`));

const connectRedis = async () => {
  if (!client.isOpen) {
    await client.connect();
  }
};

module.exports = { client, connectRedis };

