import { redis } from '../lib/redis';
import { config } from '../config';
import { logger } from '../lib/logger';
import { cacheHitsTotal, cacheMissesTotal } from '../lib/metrics';

export class CacheService {
  /**
   * Get cached data by key.
   */
  public static async get<T>(key: string): Promise<T | null> {
    if (!redis) return null;

    try {
      const data = await redis.get(key);
      if (data) {
        logger.info({ key }, `CACHE_HIT for key: ${key}`);
        cacheHitsTotal.inc();
        return JSON.parse(data) as T;
      }
      logger.info({ key }, `CACHE_MISS for key: ${key}`);
      cacheMissesTotal.inc();
    } catch (error) {
      logger.error(error, `Failed to get cache for key: ${key}`);
    }
    return null;
  }

  /**
   * Set cached data with TTL.
   */
  public static async set(key: string, value: any, ttlSeconds: number = config.CACHE_TTL): Promise<void> {
    if (!redis) return;

    try {
      const dataStr = JSON.stringify(value);
      await redis.set(key, dataStr, 'EX', ttlSeconds);
      logger.info(`CACHE_STORED for key: ${key} with TTL: ${ttlSeconds}s`);
    } catch (error) {
      logger.error(error, `Failed to set cache for key: ${key}`);
    }
  }

  /**
   * Delete cached data.
   */
  public static async del(key: string): Promise<void> {
    if (!redis) return;

    try {
      await redis.del(key);
      logger.info(`CACHE_DELETED for key: ${key}`);
    } catch (error) {
      logger.error(error, `Failed to delete cache for key: ${key}`);
    }
  }
}
