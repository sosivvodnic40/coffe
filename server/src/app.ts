import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from './config.js';
import { errorHandler } from './middleware/index.js';
import { apiRouter } from './routes/api.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: config.corsOrigin,
      methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
    }),
  );
  app.use(express.json({ limit: '1mb' }));

  app.use(
    '/api',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 200,
      standardHeaders: true,
      legacyHeaders: false,
    }),
    apiRouter,
  );

  app.use(errorHandler);

  if (config.nodeEnv === 'production') {
    const clientDist = path.resolve(__dirname, '../../dist');
    app.use(express.static(clientDist));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(clientDist, 'index.html'));
    });
  }

  return app;
}
