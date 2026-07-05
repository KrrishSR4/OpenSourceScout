import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { logger } from '../lib/logger';

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 minutes
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
  handler: (req: Request, res: Response, _next, options) => {
    logger.warn(
      {
        ip: req.ip,
        method: req.method,
        url: req.originalUrl,
        userAgent: req.headers['user-agent'],
      },
      'Rate limit violation detected'
    );
    res.status(options.statusCode).json(options.message);
  },
});
