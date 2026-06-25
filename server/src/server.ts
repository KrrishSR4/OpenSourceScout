import http from 'http';
import app from './app';
import { config } from './config';
import { logger } from './lib/logger';

const server = http.createServer(app);

const startServer = (): void => {
  server.listen(config.PORT, () => {
    logger.info(`Server is running in ${config.NODE_ENV} mode on port ${config.PORT}`);
  });
};

const gracefulShutdown = (signal: string): void => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);
  
  server.close(() => {
    logger.info('HTTP server closed.');
    // Close other resources (DB connection, redis, etc.) here in future sprints
    logger.info('Graceful shutdown completed. Exiting process.');
    process.exit(0);
  });

  // Force shutdown if connections do not close within 10 seconds
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  logger.error({ promise, reason }, 'Unhandled Promise Rejection');
});

process.on('uncaughtException', (error) => {
  logger.fatal(error, 'Uncaught Exception thrown');
  process.exit(1);
});

startServer();
