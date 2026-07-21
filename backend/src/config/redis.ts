import Redis from 'ioredis';
import { config } from './env';
import { logger } from '../utils/logger';

export const redisConnectionOptions = {
  host: config.redisHost,
  port: config.redisPort,
  password: config.redisPassword || undefined,
  maxRetriesPerRequest: null,
  enableOfflineQueue: false,
  retryStrategy: (times: number) => {
    if (times > 3) {
      // Stop logging repeated connection retry attempts if Redis server is offline
      return null;
    }
    return Math.min(times * 500, 2000);
  },
};

export const createRedisClient = (): Redis => {
  const redis = new Redis(redisConnectionOptions);

  redis.on('connect', () => {
    logger.info('Redis client connected successfully');
  });

  redis.on('error', (err) => {
    // Log initial connection failure gently
    if (err.message.includes('ECONNREFUSED')) {
      logger.warn('Redis server is not running on port 6379. Direct Backend Mode is enabled.');
    } else {
      logger.warn(`Redis connection status: ${err.message}`);
    }
  });

  return redis;
};
