import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import routes from './routes';
import { requestLogger } from './middlewares/requestLogger';
import { notFoundHandler } from './middlewares/notFoundHandler';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors());

// Request Parsing Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging Middleware
app.use(requestLogger);

// API Routes
app.use('/', routes);

// Fallback Handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
