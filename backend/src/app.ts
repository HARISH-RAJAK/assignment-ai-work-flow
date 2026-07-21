import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { config } from './config/env';
import { morganMiddleware } from './utils/morgan';
import { apiRateLimiter } from './middlewares/rateLimiter';
import { errorHandler } from './middlewares/errorHandler';
import routes from './routes';

const app: Application = express();

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Enable Production CORS (Allows deployed frontend & local development)
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, postman) or match origin
      if (!origin || config.corsOrigin === '*' || origin.includes('onrender.com') || origin.includes('localhost')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive CORS for deployed clients
      }
    },
    credentials: true,
  })
);

// Request parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP Request Logger
app.use(morganMiddleware);

// Rate Limiting
app.use('/api', apiRateLimiter);

// Health Check Endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', routes);

// Global Error Handler
app.use(errorHandler);

export default app;
