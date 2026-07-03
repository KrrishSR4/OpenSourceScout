import Redis from 'ioredis';
import { config } from '../config';
import { logger } from './logger';

let redisClient: Redis | null = null;

if (config.REDIS_URL) {
  try {
    redisClient = new Redis(config.REDIS_URL, {
      maxRetriesPerRequest: 1,
      retryStrategy(times) {
        if (times > 3) {
          logger.warn('Redis connection retries exceeded. Proceeding without Redis.');
          return null;
        }
        return 5000;
      },
    });

    redisClient.on('connect', () => {
      logger.info('Connected to Redis successfully');
    });

    redisClient.on('error', (error) => {
      logger.error(error, 'Redis Connection Error');
    });
  } catch (error) {
    logger.error(error, 'Failed to initialize Redis client');
    redisClient = null;
  }
} else {
  logger.info('REDIS_URL not configured. Redis caching is disabled.');
}

export const redis = redisClient;
