import { Request, Response, NextFunction } from 'express';
import { httpRequestsTotal, httpRequestDurationMs, httpErrorsTotal } from '../lib/metrics';
import { logger } from '../lib/logger';

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = process.hrtime();

  res.on('finish', () => {
    // Construct the low-cardinality route path
    // e.g., '/api/v1/repositories/:owner/:repo' instead of '/api/v1/repositories/facebook/react'
    const routePath = req.route ? `${req.baseUrl}${req.route.path}` : req.path;
    const method = req.method;
    const statusCode = res.statusCode.toString();

    // Increment request volume counter
    httpRequestsTotal.inc({ method, route: routePath, status_code: statusCode });

    // Track request duration in milliseconds
    const diff = process.hrtime(startTime);
    const durationMs = diff[0] * 1e3 + diff[1] * 1e-6;
    httpRequestDurationMs.observe({ method, route: routePath, status_code: statusCode }, durationMs);

    // If response is an error (status code >= 400), increment error counter
    if (res.statusCode >= 400) {
      httpErrorsTotal.inc({ method, route: routePath, status_code: statusCode });
    }

    // Log request execution details if it takes more than 1000ms
    if (durationMs > 1000) {
      logger.warn({
        requestId: req.id,
        method,
        url: req.originalUrl,
        route: routePath,
        statusCode,
        durationMs: durationMs.toFixed(2),
      }, `Slow request detected: ${method} ${req.originalUrl} took ${durationMs.toFixed(2)}ms`);
    }
  });

  next();
};
