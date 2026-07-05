import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import routes from './routes';
import { requestLogger } from './middlewares/requestLogger';
import { metricsMiddleware } from './middlewares/metrics.middleware';
import { register } from './lib/metrics';
import { notFoundHandler } from './middlewares/notFoundHandler';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors());

// Request Parsing Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging & Metrics Middlewares
app.use(requestLogger);
app.use(metricsMiddleware);

// Prometheus Metrics Endpoint
app.get('/metrics', async (_req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

// API Routes
app.use('/', routes);

// Fallback Handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
