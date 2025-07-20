// // backend/src/config/redisClient.js
// // This file configures and exports a Redis client instance.
// // It connects to a Redis server using the URL from environment variables.
const Redis = require('redis');

let redisClient;

(async () => {
  redisClient = Redis.createClient({
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
  });

  redisClient.on('error', (err) => console.error('❌ Redis Client Error:', err));
  redisClient.on('connect', () => console.log('✅ Redis Connected'));

  await redisClient.connect();
})();

module.exports = redisClient;
