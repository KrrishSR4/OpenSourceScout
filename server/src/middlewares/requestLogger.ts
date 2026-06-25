import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { logger } from '../lib/logger';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      id: string;
    }
  }
}

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const requestId = (req.headers['x-request-id'] as string) || crypto.randomUUID();
  req.id = requestId;
  res.setHeader('X-Request-ID', requestId);

  const startTime = process.hrtime();

  logger.info({
    requestId,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  }, `Incoming request: ${req.method} ${req.url}`);

  res.on('finish', () => {
    const diff = process.hrtime(startTime);
    const durationMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);

    logger.info({
      requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      durationMs,
    }, `Request completed: ${req.method} ${req.url} -> Status ${res.statusCode} in ${durationMs}ms`);
  });

  next();
};
