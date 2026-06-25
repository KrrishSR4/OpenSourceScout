import { Request, Response } from 'express';
import { config } from '../config';

export const getHealth = (_req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    status: 'UP',
    environment: config.NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    system: {
      memoryUsage: process.memoryUsage(),
      nodeVersion: process.version,
    },
  });
};

export const getReady = (_req: Request, res: Response): void => {
  // In later sprints, database and cache connection status can be verified here
  res.status(200).json({
    success: true,
    status: 'READY',
    timestamp: new Date().toISOString(),
  });
};

export const getLive = (_req: Request, res: Response): void => {
  res.status(200).send('OK');
};
