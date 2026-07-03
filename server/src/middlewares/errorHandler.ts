import { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger';
import { config } from '../config';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error({
    err: {
      message: err.message,
      stack: err.stack,
      ...err,
    },
    req: {
      method: req.method,
      url: req.url,
      ip: req.ip,
    },
  }, 'Unhandled exception occurred during request execution');

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(config.NODE_ENV === 'development' ? { stack: err.stack } : {}),
    },
  });
};
