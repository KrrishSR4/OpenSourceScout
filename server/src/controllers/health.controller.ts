import { Request, Response } from 'express';
import { config } from '../config';
import { prisma } from '../lib/prisma';
import { redis } from '../lib/redis';

// Helper to timeout a promise if it takes too long
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Check timeout')), timeoutMs)
    ),
  ]);
};

export const getHealth = async (_req: Request, res: Response): Promise<void> => {
  let dbStatus = 'UP';
  try {
    // Timeout DB ping after 2000ms
    await withTimeout(prisma.$queryRaw`SELECT 1`, 2000);
  } catch (err) {
    dbStatus = 'DOWN';
  }

  let redisStatus = 'UP';
  try {
    if (redis) {
      // Timeout Redis ping after 2000ms
      await withTimeout(redis.ping(), 2000);
    } else {
      redisStatus = 'DOWN';
    }
  } catch (err) {
    redisStatus = 'DOWN';
  }

  const isOverallHealthy = dbStatus === 'UP' && redisStatus === 'UP';

  res.status(isOverallHealthy ? 200 : 503).json({
    success: isOverallHealthy,
    status: isOverallHealthy ? 'UP' : 'DEGRADED',
    environment: config.NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      api: 'UP',
      database: dbStatus,
      redis: redisStatus,
    },
    system: {
      memoryUsage: process.memoryUsage(),
      nodeVersion: process.version,
    },
  });
};

export const getReady = async (_req: Request, res: Response): Promise<void> => {
  let dbReady = true;
  try {
    await withTimeout(prisma.$queryRaw`SELECT 1`, 2000);
  } catch (err) {
    dbReady = false;
  }

  let redisReady = true;
  try {
    if (redis) {
      await withTimeout(redis.ping(), 2000);
    } else {
      redisReady = false;
    }
  } catch (err) {
    redisReady = false;
  }

  if (dbReady && redisReady) {
    res.status(200).json({
      success: true,
      status: 'READY',
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(503).json({
      success: false,
      status: 'NOT_READY',
      checks: {
        database: dbReady ? 'UP' : 'DOWN',
        redis: redisReady ? 'UP' : 'DOWN',
      },
      timestamp: new Date().toISOString(),
    });
  }
};

export const getLive = (_req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    status: 'ALIVE',
    timestamp: new Date().toISOString(),
  });
};
